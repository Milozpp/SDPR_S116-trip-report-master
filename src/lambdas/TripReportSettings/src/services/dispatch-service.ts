import { IIgniteResponse } from "gcv-ignite/dist/interfaces";
import logger from "gcv-logger";
import { GCVErrors } from "gcv-utils";
import { IDataModels } from '../interfaces';
import { TripReportSettingsService } from "./trip-report-settings-service";

const LOG_PREFIX_CLASS = 'DispatchService |';

export class DispatchService {
    
    public async dispatch(inputParams: IDataModels.TripReportSettingsRequest): Promise<IDataModels.TripReportSettings | IIgniteResponse.GenericResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS} dispatch |`;
        logger.info(`${logPrefix} Start`);

        const tripReportSettingsService = new TripReportSettingsService()

        switch(inputParams.requestType) {
            case 'GET_DEFAULT_TRIP_REPORT_SETTINGS':
            case 'GET_TRIP_REPORT_SETTINGS':
                return tripReportSettingsService.getTripReportSettings(inputParams);
            case 'UPDATE_DEFAULT_TRIP_REPORT_SETTINGS':
            case 'UPDATE_TRIP_REPORT_SETTINGS':
                return tripReportSettingsService.updateTripReportSettings(inputParams);
            default:
                throw new GCVErrors.BadRequest('HttpMethod is not valid');
        }
    }
}