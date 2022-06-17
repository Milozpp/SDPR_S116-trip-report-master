import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Utilities } from 'gcv-utilities';
import * as Stubs from '../../stubs';
import { FactoryService } from '../../../src/services';
import { IgniteService } from 'gcv-ignite';
import { GetCustomTimeframeTripsSummaryService } from '../../../src/services/trip-getter-services/get-custom-timeframe-trips-summary-service';
import { VehicleDiscoveryService } from 'gcv-common-services/dist/services';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('CustomTimeframe trips summary details service', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequestCustomTimeframe)
    const getCustomTimeframeTripsSummaryService = new GetCustomTimeframeTripsSummaryService(request);

    beforeEach(async () => {
        sinon.stub(Utilities.SecretManagerService, 'loadSecret').resolves("");
        igniteService = await FactoryService.getIgniteService();
        sinon.stub(FactoryService, 'getIgniteService').resolves(igniteService);
        sinon.stub(getCustomTimeframeTripsSummaryService, 'preprocessVehicleDetails').resolves(void(0));
    });

    afterEach(() => sinon.restore());

    describe('executeRequest', async () => {

        it("should return the correct response", async () => {
            let customTimeframeTripsSummaryDetailsResponse = Utilities.clone(Stubs.CUSTOM_TIMEFRAME_TRIPS_SUMMARY_RESPONSE);
            sinon.stub(igniteService, 'getCustomTimeframeTripsSummaryDetails').resolves(Stubs.CUSTOM_TIMEFRAME_TRIPS_SUMMARY_RESPONSE);
            let res = await getCustomTimeframeTripsSummaryService.executeRequest()
            expect(res).to.be.deep.eq(
               customTimeframeTripsSummaryDetailsResponse
            );
        });
    });
});

describe('CustomTimeframe trips summary details service - error from database case', async () => {

    let igniteService: IgniteService;
    const request = Utilities.clone(Stubs.ValidRequestCustomTimeframe)
    const getCustomTimeframeTripsSummaryService = new GetCustomTimeframeTripsSummaryService(request);
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
            sinon.stub(igniteService, 'getCustomTimeframeTripsSummaryDetails').resolves(Stubs.CUSTOM_TIMEFRAME_TRIPS_SUMMARY_RESPONSE);
            await expect(getCustomTimeframeTripsSummaryService.executeRequest()).to.be.rejected
        });
    });
});