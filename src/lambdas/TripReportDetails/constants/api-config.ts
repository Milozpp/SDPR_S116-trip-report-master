import { IUtilInterface } from 'gcv-utilities';
import { IDataModels } from '../src/interfaces';
import { GetTripListSchema, TripIdDetailsSchema, GetLastTripSchema, TripStatusSchema } from '.';

export const ApiConfig: IUtilInterface.ApiConfig<IDataModels.RequestType> = {
    '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips': {
        get: {
            requestType: 'GET_TRIP_LIST',
            schema: GetTripListSchema,
        },
    },
    '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips/{tripid}': {
        get: {
            requestType: 'TRIP_ID_DETAILS',
            schema: TripIdDetailsSchema,
        },
    },
    '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips/last': {
        get: {
            requestType: 'GET_LAST_TRIP',
            schema: GetLastTripSchema
        }
    },
    '/v2/accounts/{userid}/vehicles/{vin}/tripreport/status': {
        post: {
            requestType: 'TRIP_STATUS',
            schema: TripStatusSchema
        }
    }
}