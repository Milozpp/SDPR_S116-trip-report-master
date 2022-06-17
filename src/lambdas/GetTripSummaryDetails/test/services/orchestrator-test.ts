import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as Stubs from '../stubs'
import { TripReportOrchestrator } from '../../src/services';
import { GCVErrors } from 'gcv-utilities';
import { GetWeeklyTripsSummaryService } from '../../src/services/trip-getter-services/get-weekly-trips-summary-service';
import { GetMonthlyTripsSummaryService } from '../../src/services/trip-getter-services/get-monthly-trips-summary-service';
import { GetDailyTripsSummaryService } from '../../src/services/trip-getter-services/get-daily-trips-summary-service';
import { GetCustomTimeframeTripsSummaryService } from '../../src/services/trip-getter-services/get-custom-timeframe-trips-summary-service';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('TripReportOrchestrator', () => {
    describe('getRequestedService', () =>{
        it('it should return a GetDailyTripsSummaryService object', () => {
            const res = TripReportOrchestrator.getRequestedService('DAILY_TRIPS', Stubs.ValidRequest)
            expect(res).to.be.instanceOf(GetDailyTripsSummaryService);
        });
        it('it should return a GetWeeklyTripsSummaryService object', () => {
            const res = TripReportOrchestrator.getRequestedService('WEEKLY_TRIPS', Stubs.ValidRequest)
            expect(res).to.be.instanceOf(GetWeeklyTripsSummaryService);
        });
        it('it should return a GetMonthlyTripsSummaryService object', () => {
            const res = TripReportOrchestrator.getRequestedService('MONTHLY_TRIPS', Stubs.ValidRequest)
            expect(res).to.be.instanceOf(GetMonthlyTripsSummaryService);
        });
        it('it should return a GetCustomTimeframeTripsSummaryService object', () => {
            const res = TripReportOrchestrator.getRequestedService('CUSTOM_TIMEFRAME_TRIPS', Stubs.ValidRequest)
            expect(res).to.be.instanceOf(GetCustomTimeframeTripsSummaryService);
        });
        it('it should throw Not Found error when service name is invalid', () => {
            //@ts-ignore
            expect(() => TripReportOrchestrator.getRequestedService('test', {})).to.throw(GCVErrors.NotFound);
        });
    });

});