import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { ServiceHandler } from '../../src/services';
import { Stubs } from '../stubs'
import { Utilities, GCVErrors } from 'gcv-utilities';
import { ApiConfig } from '../../constants';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceHandler', () => {
    const serviceHandler = new ServiceHandler(ApiConfig);

    afterEach(sinon.restore);

    describe('getServiceParmas', () => {

        ['POST', 'PUT', 'PATCH', 'DELETE'].forEach(httpMethod => {
            it(`Should throw a BadRequest error when http method is ${httpMethod} for trips api`, () => {
                expect(() => serviceHandler.getServiceParams({
                    //@ts-ignore
                    runTimeInfo: {
                        httpMethod: httpMethod,
                        resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips'
                    }
                })).to.throw(GCVErrors.BadRequest);
            });
        });

        ['POST'].forEach(httpMethod => {
            it(`Should throw a BadRequest error when http method is ${httpMethod} for status request`, () => {
                expect(() => serviceHandler.getServiceParams({
                    //@ts-ignore
                    runTimeInfo: {
                        httpMethod: httpMethod,
                        resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/status'
                    }
                })).to.throw(GCVErrors.BadRequest);
            });
        });

        it(`Should throw a BadRequest error when http method is undefined`, () => {
            expect(() => serviceHandler.getServiceParams({
                //@ts-ignore
                runTimeInfo: {
                    resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips'
                }
            })).to.throw(GCVErrors.BadRequest);
        });

        it(`Should throw a BadRequest error when resource path is invalid`, () => {
            expect(() => serviceHandler.getServiceParams({
                //@ts-ignore
                runTimeInfo: {
                    httpMethod: 'GET',
                    resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips/wrong'
                }
            })).to.throw(GCVErrors.BadRequest);
        });

        it(`Should throw a BadRequest error when resource path is undefined`, () => {
            expect(() => serviceHandler.getServiceParams({
                //@ts-ignore
                runTimeInfo: {
                    httpMethod: 'GET'
                }
            })).to.throw(GCVErrors.BadRequest);
        });

        Stubs.REQUEST_TYPE.forEach((requestType) => {
            it(`Should return an InvalidRequestParameter Error when ${requestType} event is invalid`, () => {
                const invalidEvent = Utilities.clone(Stubs.VALID_EVENTS[requestType])
                delete invalidEvent.pathParams;
                expect(() => serviceHandler.getServiceParams(invalidEvent)).to.throw(GCVErrors.InvalidRequestParameter);
            });

            it(`Should return a valid ${requestType} request object when event is valid`, () => {
                expect(serviceHandler.getServiceParams(Stubs.VALID_EVENTS[requestType])).to.be.deep.eq(Stubs.VALID_SERVICE_PARAMS[requestType]);
            });
        });
    });
});

