import { FactoryService } from './factory-service';
import { IDataModels } from "../interfaces";
import { Constants } from '../../constants';
import { GCVErrors } from 'gcv-utils';
import logger from 'gcv-logger';

const LOG_PREFIX_CLASS = "TripStatusService |";

export class TripStatusService {
    public async processRequest(serviceParams: IDataModels.TripStatus): Promise<IDataModels.Response> {
        const logPrefixFn = LOG_PREFIX_CLASS + 'processRequest |';
        try {
            const tripDbService = FactoryService.getTripReportDao();
            const mappingService = await FactoryService.getMappingService();

            const enrichedLocations = await mappingService.locationEnrichment(serviceParams.Data);

            logger.info(`${logPrefixFn} calling updateLastTripReport with serviceParam: ${JSON.stringify(serviceParams)}}`);
            await tripDbService.updateLastTripReportLight({
                userVin: serviceParams.userid + ':' + serviceParams.vehicleid,
                EventID: serviceParams.EventID,
                Version: serviceParams.Version,
                userid: serviceParams.userid,
                vin: serviceParams.vehicleid,
                Timestamp: serviceParams.Timestamp,
                Data: {
                    ...enrichedLocations,
                    tripId:serviceParams.Data.tripId!
                }
            });

            await this.publishEvent(
                serviceParams.vehicleid,
                serviceParams.userid,
                serviceParams.sessionid,
                serviceParams.Timestamp
            );
            return Constants.SUCCESS_RESPONSE as IDataModels.Response
        } catch (error) {
            if (error instanceof GCVErrors.PreconditionFailed) {
                throw new GCVErrors.InvalidRequestParameter('invalid timestamp or vin');
            } else if (error instanceof GCVErrors.NotFound){
                throw new GCVErrors.VehicleDoesNotExist("Vin doesn't exist")
            }
            throw error;
        }
    }

    public async publishEvent(vin: string, userid: string, eventId: string, timestampMS: number): Promise<void> {
        const logPrefix = LOG_PREFIX_CLASS + 'publishEvent |';
        const kinesisStreamMessage = [{
            eventType: Constants.KINESIS_EVENT.OUTPUT_EVENT_TYPE,
            timestamp: timestampMS,
            version: Constants.KINESIS_EVENT.OUTPUT_EVENT_VERSION,
            data: {
                userid: userid,
                vin: vin
            },
            gcvEventId: eventId
        }];

        logger.info(`${logPrefix} Publishing event: ${JSON.stringify(kinesisStreamMessage)}`);
        const kinesisStream = FactoryService.getKinesisStream();
        const publishResult = await kinesisStream.publishToKinesisStream(Constants.KINESIS_EVENT.TARGET_KINESIS_DATA_STREAM, vin, kinesisStreamMessage);
        logger.info(`${logPrefix} Publish result: ${JSON.stringify(publishResult)}`);
    }
}