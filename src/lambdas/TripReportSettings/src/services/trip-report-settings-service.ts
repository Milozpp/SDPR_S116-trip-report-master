import logger from 'gcv-logger';
import { IgniteService } from 'gcv-ignite';
import { IDataModels } from '../interfaces';
import { IIgniteRequest, IIgniteResponse } from 'gcv-ignite/dist/interfaces';
import { GCVErrors } from 'gcv-utils';
import { Currency } from '../interfaces/i-data-models';
import { Constants } from '../../constants';

const LOG_PREFIX_CLASS = "TripReportSettingsService |";

export class TripReportSettingsService {
    /**
     * @description This method is used to get the trip report settings
     * @private
     * @param {IDataModels.TripReportSettingsRequest} params
     * @returns {Promise<IDataModels.TripReportSettings>}
     * @memberof TripReportSettingsService
     */
     public async getTripReportSettings(params: IDataModels.TripReportSettingsRequest): Promise<IDataModels.TripReportSettings> {
        const logPrefix = `${LOG_PREFIX_CLASS} getTripReportSettings |`;

        const igniteInstance = await IgniteService.getInstance();

        if (params.requestType === 'GET_DEFAULT_TRIP_REPORT_SETTINGS') {
            const igniteResponse: IIgniteResponse.TripReport.GetSettings = await igniteInstance.getTripReportSettings(params.userid, params.vin);
            logger.debug(`${logPrefix} igniteResponse for default settings: ${JSON.stringify(igniteResponse)}`);
            return {
                isBusiness: igniteResponse.isBusiness,
                fuelCostPerGallon: igniteResponse.costPerLiter * Constants.LITER_TO_GALLON, //multiply costPerLiter with number of liter that stays in a Gallon
                costPerEnergy: igniteResponse.costPerEnergy,
                currency: igniteResponse.currency as Currency
            }
        } else if (params.requestType === 'GET_TRIP_REPORT_SETTINGS') {
            const igniteResponse: IIgniteResponse.TripReport.GetSettings = await igniteInstance.getTripReportSettings(params.userid, params.vin, params.tripid);
            logger.debug(`${logPrefix} igniteResponse for tripid (${params.tripid}) settings: ${JSON.stringify(igniteResponse)}`);
            return {
                isBusiness: igniteResponse.isBusiness,
                isFavorite: igniteResponse.isFavorite,
                fuelCostPerGallon: igniteResponse.costPerLiter * Constants.LITER_TO_GALLON, //multiply costPerLiter with number of liter that stays in a Gallon
                costPerEnergy: igniteResponse.costPerEnergy,
                currency: igniteResponse.currency as Currency
            }
        } else {
            throw new GCVErrors.BadRequest('Invalid Request');
        }
    }

    /**
     * @description This method is used to update the trip report settings
     * @private
     * @param {IDataModels.TripReportSettingsRequest} params
     * @returns {Promise<IIgniteResponse.GenericResponse>}
     * @memberof UserCommandPreferencesService
     */
    public async updateTripReportSettings(params: IDataModels.TripReportSettingsRequest): Promise<IIgniteResponse.GenericResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS} updateTripReportSettings |`;

        const igniteInstance = await IgniteService.getInstance();

        if (params.requestType === 'UPDATE_DEFAULT_TRIP_REPORT_SETTINGS') {
            const mappedTripReportSettings: IIgniteRequest.TripReport.Settings = {
                isBusiness: params.settings!.isBusiness,
                costPerLiter: params.settings!.fuelCostPerGallon / Constants.LITER_TO_GALLON, //divide fuelCostPerGallon by the number of liters that stays in a gallon
                costPerEnergy: params.settings!.costPerEnergy,
                currency: params.settings!.currency
            };

            const igniteResponse = await igniteInstance.updateTripReportSettings(params.userid, params.vin, mappedTripReportSettings);
            logger.debug(`${logPrefix} igniteResponse: ${JSON.stringify(igniteResponse)}`);
            return igniteResponse;

        } else if(params.requestType === 'UPDATE_TRIP_REPORT_SETTINGS') {
            const mappedTripReportSettings: IIgniteRequest.TripReport.Settings = {
                isBusiness: params.settings!.isBusiness,
                isFavorite: params.settings!.isFavorite,
                costPerLiter: params.settings!.fuelCostPerGallon / Constants.LITER_TO_GALLON, //divide fuelCostPerGallon by the number of liters that stays in a gallon
                costPerEnergy: params.settings!.costPerEnergy,
                currency: params.settings!.currency
            };

            const igniteResponse = await igniteInstance.updateTripReportSettings(params.userid, params.vin, mappedTripReportSettings, params.tripid);
            logger.debug(`${logPrefix} igniteResponse: ${JSON.stringify(igniteResponse)}`);
            return igniteResponse;

        } else {
            throw new GCVErrors.BadRequest('Invalid Request');
        }        
    }
}