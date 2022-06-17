import 'mocha'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { GCVErrors } from 'gcv-utilities';
import { AbstractTripGetterService } from '../../../src/services/trip-getter-services/abstract-trip-getter-service';
import * as Stubs from '../../stubs'

import { FactoryService } from '../../../src/services';
import { IIgniteResponse } from 'gcv-ignite/dist/interfaces';
import { clone } from 'gcv-utilities/dist/utilities';


chai.use(chaiAsPromised)


const VehicleDiscoveryStubs = Stubs.VehicleDiscoveryStubs;

class AbstractTripGetterServiceHelper extends AbstractTripGetterService {

    public async executeRequest(): Promise<IIgniteResponse.TripReport.TripReportSummaryResponse> {
        return {};
    }
}

describe('AbstractTripGetterService', () => {

    const abstractTripService = new AbstractTripGetterServiceHelper('DAILY_TRIPS', clone(Stubs.ValidRequest));

    describe('checkServiceId', () => {

        it('should return without errors', () => {
            const vehicle = VehicleDiscoveryStubs.ServiceEnabled.vehicles![0];
            //@ts-ignore
            expect(abstractTripService.checkServiceId(vehicle));
        });

        it('should throw BadRequest if service is disabled', () => {
            const vehicle = VehicleDiscoveryStubs.ServiceDisabled.vehicles![0];
            //@ts-ignore
            expect(() => abstractTripService.checkServiceId(vehicle)).to.throw(GCVErrors.BadRequest);
        });

        it('should throw BadRequest if service is not present', () => {
            const vehicle = VehicleDiscoveryStubs.ServiceNotPresent.vehicles![0];
            //@ts-ignore
            expect(() => abstractTripService.checkServiceId(vehicle)).to.throw(GCVErrors.BadRequest);
        });
    });

    describe('checkFuelType', () => {

        it('should return without errors', () => {
            const vehicle = VehicleDiscoveryStubs.ServiceEnabled.vehicles![0];
            //@ts-ignore
            expect(abstractTripService.checkFuelType(vehicle));
        });

        it('should throw NotFound if fuelType is not present', () => {
            const vehicle = VehicleDiscoveryStubs.ServiceDisabled.vehicles![0];
            //@ts-ignore
            delete vehicle.fuelType;
            //@ts-ignore
            expect(() => abstractTripService.checkFuelType(vehicle)).to.throw(GCVErrors.NotFound);
        });
    });

    describe('getVehicleDetails', () => {

        const vehicleDiscoveryService = FactoryService.getVehicleDiscoveryService();
        beforeEach(() => {
            sinon.stub(FactoryService, 'getVehicleDiscoveryService').returns(vehicleDiscoveryService);
        });

        afterEach(() => {
            sinon.restore()
        });

        it('should return without errors', async () => {
            sinon.stub(vehicleDiscoveryService, 'getVehicleDetails').resolves(VehicleDiscoveryStubs.ServiceEnabled);

            //@ts-ignore
            await expect(abstractTripService.getVehicleDetails(Stubs.ValidRequest.vin, Stubs.ValidRequest.userid)).to.not.be.eventually.rejected;
        });

    });

    describe('preprocessVehicleDetails', () => {

        const vehicle = VehicleDiscoveryStubs.ServiceEnabled.vehicles![0];

        afterEach(() => {
            sinon.restore()
        });

        it('should return without errors without checking FuelType', async () => {
            //@ts-ignore
            sinon.stub(abstractTripService, 'getVehicleDetails').resolves(vehicle);
            //@ts-ignore
            sinon.stub(abstractTripService, 'checkServiceId').returns(void(0));

            //@ts-ignore
            await expect(abstractTripService.preprocessVehicleDetails(Stubs.ValidRequest.vin, Stubs.ValidRequest.userid)).to.not.be.eventually.rejected;
        });

        it('should return without errors checking FuelType', async () => {
            //@ts-ignore
            sinon.stub(abstractTripService, 'getVehicleDetails').resolves(vehicle);
            //@ts-ignore
            sinon.stub(abstractTripService, 'checkServiceId').returns(void(0));
            //@ts-ignore
            sinon.stub(abstractTripService, 'checkFuelType').returns(void(0));

            //@ts-ignore
            await expect(abstractTripService.preprocessVehicleDetails(Stubs.ValidRequest.vin, Stubs.ValidRequest.userid, true)).to.not.be.eventually.rejected;
        });
    });

})