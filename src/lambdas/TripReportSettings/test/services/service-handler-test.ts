import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ServiceHandler } from '../../src/services/service-handler';
import { GCVErrors } from 'gcv-utilities';
import { TestingUtilities } from "gcv-testing-utilities";
import { TripReportSettingsStub } from '../stubs';
import { ApiConfig } from '../../constants';

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('getServiceParams', async () => {
    const serviceHandler = new ServiceHandler(ApiConfig);

    ['PUT', 'PATCH', 'DELETE'].forEach(httpMethod => {
        it(`Should throw an BadRequest error when http method is ${httpMethod}`, () => {        
            expect(() => serviceHandler.getServiceParams(
                TripReportSettingsStub.createApiGatewayTrasformedEvent(
                    TripReportSettingsStub.createRunTimeInfo(httpMethod, '/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings'),
                    {
                        userid: TripReportSettingsStub.USERID,
                        vin: TripReportSettingsStub.VIN
                    }
                )
            )).to.throw(GCVErrors.BadRequest);    
        })
    });

    [
        '/v2/accounts/{userid}/vehicles/{vin}/tripreport/setting', 
        '/v2/accounts/{userid}/vehicles/{vin}/tripreport/',
        '/v2/accounts/{userid}/vehicles/{vin}/tripreport/{tripid}'
    ].forEach(resourcePath => {
        it(`Should throw an BadRequest error when resource path is invalid: ${resourcePath}`, () => {

            expect(() => serviceHandler.getServiceParams(
                TripReportSettingsStub.createApiGatewayTrasformedEvent(
                    TripReportSettingsStub.createRunTimeInfo('GET', resourcePath),
                    undefined
                )
            )).to.throw(GCVErrors.BadRequest);    
        })
    });

    [
        {
            event: TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_EVENT, 
            request: TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST
        },
        {
            event: TripReportSettingsStub.VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_EVENT,
            request: TripReportSettingsStub.VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_REQUEST
        },
        {
            event: TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_EVENT,
            request: TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST
        },
        {
            event: TripReportSettingsStub.VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_EVENT,
            request: TripReportSettingsStub.VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_REQUEST
        }
    ].forEach((element) => {
        it('Should return a valid TripReportSettingsRequest object when event is valid', () => {
            expect(serviceHandler.getServiceParams(element.event)).to.be.deep.eq(element.request);
        })
    });
});

