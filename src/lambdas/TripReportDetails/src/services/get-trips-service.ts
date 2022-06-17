import logger from 'gcv-logger';
import { IgniteInterface } from 'gcv-ignite';
import { IIgniteResponse } from 'gcv-ignite/dist/interfaces';
import { GCVErrors } from 'gcv-utils';
import { IDataModels } from '../interfaces';
import { FactoryService } from './factory-service';

const LOG_PREFIX_CLASS = 'GetTripsService |';
export class GetTripsService {

    public async getAllTripsDetails(serviceParams: IDataModels.GetTripListServiceParams): Promise<IgniteInterface.IIgniteResponse.TripReport.GetAllTripsDetailsBetweenDurationsResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS} getAllTripsDetails |`;

        logger.debug(`${logPrefix} serviceParams: ${JSON.stringify(serviceParams)}`);
        const igniteService = await FactoryService.getIgniteService();

        try {
            const queryParameters: IgniteInterface.IIgniteRequest.TripReport.Params = {
                since: serviceParams.since,
                till: serviceParams.till,
                offset: serviceParams.offset,
                size: serviceParams.size
            }
            const igniteReponse: IIgniteResponse.TripReport.GetAllTripsDetailsBetweenDurationsResponse = await igniteService.getAllTripsDetailsBetweenDurations(serviceParams.userid, serviceParams.vehicleid, queryParameters);

            return igniteReponse
            
        } catch (error) {
            if (error.errorCode === 404 && error.errorDetails === 'RELATIVE_DATA_NOT_FOUND') {
                logger.error(`${logPrefix} error: ${JSON.stringify(error)}`);
                return {
                    numRecords: 0,
                    trips: []
                };
            }
            logger.error(`${logPrefix} error: ${JSON.stringify(error)}`);
            throw error;

        }
    }

    public async getTripDetails(serviceParams: IDataModels.TripIdDetailsServiceParams): Promise<IgniteInterface.IIgniteResponse.TripReport.GetTripDetailsByTripId> {
        const logPrefix = `${LOG_PREFIX_CLASS} getTripDetails |`;

        logger.debug(`${logPrefix} serviceParams: ${JSON.stringify(serviceParams)}`);
        const igniteService = await FactoryService.getIgniteService();
        try {
            const igniteResponse: IIgniteResponse.TripReport.GetTripDetailsByTripId = await igniteService.getTripDetailsByTripIds(serviceParams.userid, serviceParams.vehicleid, serviceParams.tripids);
            const mappingService = FactoryService.getMappingService();

            const enrichedLocations = await mappingService.locationEnrichment(igniteResponse.trips[0]);
            const tripWithEvMode = await mappingService.addEvMode(igniteResponse.trips[0], serviceParams.vehicleid);
            
            return {
                detailType: igniteResponse.detailType,
                trips: [
                        {
                            ...tripWithEvMode,
                            ...enrichedLocations
                        }
                ]
            }
        } catch (error) {
            if (error.errorCode === 404 && error.errorDetails === 'RELATIVE_DATA_NOT_FOUND') {
                logger.error(`${logPrefix} error: ${JSON.stringify(error)}`);
                return {
                    detailType: 'fulltripdata',
                    trips: []
                };
            }
            logger.error(`${logPrefix} error: ${JSON.stringify(error)}`);
            throw error;
        }
    }

    /**
     * @description This method is used to get the last trip report given a userid and a vin
     * @private
     * @param {IDataModels.LastTripServiceParams} params
     * @returns {Promise<IDataModels.LastTripResponse>}
     * @memberof LastTripReportService
     */
    public async getLastTripReport(serviceParams: IDataModels.LastTripServiceParams): Promise<IDataModels.LastTripResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS} getLastTripReport |`;
        const { userid, vehicleid } = serviceParams;

        logger.debug(`${logPrefix} serviceParams: ${JSON.stringify(serviceParams)}`);

        try {
            const dbResponse = await FactoryService.getTripReportDao().getLastTripReportLight(userid, vehicleid);

            //if startLocation is undefined it means that the enrichment is not saved in the DB
            if(dbResponse.Data.startLocation === undefined) {
                logger.debug(`${logPrefix} case old TripReport without enrichment saved in DB dbResponse: ${JSON.stringify(dbResponse)}`);
                const trips = await this.getTripDetails({userid:serviceParams.userid,  vehicleid: serviceParams.vehicleid, tripids: [dbResponse.Data.tripId!]});
                return {
                    userVin: serviceParams.userid+":"+serviceParams.vehicleid,
                    EventID: dbResponse.EventID,
                    Version: dbResponse.Version,
                    Timestamp: dbResponse.Timestamp,
                    Data: trips.trips[0]
                };
            } else {
                //case new TripReport with enrichment already saved in DB
                logger.debug(`${logPrefix} case new TripReport with enrichment aleready saved in DB dbResponse: ${JSON.stringify(dbResponse)}`);
                const igniteService = await FactoryService.getIgniteService();
                const mappingService = FactoryService.getMappingService();

                const igniteResponse: IIgniteResponse.TripReport.GetTripDetailsByTripId = await igniteService.getTripDetailsByTripIds(serviceParams.userid, serviceParams.vehicleid,[dbResponse.Data.tripId!]);
                const tripWithEvMode = await mappingService.addEvMode(igniteResponse.trips[0], serviceParams.vehicleid);
                return {
                    userVin: serviceParams.userid+":"+serviceParams.vehicleid,
                    EventID: dbResponse.EventID,
                    Version: dbResponse.Version,
                    Timestamp: dbResponse.Timestamp,
                    Data: {
                        ...tripWithEvMode,                                     
                        startLocation: dbResponse.Data.startLocation,
                        endLocation: dbResponse.Data.endLocation
                    }
                };
            }
        } catch (error) {
            logger.error(`${logPrefix} Error: ${JSON.stringify(error)}`)
            if (error instanceof GCVErrors.NotFound) {
                logger.info(`${logPrefix} No last trip report found for { userid: ${userid}, vin: ${vehicleid}} - return empty response`);
                return {} as IDataModels.LastTripResponse;
            }
            throw error;
        }
    }
}