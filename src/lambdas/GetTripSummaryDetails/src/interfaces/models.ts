import { ITripGetterRequest } from "./i-trip-request-models";
export namespace Models {

    export interface ResourceConfig {
        path: string,
        method: 'GET',
        ignitePath: string,
        igniteMethod: string
    };

    export type Resource = "DAILY_TRIPS" | "WEEKLY_TRIPS" | "MONTHLY_TRIPS" | "CUSTOM_TIMEFRAME_TRIPS";

    export type Resources = {
        [key in Resource]: ResourceConfig;
    };

    export interface TripGetterServiceParams {
        serviceParams: ITripGetterRequest.ITripGetterRequest;
        serviceName: Resource;
    };
 
}
