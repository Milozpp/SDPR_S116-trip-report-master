import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Utilities } from 'gcv-utilities';
import * as Stubs from '../../stubs';
import { FactoryService } from '../../../src/services';
import { IgniteService } from 'gcv-ignite';
import { GetMonthlyTripsSummaryService } from '../../../src/services/trip-getter-services/get-monthly-trips-summary-service';
import { VehicleDiscoveryService } from 'gcv-common-services/dist/services';


chai.use(chaiAsPromised)
const expect = chai.expect;

describe('Monthly trips summary details service', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequest)
    const getMonthlyTripsSummaryService = new GetMonthlyTripsSummaryService(request);

    beforeEach(async () => {
        sinon.stub(Utilities.SecretManagerService, 'loadSecret').resolves("");
        igniteService = await FactoryService.getIgniteService();
        sinon.stub(FactoryService, 'getIgniteService').resolves(igniteService);
        sinon.stub(getMonthlyTripsSummaryService, 'preprocessVehicleDetails').resolves(void(0));
    });

    afterEach(() => sinon.restore());

    describe('executeRequest', async () => {

        it("should return the correct response", async () => {
            let monthlyTripsSummaryDetailsResponse = Utilities.clone(Stubs.MONTHLY_TRIPS_SUMMARY_RESPONSE);
            sinon.stub(igniteService, 'getMonthlyTripsSummaryDetails').resolves(Stubs.MONTHLY_TRIPS_SUMMARY_RESPONSE);
            let res = await getMonthlyTripsSummaryService.executeRequest();
            expect(res).to.be.deep.equal(
               monthlyTripsSummaryDetailsResponse
            );
        });
    });
});

describe('Monthly trips summary details service - error from database case', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequest)
    const getMonthlyTripsSummaryService = new GetMonthlyTripsSummaryService(request);
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
            sinon.stub(igniteService, 'getMonthlyTripsSummaryDetails').resolves(Stubs.MONTHLY_TRIPS_SUMMARY_RESPONSE);
            await expect(getMonthlyTripsSummaryService.executeRequest()).to.be.rejected
        });
    });
});