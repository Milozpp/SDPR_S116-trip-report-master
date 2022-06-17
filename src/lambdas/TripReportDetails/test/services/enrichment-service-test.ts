import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import { Utilities } from 'gcv-utilities';
import { TomTomDependencyFactory, TomTomServices } from 'gcv-tomtom';
import { FactoryService } from '../../src/services';
import { Stubs } from '../stubs'

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MappingService', () => {
    const mappingService = FactoryService.getMappingService();

    describe('locationEnrichment', () => {

        const vehicleCharacteristicsService = FactoryService.getVehicleCharacteristicsService();
        beforeEach(() => {
            sinon.stub(FactoryService, 'getVehicleCharacteristicsService').returns(vehicleCharacteristicsService);
        });

        afterEach(sinon.restore);

        for(let index = 0; index < Stubs.CHARACTERISTIC.length; index++) {

            it(`C_CHARACTERISTIC_CODE = ${[Stubs.CHARACTERISTIC[index]][0].C_CHARACTERISTIC_CODE} and C_VAL_CODE = ${[Stubs.CHARACTERISTIC[index]][0].C_VAL_CODE} `, async () => {

                sinon.stub(TomTomDependencyFactory, 'getApiKey').resolves('');
                sinon.stub(TomTomServices, 'batchSearch').resolves(Stubs.BATCH_RESPONSE);
                //@ts-ignore
                sinon.stub(vehicleCharacteristicsService, 'getVehicleCharacteristics').resolves([Stubs.CHARACTERISTIC[index]]);                
                const expectedResponse = Utilities.clone(Stubs.VALID_ENRICHED_TRIP_REPORT);

                if([Stubs.CHARACTERISTIC[index].mapped][0] === "hide")
                {
                    expectedResponse.evMode = [];
                    expectedResponse.evModePercentage = -1;
                }

                await expect(mappingService.locationEnrichment(Stubs.VALID_TRIP_REPORT)).to.be.eventually.deep.eq(Stubs.ENRICHED_LOCATIONS);
                await expect(mappingService.addEvMode(Stubs.VALID_ENRICHED_TRIP_REPORT, Stubs.VIN)).to.be.eventually.deep.eq(expectedResponse);
            });
        }

    });

    describe('keepEvMode', () => {

        it('Should return true if one characteristic respects the condition', async () => {
            const characteristics = [
                {
                    C_CHARACTERISTIC_CODE: 'test',
                    C_VAL_CODE: 'test'
                },
                {
                    C_CHARACTERISTIC_CODE: 'test',
                    C_VAL_CODE: 'test'
                },
                {
                    C_CHARACTERISTIC_CODE: 'ELT',
                    C_VAL_CODE: 'BEV'
                }
            ]
            //@ts-ignore
            expect(mappingService.keepEvMode(characteristics)).to.be.equal(true);
        });

        it('Should return false if no characteristic respects the condition', async () => {
            const characteristics = [
                {
                    C_CHARACTERISTIC_CODE: 'test',
                    C_VAL_CODE: 'test'
                },
                {
                    C_CHARACTERISTIC_CODE: 'ELT',
                    C_VAL_CODE: 'test'
                },
                {
                    C_CHARACTERISTIC_CODE: 'test',
                    C_VAL_CODE: 'BEV'
                }
            ]
            //@ts-ignore
            expect(mappingService.keepEvMode(characteristics)).to.be.equal(false);
        })

        it('Should return false if no characteristic is present', async () => {
            const characteristics = []
            //@ts-ignore
            expect(mappingService.keepEvMode(characteristics)).to.be.equal(false);
        })

    });
});