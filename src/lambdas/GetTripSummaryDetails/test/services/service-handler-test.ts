import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { clone } from 'gcv-utilities/dist/utilities';
import { GCVErrors } from 'gcv-utilities';
import { ServiceHandler } from '../../src/services';
import * as Stubs from '../stubs'

chai.use(chaiAsPromised)
const expect = chai.expect;

describe('Service Handler', () => {
    describe('getServiceParam', () =>{
        describe('Daily trips summary details', () => {
            it('will throw an error if invalid event is received (offset case)',()=>{
                const invalidEvent = clone(Stubs.validEventDaily);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['offset'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (size case)',()=>{
                const invalidEvent = clone(Stubs.validEventDaily);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['size'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (path params case)',()=>{
                const invalidEvent = clone(Stubs.validEventDaily);
                //@ts-ignore
                delete invalidEvent.pathParams;
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will extract the correct parameters',()=> {
                const event = clone(Stubs.validEventDaily);
                const response = ServiceHandler.getServiceParams(event);
                expect(response.serviceParams).to.be.deep.equal(Stubs.ValidRequest);
            });
        });
        describe('Weekly trips summary details', () => {
            it('will throw an error if invalid event is received (offset case)',()=>{
                const invalidEvent = clone(Stubs.validEventWeekly);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['offset'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (size case)',()=>{
                const invalidEvent = clone(Stubs.validEventWeekly);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['size'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (path params case)',()=>{
                const invalidEvent = clone(Stubs.validEventWeekly);
                //@ts-ignore
                delete invalidEvent.pathParams;
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will extract the correct parameters',()=> {
                const event = clone(Stubs.validEventWeekly);
                const response = ServiceHandler.getServiceParams(event);
                expect(response.serviceParams).to.be.deep.equal(Stubs.ValidRequest);
            });
        });
        describe('Monthly trips summary details', () => {
            it('will throw an error if invalid event is received (offset case)',()=>{
                const invalidEvent = clone(Stubs.validEventMonthly);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['offset'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (size case)',()=>{
                const invalidEvent = clone(Stubs.validEventMonthly);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['size'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (path params case)',()=>{
                const invalidEvent = clone(Stubs.validEventMonthly);
                //@ts-ignore
                delete invalidEvent.pathParams;
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will extract the correct parameters',()=> {
                const event = clone(Stubs.validEventMonthly);
                const response = ServiceHandler.getServiceParams(event);
                expect(response.serviceParams).to.be.deep.equal(Stubs.ValidRequest);
            });
        });
        describe('Custom timeframe trips summary details', () => {
            it('will throw an error if invalid event is received (till case)',()=>{
                const invalidEvent = clone(Stubs.validEventCustomTimeframe);
                //@ts-ignore
                delete invalidEvent.queryStringParams!['till'];
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will throw an error if invalid event is received (path params case)',()=>{
                const invalidEvent = clone(Stubs.validEventCustomTimeframe);
                //@ts-ignore
                delete invalidEvent.pathParams;
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.InvalidRequestParameter)
            });
            it('will extract the correct parameters',()=> {
                const event = clone(Stubs.validEventCustomTimeframe);
                const response = ServiceHandler.getServiceParams(event);
                expect(response.serviceParams).to.be.deep.equal(Stubs.ValidRequestCustomTimeframe);
            });
        });
    
        describe('Invalid Request', ()=>{
           it('will throw HttpMethodNotAllowed', ()=>{
                const invalidEvent = clone(Stubs.eventForUnexistingEndpoint);
                expect(() => ServiceHandler.getServiceParams(invalidEvent))
                .to.throw(GCVErrors.HttpMethodNotAllowed);
           });
        });
        describe('Invalid Service', ()=>{
            beforeEach(() => {
                sinon.stub(ServiceHandler, 'identifyRequestedService').resolves("I_DON'T_EXIST");
            });
            afterEach(() => sinon.restore());
            it('will throw NotFound', ()=>{
                 const input = clone(Stubs.validEventDaily);
                 expect(() => ServiceHandler.getServiceParams(input))
                 .to.throw(GCVErrors.NotFound);
            });
         });
    });

    describe('identifyRequestedService', () =>{
        it('will return the correct resource name (daily case)', ()=>{
            const input = clone(Stubs.validEventDaily);
            expect(ServiceHandler.identifyRequestedService(input))
            .to.be.deep.eq("DAILY_TRIPS");
       });
        it('will return the correct resource name (weekly case)', ()=>{
            const input = clone(Stubs.validEventWeekly);
            expect(ServiceHandler.identifyRequestedService(input))
            .to.be.deep.eq("WEEKLY_TRIPS");
       });
        it('will return the correct resource name (monthly case)', ()=>{
            const input = clone(Stubs.validEventMonthly);
            expect(ServiceHandler.identifyRequestedService(input))
            .to.be.deep.eq("MONTHLY_TRIPS");
       });
       it('will return the correct resource name (custom timeframe case)', ()=>{
        const input = clone(Stubs.validEventCustomTimeframe);
        expect(ServiceHandler.identifyRequestedService(input))
        .to.be.deep.eq("CUSTOM_TIMEFRAME_TRIPS");
   });
       it('will thow MethodNotAllowed if unexisting endpoint', ()=>{
        const input = clone(Stubs.eventForUnexistingEndpoint);
        expect(() => {ServiceHandler.identifyRequestedService(input)})
        .to.throw(GCVErrors.HttpMethodNotAllowed);
       });
    })

});