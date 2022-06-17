import logger from 'gcv-logger';
import { GCVErrors } from 'gcv-utilities';

import { ITripGetterRequest, Models } from '../interfaces';
import { AbstractTripGetterService } from './trip-getter-services/abstract-trip-getter-service';
import { GetDailyTripsSummaryService } from './trip-getter-services/get-daily-trips-summary-service';
import { GetWeeklyTripsSummaryService } from './trip-getter-services/get-weekly-trips-summary-service';
import { GetMonthlyTripsSummaryService } from './trip-getter-services/get-monthly-trips-summary-service';
import { GetCustomTimeframeTripsSummaryService } from './trip-getter-services/get-custom-timeframe-trips-summary-service';

const logPrefixClass = 'TripReportOrchestrator | ';

/**
 * @description class that instanciates a TripGetterService
 * @class TripReportgOrchestrator
 */
export class TripReportOrchestrator {

    /**
     * Matches resource name and returns the corresponding service object
     * @param {Models.Resource} serviceName
     * @param {ITripGetterRequest} serviceParams
     * @returns {AbstractTripGetterService}
     * @throws NotFound
     * @memberof TripReportOrchestrator
     */
    public static getRequestedService(serviceName: Models.Resource, serviceParams: ITripGetterRequest.ITripGetterRequest): AbstractTripGetterService {
        const logPrefix = logPrefixClass + 'getRequestedService |';
        logger.debug(`${logPrefix} Identifying requested service`);

        switch (serviceName) {
            case "DAILY_TRIPS":
                return new GetDailyTripsSummaryService(serviceParams);
            case "WEEKLY_TRIPS":
                return new GetWeeklyTripsSummaryService(serviceParams);
            case "MONTHLY_TRIPS":
                return new GetMonthlyTripsSummaryService(serviceParams);
            case "CUSTOM_TIMEFRAME_TRIPS":
                return new GetCustomTimeframeTripsSummaryService(serviceParams);
            default:
                throw new GCVErrors.NotFound('Service corresponding to endpoint not found');
        }
    }
}