describe('jsonSchemaValidation', async () => {
    const serviceHandler = new ServiceHandler(ApiConfig);

    describe('GET_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
        async function jsonSchemaValidation() {
            const jsonSchemaValidationHelper = new TestingUtilities.JsonSchemaValidationHelper(
                TripReportSettingsStub.VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_EVENT,
                async (rootObj) => serviceHandler.getServiceParams(rootObj),
                GCVErrors.BadRequest
            )

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('pathParams', 'test-string')
                .addTestingInfo('pathParams', 1)
                .addTestingInfo('pathParams', false)
                .addTestingInfo('headers', 'test-string')
                .addTestingInfo('headers', 1)
                .addTestingInfo('headers', false)
                .build()
            
            await jsonSchemaValidationHelper.testSubObject()

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('userid', 1)
                .addTestingInfo('userid', false)
                .addTestingInfo('vin', 1)
                .addTestingInfo('vin', false)
                .withTestAdditionalProperties()
                .build();

            await jsonSchemaValidationHelper.testSubObject('pathParams');


            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('content-type', 1)
                .addTestingInfo('content-type', true)
                .addTestingInfo('content-type', 'test-string')
                .addTestingInfo('x-api-key', 1)
                .addTestingInfo('x-api-key', true)
                .addTestingInfo('x-originator-type', 1)
                .addTestingInfo('x-originator-type', true)
                .addTestingInfo('clientrequestid', 1)
                .build();

            await jsonSchemaValidationHelper.testSubObject('headers');
        }

        await jsonSchemaValidation();
    });

    describe('GET_TRIP_REPORT_SETTINGS', async () => {
        async function jsonSchemaValidation() {
            const jsonSchemaValidationHelper = new TestingUtilities.JsonSchemaValidationHelper(
                TripReportSettingsStub.VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_EVENT,
                async (rootObj) => serviceHandler.getServiceParams(rootObj),
                GCVErrors.BadRequest
            )

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('pathParams', 'test-string')
                .addTestingInfo('pathParams', 1)
                .addTestingInfo('pathParams', false)
                .addTestingInfo('headers', 'test-string')
                .addTestingInfo('headers', 1)
                .addTestingInfo('headers', false)
                .build()
            
            await jsonSchemaValidationHelper.testSubObject()

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('userid', 1)
                .addTestingInfo('userid', false)
                .addTestingInfo('vin', 1)
                .addTestingInfo('vin', false)
                .addTestingInfo('tripid', 1)
                .addTestingInfo('tripid', false)
                .withTestAdditionalProperties()
                .build();

            await jsonSchemaValidationHelper.testSubObject('pathParams');


            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('content-type', 1)
                .addTestingInfo('content-type', true)
                .addTestingInfo('content-type', 'test-string')
                .addTestingInfo('x-api-key', 1)
                .addTestingInfo('x-api-key', true)
                .addTestingInfo('x-originator-type', 1)
                .addTestingInfo('x-originator-type', true)
                .addTestingInfo('clientrequestid', 1)
                .build();

            await jsonSchemaValidationHelper.testSubObject('headers');
        }

        await jsonSchemaValidation();
    });

    describe('UPDATE_DEFAULT_TRIP_REPORT_SETTINGS', async () => {
        async function jsonSchemaValidation() {
            const jsonSchemaValidationHelper = new TestingUtilities.JsonSchemaValidationHelper(
                TripReportSettingsStub.VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_EVENT,
                async (rootObj) => serviceHandler.getServiceParams(rootObj),
                GCVErrors.BadRequest
            )

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('pathParams', 'test-string')
                .addTestingInfo('pathParams', 1)
                .addTestingInfo('pathParams', false)
                .addTestingInfo('headers', 'test-string')
                .addTestingInfo('headers', 1)
                .addTestingInfo('headers', false)
                .addTestingInfo('requestBody', 'test-string')
                .addTestingInfo('requestBody', 1)
                .addTestingInfo('requestBody', false)
                .build()
            
            await jsonSchemaValidationHelper.testSubObject()

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('userid', 1)
                .addTestingInfo('userid', false)
                .addTestingInfo('vin', 1)
                .addTestingInfo('vin', false)
                .withTestAdditionalProperties()
                .build();

            await jsonSchemaValidationHelper.testSubObject('pathParams');


            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('content-type', 1)
                .addTestingInfo('content-type', true)
                .addTestingInfo('content-type', 'test-string')
                .addTestingInfo('x-api-key', 1)
                .addTestingInfo('x-api-key', true)
                .addTestingInfo('x-originator-type', 1)
                .addTestingInfo('x-originator-type', true)
                .addTestingInfo('clientrequestid', 1)
                .build();

            await jsonSchemaValidationHelper.testSubObject('headers');

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('isBusiness', 1)
                .addTestingInfo('isBusiness', 'test-string')
                .addTestingInfo('fuelCostPerGallon', false)
                .addTestingInfo('fuelCostPerGallon', 'test-string')
                .withTestAdditionalProperties()
                .build()
            
            await jsonSchemaValidationHelper.testSubObject('requestBody');
        }

        await jsonSchemaValidation();
    });

    describe('UPDATE_TRIP_REPORT_SETTINGS', async () => {
        async function jsonSchemaValidation() {
            const jsonSchemaValidationHelper = new TestingUtilities.JsonSchemaValidationHelper(
                TripReportSettingsStub.VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_EVENT,
                async (rootObj) => serviceHandler.getServiceParams(rootObj),
                GCVErrors.BadRequest
            )

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('pathParams', 'test-string')
                .addTestingInfo('pathParams', 1)
                .addTestingInfo('pathParams', false)
                .addTestingInfo('headers', 'test-string')
                .addTestingInfo('headers', 1)
                .addTestingInfo('headers', false)
                .addTestingInfo('requestBody', 'test-string')
                .addTestingInfo('requestBody', 1)
                .addTestingInfo('requestBody', false)
                .build()
            
            await jsonSchemaValidationHelper.testSubObject()

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('userid', 1)
                .addTestingInfo('userid', false)
                .addTestingInfo('vin', 1)
                .addTestingInfo('vin', false)
                .addTestingInfo('tripid', 1)
                .addTestingInfo('tripid', false)
                .withTestAdditionalProperties()
                .build();

            await jsonSchemaValidationHelper.testSubObject('pathParams');


            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('content-type', 1)
                .addTestingInfo('content-type', true)
                .addTestingInfo('content-type', 'test-string')
                .addTestingInfo('x-api-key', 1)
                .addTestingInfo('x-api-key', true)
                .addTestingInfo('x-originator-type', 1)
                .addTestingInfo('x-originator-type', true)
                .addTestingInfo('clientrequestid', 1)
                .build();

            await jsonSchemaValidationHelper.testSubObject('headers');

            jsonSchemaValidationHelper
                .createConfig()
                .addTestingInfo('isBusiness', 1)
                .addTestingInfo('isBusiness', 'test-string')
                .addTestingInfo('isFavorite', 1)
                .addTestingInfo('isFavorite', 'test-string')
                .addTestingInfo('fuelCostPerGallon', false)
                .addTestingInfo('fuelCostPerGallon', 'test-string')
                .withTestAdditionalProperties()
                .build()
            
            await jsonSchemaValidationHelper.testSubObject('requestBody');

        }

        await jsonSchemaValidation();
    });
});