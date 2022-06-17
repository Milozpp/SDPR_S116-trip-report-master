import { Models } from "../src/interfaces";

export const ENDPOINT_CONFIGURATION = {
    SERVICE_ID: "TRIPREPORT"
};


export const RESOURCES_CONFIGURATION: Models.Resources = {
    DAILY_TRIPS: {
        path: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/daily',
        method: 'GET',
        ignitePath: '/v1/tripreport/summary/daily',
        igniteMethod: 'GET'
    },
    WEEKLY_TRIPS: {
        path: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/weekly',
        method: 'GET',
        ignitePath: '/v1/tripreport/summary/weekly',
        igniteMethod: 'GET'
    },
    MONTHLY_TRIPS: {
        path: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/monthly',
        method: 'GET',
        ignitePath: '/v1/tripreport/summary/monthly',
        igniteMethod: 'GET'
    },
    CUSTOM_TIMEFRAME_TRIPS: {
        path: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/custom',
        method: 'GET',
        ignitePath: '/v1/tripreport/tripsummary',
        igniteMethod: 'GET'
    }
};