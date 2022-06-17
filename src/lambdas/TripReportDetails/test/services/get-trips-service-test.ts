import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { IgniteService } from 'gcv-ignite';
import { GCVErrors } from 'gcv-utils';
import { FactoryService } from '../../src/services/factory-service';
import { Stubs } from '../stubs';
import { IDataModels } from '../../src/interfaces';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('GetTripsIgniteService', async () => {
    const getTripsService = FactoryService.getTripsService();

    const mockIgniteService = new Stubs.MockIgniteService() as IgniteService;
    const tripReportDao = FactoryService.getTripReportDao();
    const mappingService = FactoryService.getMappingService();

    beforeEach(async () => {
        sinon.stub(IgniteService, 'getInstance').resolves(mockIgniteService);
        sinon.stub(FactoryService, 'getTripReportDao').returns(tripReportDao);
        sinon.stub(FactoryService, 'getMappingService').returns(mappingService);
    });

    afterEach(() => sinon.restore());

    describe('getAllTripsDetails', async () => {

        it("should return an empty response when Ignite throws a 404 RELATIVE_DATA_NOT_FOUND error", async () => {
            sinon.stub(mockIgniteService, 'getAllTripsDetailsBetweenDurations').throws({
                errorCode: 404,
                errorDetails: 'RELATIVE_DATA_NOT_FOUND'
            });
            await expect(
                getTripsService.getAllTripsDetails(
                    Stubs.VALID_SERVICE_PARAMS['GET_TRIP_LIST'].request as IDataModels.GetTripListServiceParams
                )
            ).to.be.eventually.deep.equal({
                numRecords: 0,
                trips: []
            });
        });

        it("should throw an error when Ignite throws it", async () => {
            sinon.stub(mockIgniteService, 'getAllTripsDetailsBetweenDurations').throws(new Error(''));
            await expect(
                getTripsService.getAllTripsDetails(
                    Stubs.VALID_SERVICE_PARAMS['GET_TRIP_LIST'].request as IDataModels.GetTripListServiceParams
                )
            ).to.be.eventually.rejectedWith(Error);
        });

        it("should return without errors", async () => {
            sinon.stub(mockIgniteService, 'getAllTripsDetailsBetweenDurations').resolves(Stubs.IGNITE_RESPONSES['GET_TRIP_LIST']);
            await expect(
                getTripsService.getAllTripsDetails(
                    Stubs.VALID_SERVICE_PARAMS['GET_TRIP_LIST'].request as IDataModels.GetTripListServiceParams
                )
            ).to.be.eventually.deep.equal(Stubs.VALID_LAMBDA_RESPONSES['GET_TRIP_LIST']);
        });

    });

    describe('getTripDetails', async () => {

        it("should return an empty response when Ignite throws a 404 RELATIVE_DATA_NOT_FOUND error", async () => {
            sinon.stub(mockIgniteService, 'getTripDetailsByTripIds').throws({
                errorCode: 404,
                errorDetails: 'RELATIVE_DATA_NOT_FOUND'
            });
            await expect(
                getTripsService.getTripDetails(
                    Stubs.VALID_SERVICE_PARAMS['TRIP_ID_DETAILS'].request as IDataModels.TripIdDetailsServiceParams
                )
            ).to.be.eventually.deep.equal({
                detailType: 'fulltripdata',
                trips: []
            });
        });

        it("should throw an error when Ignite throws it", async () => {
            sinon.stub(mockIgniteService, 'getTripDetailsByTripIds').throws(new Error(''));
            await expect(
                getTripsService.getTripDetails(
                    Stubs.VALID_SERVICE_PARAMS['TRIP_ID_DETAILS'].request as IDataModels.TripIdDetailsServiceParams
                )
            ).to.be.eventually.rejectedWith(Error);
        });

        it("should throw an error when locationEnrichment throws it", async () => {
            sinon.stub(mockIgniteService, 'getTripDetailsByTripIds').resolves(Stubs.IGNITE_RESPONSES['TRIP_ID_DETAILS']);
            sinon.stub(mappingService, 'locationEnrichment').throws(new Error(''))
            await expect(
                getTripsService.getTripDetails(
                    Stubs.VALID_SERVICE_PARAMS['TRIP_ID_DETAILS'].request as IDataModels.TripIdDetailsServiceParams
                )
            ).to.be.eventually.rejectedWith(Error);
        });

        it("should return without errors", async () => {
            sinon.stub(mockIgniteService, 'getTripDetailsByTripIds').resolves(Stubs.IGNITE_RESPONSES['TRIP_ID_DETAILS']);
            sinon.stub(mappingService, 'locationEnrichment').resolves(Stubs.ENRICHED_LOCATIONS);
            sinon.stub(mappingService, 'addEvMode').resolves(Stubs.VALID_ENRICHED_TRIP_REPORT);
            await expect(
                getTripsService.getTripDetails(
                    Stubs.VALID_SERVICE_PARAMS['TRIP_ID_DETAILS'].request as IDataModels.TripIdDetailsServiceParams
                )
            ).to.be.eventually.deep.equal(Stubs.VALID_LAMBDA_RESPONSES['TRIP_ID_DETAILS']);
        });

    });

    describe('getLastTripReport', async () => {

        afterEach(sinon.restore);

        it('should throw an error if dao throws it', async () => {
            sinon.stub(tripReportDao, 'getLastTripReportLight').throws(new Error());
            await expect(
                getTripsService.getLastTripReport(
                    Stubs.VALID_SERVICE_PARAMS['GET_LAST_TRIP'].request as IDataModels.LastTripServiceParams
                )
            ).to.be.eventually.rejectedWith(Error);
        });

        it('should return an empty response if dao throws NotFound error', async () => {
            sinon.stub(tripReportDao, 'getLastTripReportLight').throws(new GCVErrors.NotFound(''));
            await expect(                
                getTripsService.getLastTripReport(
                    Stubs.VALID_SERVICE_PARAMS['GET_LAST_TRIP'].request as IDataModels.LastTripServiceParams
                )
            ).to.be.eventually.deep.eq({});
        });

        it('should return a valid object when dao response is a new enriched trip report', async () => {
            const dynamodbResponse = Stubs.DYNAMODB_RESPONSES['GET_LAST_TRIP_ENRICHED'];
            sinon.stub(tripReportDao, 'getLastTripReportLight').resolves(dynamodbResponse);
            sinon.stub(mockIgniteService, 'getTripDetailsByTripIds').resolves(Stubs.IGNITE_RESPONSES['TRIP_ID_DETAILS']);
            sinon.stub(mappingService, 'addEvMode').resolves(Stubs.VALID_ENRICHED_TRIP_REPORT2);
            await expect(
                getTripsService.getLastTripReport(
                    Stubs.VALID_SERVICE_PARAMS['GET_LAST_TRIP'].request as IDataModels.LastTripServiceParams
                )
            ).to.be.eventually.deep.eq(Stubs.VALID_LAMBDA_RESPONSES['GET_LAST_TRIP']);
        });

        it('should return a valid object when dao response is an old trip report not enriched', async () => {
            const dynamodbResponse = Stubs.DYNAMODB_RESPONSES['GET_LAST_TRIP_NOT_ENRICHED'];
            sinon.stub(tripReportDao, 'getLastTripReportLight').resolves(dynamodbResponse);
            sinon.stub(getTripsService, 'getTripDetails').resolves(Stubs.TRIP_DETAILS_BY_ID);
            await expect(
                getTripsService.getLastTripReport(
                    Stubs.VALID_SERVICE_PARAMS['GET_LAST_TRIP'].request as IDataModels.LastTripServiceParams
                )
            ).to.be.eventually.deep.eq(Stubs.VALID_LAMBDA_RESPONSES['GET_LAST_TRIP']);
        });
    });
});