import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Utilities } from 'gcv-utilities';
import * as Stubs from '../../stubs';
import { FactoryService } from '../../../src/services';
import { IgniteService } from 'gcv-ignite';
import { VehicleDiscoveryService } from 'gcv-common-services/dist/services';
import { GetDailyTripsSummaryService } from '../../../src/services/trip-getter-services/get-daily-trips-summary-service';


chai.use(chaiAsPromised)
const expect = chai.expect;

describe('Daily trips summary details service', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequest)
    const getDailyTripsSummaryService = new GetDailyTripsSummaryService(request);

    beforeEach(async () => {
        sinon.stub(Utilities.SecretManagerService, 'loadSecret').resolves("");
        igniteService = await FactoryService.getIgniteService();
        sinon.stub(FactoryService, 'getIgniteService').resolves(igniteService);
        sinon.stub(getDailyTripsSummaryService, 'preprocessVehicleDetails').resolves(void(0));
    });

    afterEach(() => sinon.restore());

    describe('executeRequest', async () => {

        it("should return the correct response", async () => {
            let dailyTripsSummaryDetailsResponse = Utilities.clone(Stubs.DAILY_TRIPS_SUMMARY_RESPONSE);
            sinon.stub(igniteService, 'getDailyTripsSummaryDetails').resolves(Stubs.DAILY_TRIPS_SUMMARY_RESPONSE);
            let res = await getDailyTripsSummaryService.executeRequest();
            expect(res).to.be.deep.equal(
               dailyTripsSummaryDetailsResponse
            );
        });
    });
});


describe('Daily trips summary details service - error from database case', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequest)
    const getDailyTripsSummaryService = new GetDailyTripsSummaryService(request);
    let vehicleDiscoveryService : VehicleDiscoveryService;

    beforeEach(async () => {
        sinon.stub(Utilities.SecretManagerService, 'loadSecret').resolves("");
        igniteService = await FactoryService.getIgniteService();
        vehicleDiscoveryService = await FactoryService.getVehicleDiscoveryService();
        sinon.stub(FactoryService, 'getIgniteService').resolves(igniteService);
        sinon.stub(vehicleDiscoveryService, 'getVehicleDetails').throws()
        sinon.stub(FactoryService, 'getVehicleDiscoveryService').resolves(vehicleDiscoveryService);
    });

    afterEach(() => sinon.restore());

    describe('executeRequest', async () => {

        it("should return the correct response", async () => {
            sinon.stub(igniteService, 'getDailyTripsSummaryDetails').resolves(Stubs.DAILY_TRIPS_SUMMARY_RESPONSE);
            await expect(getDailyTripsSummaryService.executeRequest()).to.be.rejected
        });
    });
});