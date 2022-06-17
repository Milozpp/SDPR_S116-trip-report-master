import { IUtilInterface } from 'gcv-utilities';
import { IDataModels } from '../src/interfaces';
import { GetDefaultTripReportSettings, GetTripReportSettings, UpdateDefaultTripReportSettings, UpdateTripReportSettings } from '.';

export const ApiConfig: IUtilInterface.ApiConfig<IDataModels.RequestType> = {
    "/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings": {
        get: {
            requestType:"GET_DEFAULT_TRIP_REPORT_SETTINGS",
            schema: GetDefaultTripReportSettings
        },
        post: { 
            requestType:"UPDATE_DEFAULT_TRIP_REPORT_SETTINGS",
            schema: UpdateDefaultTripReportSettings
        }
    },
    "/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings/{tripid}": {
        get: {
            requestType:"GET_TRIP_REPORT_SETTINGS",
            schema: GetTripReportSettings
        },
        post: {
            requestType:"UPDATE_TRIP_REPORT_SETTINGS",
            schema: UpdateTripReportSettings
        }
    }
}