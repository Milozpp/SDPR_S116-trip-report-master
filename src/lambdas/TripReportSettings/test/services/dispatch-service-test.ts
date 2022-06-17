import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { DispatchService, TripReportSettingsService } from "../../src/services";
import { GCVErrors } from 'gcv-utils';
import { TripReportSettingsStub } from '../stubs';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('dispatch', async () => {
    const dispatchService = new DispatchService();

    afterEach(sinon.restore);

    it('Should execute get operation when requestType=GET_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
        sinon.stub(TripReportSettingsService.prototype, 'getTripReportSettings').resolves(TripReportSettingsStub.DEFAULT_TRIP_REPORT_SETTINGS);
        await expect(dispatchService.dispatch(TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
            .to.not.be.eventually.rejected;
    });

    it('Should execute get operation when requestType=GET_TRIP_REPORT_SETTINGS', async () => {
        sinon.stub(TripReportSettingsService.prototype, 'getTripReportSettings').resolves(TripReportSettingsStub.TRIPID_TRIP_REPORT_SETTINGS);
        await expect(dispatchService.dispatch(TripReportSettingsStub.VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_REQUEST))
            .to.not.be.eventually.rejected;
    });

    it('Should execute update operation when requestType=UPDATE_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
        sinon.stub(TripReportSettingsService.prototype, 'updateTripReportSettings').resolves(TripReportSettingsStub.UPDATE_RESPONSE);
        await expect(dispatchService.dispatch(TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
            .to.not.be.eventually.rejected;
    });

    it('Should execute update operation when requestType=UPDATE_TRIP_REPORT_SETTINGS', async () => {
        sinon.stub(TripReportSettingsService.prototype, 'updateTripReportSettings').resolves(TripReportSettingsStub.UPDATE_RESPONSE);
        await expect(dispatchService.dispatch(TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
            .to.not.be.eventually.rejected;
    });

    it('Should throw a BadRequest error when requestType is not as expected', async () => {
        await expect(dispatchService.dispatch({
            //@ts-ignore
            requestType: 'TEST'
        })).to.be.eventually.rejectedWith(GCVErrors.BadRequest);
    });

    it('Should throw an error if TripReportSettingsService throws an error', async () => {
        sinon.stub(TripReportSettingsService.prototype, 'getTripReportSettings').throws(new GCVErrors.SystemException(''));
        await expect(dispatchService.dispatch(TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST))
            .to.be.eventually.rejectedWith(GCVErrors.SystemException);
    });
});
