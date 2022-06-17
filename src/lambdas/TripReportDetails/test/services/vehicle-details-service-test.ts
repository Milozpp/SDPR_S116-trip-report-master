import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { GCVErrors } from 'gcv-utils';
import { FactoryService } from '../../src/services';
import { Stubs } from '../stubs'
import { WiseServices } from "gcv-vehicle-dao";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('VehicleDetailsService', () => {
    const vehicleDetailsService = FactoryService.getVehicleDetailsService();

    describe('checkVehicleDetails', async ()  => {
        const wiseService = new WiseServices();
        beforeEach(() => {
            sinon.stub(FactoryService, 'getWiseServices').resolves(wiseService);
        });

        afterEach(sinon.restore);

        it('should throw a BadRequest error if vehicle is not associated to userid', async () => {
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            await expect(vehicleDetailsService.checkVehicleDetails(Stubs.VIN, 'fakeUser')).to.be.rejectedWith(GCVErrors.Forbidden);
        });
        
        it('should throw a BadRequest error if service is not enabled', async () => {
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA_WITH_SERVICE_NOT_ENABLED);
            await expect(vehicleDetailsService.checkVehicleDetails(Stubs.VIN, Stubs.USER_ID)).to.be.rejectedWith(GCVErrors.BadRequest);
        });

        it('should throw a VehicleDoesNotExist error if vin doesn\'t exist', async () => {
            sinon.stub(wiseService, 'getVehicleMasterData').rejects(new GCVErrors.NotFound('vin not found'));  
            await expect(vehicleDetailsService.checkVehicleDetails(Stubs.VIN, Stubs.USER_ID)).to.be.rejectedWith(GCVErrors.VehicleDoesNotExist);
        });

        it('should return without errors', async () => {
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            await expect(vehicleDetailsService.checkVehicleDetails(Stubs.VIN, Stubs.USER_ID)).to.not.be.eventually.rejected;
        });
    });
});