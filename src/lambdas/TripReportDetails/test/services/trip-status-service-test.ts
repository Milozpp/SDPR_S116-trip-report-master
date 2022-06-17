
import { FactoryService } from './../../src/services/factory-service';
import { TripStatusService } from './../../src/services/trip-status-service';
import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Stubs } from '../stubs'
import { WiseServices } from "gcv-vehicle-dao";
import { GCVErrors } from 'gcv-utils';
import { Constants } from '../../constants';
import { IDataModels } from '../../src/interfaces';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('TripStatusService', () => {
    const testedTripStatusService = new TripStatusService();

    describe('processRequest', async () => {          
        const wiseService = new WiseServices();
        const dynamoDao = FactoryService.getTripReportDao();
        const kinesisStream = FactoryService.getKinesisStream();
        const mappingService = FactoryService.getMappingService();

        beforeEach(() => {
            sinon.stub(FactoryService, 'getWiseServices').resolves(wiseService);
            sinon.stub(FactoryService, "getTripReportDao").returns(dynamoDao);
            sinon.stub(FactoryService, "getKinesisStream").returns(kinesisStream);
            sinon.stub(FactoryService, 'getMappingService').returns(mappingService);
        });
    
        afterEach(sinon.restore);

        it('should not throw any error calling dynamo-dao', async () => {
            sinon.stub(dynamoDao, 'updateLastTripReportLight').resolves();
            sinon.stub(kinesisStream, 'publishToKinesisStream').resolves();
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            const testResp = await testedTripStatusService.processRequest(Stubs.VALID_SERVICE_PARAMS['TRIP_STATUS'].request as IDataModels.TripStatus);
            await expect(testResp).to.be.equals(Constants.SUCCESS_RESPONSE);
        })

        it('should not throw any error calling dynamo-dao', async () => {            
            sinon.stub(dynamoDao, 'updateLastTripReportLight').resolves();
            sinon.stub(kinesisStream, 'publishToKinesisStream').resolves();
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            const svcParams = Stubs.VALID_SERVICE_PARAMS['TRIP_STATUS'].request as IDataModels.TripStatus;
            //@ts-ignore
            delete svcParams.Data.isFavouriteTrip;
            const testResp = await testedTripStatusService.processRequest(svcParams);
            await expect(testResp).to.be.equals(Constants.SUCCESS_RESPONSE);
        })

        
        it('should throw error InvalidRequestParameter calling dynamo with Undefined or empty fields', async () => {
            const invalidSvc =  Stubs.VALID_SERVICE_PARAMS['TRIP_STATUS'].request as IDataModels.TripStatus;
            //@ts-ignore
            delete invalidSvc.userVin;
            sinon.stub(dynamoDao, 'updateLastTripReportLight').rejects(new GCVErrors.InvalidRequestParameter("Undefined or empty fields"));
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            await expect(testedTripStatusService.processRequest(invalidSvc)).rejectedWith(GCVErrors.InvalidRequestParameter);
        })

        it('should throw error db error calling dynamo', async () => {            
            sinon.stub(dynamoDao, 'updateLastTripReportLight').rejects(new GCVErrors.DbException("Generic DB error"));
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            await expect(testedTripStatusService.processRequest(Stubs.VALID_SERVICE_PARAMS['TRIP_STATUS'].request as IDataModels.TripStatus))
            .to.be.rejectedWith(GCVErrors.DbException);
        })

        it('should throw InvalidRequestParameter when ConditionExpression is not validated', async () => {            
            sinon.stub(wiseService, 'getVehicleMasterData').resolves(Stubs.VEHICLE_MASTER_DATA);
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(dynamoDao, 'updateLastTripReportLight').rejects(new GCVErrors.PreconditionFailed("PreconditionFailed"));
            await expect(testedTripStatusService.processRequest(Stubs.VALID_SERVICE_PARAMS['TRIP_STATUS'].request as IDataModels.TripStatus))
            .to.be.rejectedWith(GCVErrors.InvalidRequestParameter)
        })
    });
});
