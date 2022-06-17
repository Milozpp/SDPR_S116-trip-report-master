import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { GCVErrors } from 'gcv-utils';
import { DispatchService, FactoryService } from '../../src/services';
import { Stubs } from '../stubs';
import { IDataModels } from '../../src/interfaces';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DispatchService', async () => {
    const dispatcher = new DispatchService();

    const tripsService = FactoryService.getTripsService();
    const tripStatusService = FactoryService.getTripStatusService();
    const vehicleDetailsService = FactoryService.getVehicleDetailsService();

    beforeEach(async () => {
        sinon.stub(FactoryService, 'getTripsService').returns(tripsService);
        sinon.stub(FactoryService, 'getTripStatusService').returns(tripStatusService);
        sinon.stub(FactoryService, 'getVehicleDetailsService').returns(vehicleDetailsService);
    });

    afterEach(() => sinon.restore());

    describe('processRequest', async () => {

        it("should throw an error when VehicleDetailsService throws it", async () => {
            sinon.stub(vehicleDetailsService, 'checkVehicleDetails').throws(Error);
            await expect(
                dispatcher.processRequest(
                    Stubs.VALID_SERVICE_PARAMS['GET_TRIP_LIST']
                    )
            ).to.be.eventually.rejectedWith(Error);
        });

        it("should throw a ServiceNotSupported error when requestType is not supported", async () => {
            sinon.stub(vehicleDetailsService, 'checkVehicleDetails').resolves();
            const invalidServiceParams: IDataModels.ServiceParams = {
                //@ts-ignore
                requestType: 'WRONG',
                request: {
                    vehicleid: Stubs.VIN,
                    userid: Stubs.USER_ID
                }
            }
            await expect(
                dispatcher.processRequest(
                    invalidServiceParams
                )
            ).to.be.eventually.rejectedWith(GCVErrors.ServiceNotSupported);
    });

        Stubs.REQUEST_TYPE.forEach(requestType => {
            it(`should return a valid ${requestType} response`, async () => {
                sinon.stub(vehicleDetailsService, 'checkVehicleDetails').resolves();
                if(requestType === 'TRIP_STATUS'){
                    sinon.stub(tripStatusService, Stubs.TRIP_SERVICE_FUNCTION[requestType]).resolves(Stubs.VALID_LAMBDA_RESPONSES[requestType]);
                } else {
                    sinon.stub(tripsService, Stubs.TRIP_SERVICE_FUNCTION[requestType]).resolves(Stubs.VALID_LAMBDA_RESPONSES[requestType]);
                }
                await expect(
                    dispatcher.processRequest(
                        Stubs.VALID_SERVICE_PARAMS[requestType]
                    )
                ).to.be.eventually.deep.equal(Stubs.VALID_LAMBDA_RESPONSES[requestType]);
            });    
        })

    });

});