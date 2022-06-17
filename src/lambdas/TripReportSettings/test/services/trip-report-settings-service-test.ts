import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { TripReportSettingsService } from "../../src/services";
import { GCVErrors } from 'gcv-utils';
import { IgniteService } from 'gcv-ignite';
import { TripReportSettingsStub } from '../stubs';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('TripReportSettingsService', async () => {
    const tripReportSettingsService = new TripReportSettingsService();
    const mockIgniteService = new TripReportSettingsStub.MockIgniteService();

    describe('getTripReportSettings', async () => {
        beforeEach(() => {
            //@ts-ignore
            sinon.stub(IgniteService, 'getInstance').resolves(mockIgniteService)
        });

        afterEach(sinon.restore);
        
        it('Should throw a BadRequest error when requestType is not as expected', async () => {
            await expect(tripReportSettingsService.getTripReportSettings({
                //@ts-ignore
                requestType: 'TEST'
            })).to.be.eventually.rejectedWith(GCVErrors.BadRequest);
        });

        it('Should return a valid default object when requestType=GET_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
            sinon.stub(mockIgniteService, 'getTripReportSettings').resolves(TripReportSettingsStub.DEFAULT_IGNITE_RESPONSE);
            await expect(tripReportSettingsService.getTripReportSettings(TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
                .to.be.eventually.deep.eq(TripReportSettingsStub.DEFAULT_TRIP_REPORT_SETTINGS)
        });

        it('Should return a valid default object when requestType=GET_TRIP_REPORT_SETTINGS', async () => {
            sinon.stub(mockIgniteService, 'getTripReportSettings').resolves(TripReportSettingsStub.TRIPID_IGNITE_RESPONSE);
            await expect(tripReportSettingsService.getTripReportSettings(TripReportSettingsStub.VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_REQUEST))
                .to.be.eventually.deep.eq(TripReportSettingsStub.TRIPID_TRIP_REPORT_SETTINGS)
        });
    });
    
    describe('updateTripReportSettings', async () => {
        beforeEach(() => {
            //@ts-ignore
            sinon.stub(IgniteService, 'getInstance').resolves(mockIgniteService)
        });

        afterEach(sinon.restore);
    
        it('Should throw a BadRequest error when requestType is not as expected', async () => {
            await expect(tripReportSettingsService.updateTripReportSettings({
                //@ts-ignore
                requestType: 'TEST'
            })).to.be.eventually.rejectedWith(GCVErrors.BadRequest);
        });

        it('Should return a success response when requestType=UPDATE_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
            sinon.stub(mockIgniteService, 'updateTripReportSettings').resolves(TripReportSettingsStub.UPDATE_RESPONSE);
            await expect(tripReportSettingsService.updateTripReportSettings(TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
                .to.be.eventually.deep.eq(TripReportSettingsStub.UPDATE_RESPONSE)
        });

        it('Should return a success response when requestType=UPDATE_TRIP_REPORT_SETTINGS', async () => {
            sinon.stub(mockIgniteService, 'updateTripReportSettings').resolves(TripReportSettingsStub.UPDATE_RESPONSE);
            await expect(tripReportSettingsService.updateTripReportSettings(TripReportSettingsStub.VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_REQUEST))
                .to.be.eventually.deep.eq(TripReportSettingsStub.UPDATE_RESPONSE)
        });
    });
})

