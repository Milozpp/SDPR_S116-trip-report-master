import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Utilities } from 'gcv-utilities';
import * as Stubs from '../../stubs';
import { FactoryService } from '../../../src/services';
import { IgniteService } from 'gcv-ignite';
import { GetWeeklyTripsSummaryService } from '../../../src/services/trip-getter-services/get-weekly-trips-summary-service';
import { VehicleDiscoveryService } from 'gcv-common-services/dist/services';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('Weekly trips summary details service', async () => {

    //@ts-ignore
    const igniteService = new IgniteService();
    const request = Utilities.clone(Stubs.ValidRequest)
    const getWeeklyTripsSummaryService = new GetWeeklyTripsSummaryService(request);

    beforeEach(async () => {
        sinon.stub(Utilities.SecretManagerService, 'loadSecret').resolves("");
        sinon.stub(FactoryService, 'getIgniteService').resolves(igniteService);
        sinon.stub(getWeeklyTripsSummaryService, 'preprocessVehicleDetails').resolves(void(0));
    });

    afterEach(() => sinon.restore());

    describe('executeRequest', async () => {

        it("should return the correct response", async () => {
            let weeklyTripsSummaryDetailsResponse = Utilities.clone(Stubs.WEEKLY_TRIPS_SUMMARY_RESPONSE);
            sinon.stub(igniteService, 'getWeeklyTripsSummaryDetails').resolves(Stubs.WEEKLY_TRIPS_SUMMARY_RESPONSE);
            let res = await getWeeklyTripsSummaryService.executeRequest()
            expect(res).to.be.deep.eq(
               weeklyTripsSummaryDetailsResponse
            );
        });
    });
});

describe('Weekly trips summary details service - error from database case', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequest)
    const getWeeklyTripsSummaryService = new GetWeeklyTripsSummaryService(request);
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
            sinon.stub(igniteService, 'getWeeklyTripsSummaryDetails').resolves(Stubs.WEEKLY_TRIPS_SUMMARY_RESPONSE);
            await expect(getWeeklyTripsSummaryService.executeRequest()).to.be.rejected
        });
    });
});