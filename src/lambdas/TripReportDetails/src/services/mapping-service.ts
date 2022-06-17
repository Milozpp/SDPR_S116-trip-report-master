import logger from 'gcv-logger';
import { IgniteInterface } from 'gcv-ignite';
import { TomTom, TomTomDependencyFactory, TomTomServices } from 'gcv-tomtom';
import { NearbySearchResponseSchema, ReverseGeocodeResponseSchema } from 'gcv-tomtom/dist/constants/schemas';
import { VehicleCharacteristic } from 'gcv-wisedb-dao/dist/interfaces/i-vehicle-characteristics';
import { ExtendedLocation } from 'gcv-dynamodb-dao/dist/interfaces/i-trip-report';
import { REQUEST_ORDER_BATCH } from '../../constants/constants';
import { Constants } from '../../constants/constants';
import { FactoryService } from "./factory-service";
import { EnrichedLocations, TripReport } from "../interfaces/i-data-models";

const logPrefixClass = 'MappingService | ';
export class MappingService {
    /**
     * GIVEN a trip
     * WHEN tomtomservice is UP AND RUNNING 
     * THEN return a promise of TripReportDetailsEnriched 
     * @param tripReport : TripReportDetails
     * @returns Promise<TripReportDetailsEnriched[]>
     */
    public async locationEnrichment(tripReport: TripReport): Promise<EnrichedLocations> {
        const logPrefix = logPrefixClass + 'locationEnrichment |';

        logger.debug(`${logPrefix} # START # tripReport ->  ${JSON.stringify(tripReport)}`);

        const optionsForBatchQ: TomTom.BatchSearchOption[] = [];
        
        optionsForBatchQ.push(...this.createOptionsForBatchQ(tripReport.startLocation!, tripReport.endLocation!));

        const apiKey = await TomTomDependencyFactory.getApiKey();

        //Now i have all the options so i'm able to make the bulkQ
        const response: TomTom.BatchSearchResponse = await TomTomServices.batchSearch(optionsForBatchQ, apiKey);

        const resSearchStartLocation: TomTom.BatchResponseItem = response.batchItems[REQUEST_ORDER_BATCH["SEARCH_START_LOCATION"]]
        const resSearchEndLocation: TomTom.BatchResponseItem = response.batchItems[REQUEST_ORDER_BATCH["SEARCH_END_LOCATION"]]
        const resReverseStartLocation: TomTom.BatchResponseItem = response.batchItems[REQUEST_ORDER_BATCH["REVERSE_START_LOCATION"]]
        const resReverseEndLocation: TomTom.BatchResponseItem = response.batchItems[REQUEST_ORDER_BATCH["REVERSE_END_LOCATION"]]

        const enrichedStartLocation: ExtendedLocation = this.getEnrichedLocation(resSearchStartLocation, resReverseStartLocation, tripReport.startLocation!)
        const enrichedEndLocation: ExtendedLocation = this.getEnrichedLocation(resSearchEndLocation, resReverseEndLocation, tripReport.endLocation!)

        return {
            startLocation: enrichedStartLocation,
            endLocation: enrichedEndLocation
        };
    }

    /**
     * GIVEN startLoaction, reverseLocation and location 
     * WHEN tomtomAPI returns valid data
     * THEN we filter the data with different logic and return the desired record
     * 
     * @param searchStartLocation 
     * @param reverseStartLocation 
     * @param location 
     * @returns 
     */
    private getEnrichedLocation(searchLocation: TomTom.BatchResponseItem, reverseLocation: TomTom.BatchResponseItem,
        location: IgniteInterface.IIgniteResponse.TripReport.LocationCoord): ExtendedLocation {
        const nearbySearch = searchLocation.response as TomTom.NearbySearchResponse;
        if (nearbySearch.results.length > 0) {
            return {
                ...location,
                locationName: nearbySearch.results[0].poi?.name,
                address: nearbySearch.results[0].address ?? {}
            }
        }

        const revGeocode = reverseLocation.response as TomTom.ReverseGeocodeResponse;
        if (revGeocode.addresses && revGeocode.addresses.length > 0 && revGeocode.addresses[0].address) {
            return {
                ...location,
                address: revGeocode.addresses[0].address
            }
        }

        return {
            ...location,
            address: {}
        }
    }

    public async addEvMode(tripReport: TripReport, vin: string): Promise<TripReport>{

        const logPrefix = logPrefixClass + 'addEvMode |';

        const vehicleCharacteristicsService = FactoryService.getVehicleCharacteristicsService();
        const characteristics = await vehicleCharacteristicsService.getVehicleCharacteristics(vin);
        logger.debug(`${logPrefix} # characteristics from getVehicleCharacteristics ->  ${JSON.stringify(characteristics)}`);

        const keepEvMode: boolean = this.keepEvMode(characteristics);

        return {
            ...tripReport,
            evModePercentage: keepEvMode ? tripReport.evModePercentage : -1,
            evMode: keepEvMode ? tripReport.evMode : []
        }
    }

    private keepEvMode(characteristics: VehicleCharacteristic[]): boolean {
        return characteristics.find(characteristic => {
            return characteristic &&
                characteristic.C_CHARACTERISTIC_CODE === Constants.C_CHARACTERISTIC_CODE_ELT &&
                Constants.FUEL_TYPES_HAVING_REGENERATION_SCORE.includes(characteristic.C_VAL_CODE);
        }) !== undefined;
      }

    /**
     * this method return the array ob batch options than will populate the tomtomAPI call
     * @param startLocation 
     * @param endLocation 
     * @returns 
     */
    private createOptionsForBatchQ(startLocation: IgniteInterface.IIgniteResponse.TripReport.LocationCoord, endLocation: IgniteInterface.IIgniteResponse.TripReport.LocationCoord): TomTom.BatchSearchOption[] {
        const logPrefix = logPrefixClass + 'createOptionsForBatchQ |';
        const options: TomTom.BatchSearchOption[] = [];

        // SETTING UP QPARAMS FOR BOTH LOCATIONS
        const queryParamsStartLocation: TomTom.PoiSearchQueryParams = this.createPoiSearchQueryParams(startLocation);
        const startBatchNearbySearch: TomTom.BatchSearchOption = this.createBatchNearbySearch(queryParamsStartLocation);
        logger.debug(`${logPrefix} startBatchNearbySearch: ${JSON.stringify(startBatchNearbySearch)}`);
        options.push(startBatchNearbySearch);

        const queryParamsEndLocation: TomTom.PoiSearchQueryParams = this.createPoiSearchQueryParams(endLocation);
        const endBatchNearbySearch: TomTom.BatchSearchOption = this.createBatchNearbySearch(queryParamsEndLocation);
        logger.debug(`${logPrefix} endBatchNearbySearch: ${JSON.stringify(endBatchNearbySearch)}`);
        options.push(endBatchNearbySearch);

        // SETTING UP REVERSE GEOCODE
        const reverseGeocodeStart: TomTom.BatchSearchOption = this.createBatchReverseGeocode(startLocation)
        options.push(reverseGeocodeStart);

        const reverseGeocodeEnd: TomTom.BatchSearchOption = this.createBatchReverseGeocode(endLocation)
        options.push(reverseGeocodeEnd);
        return options;
    }


    /*
     * This method return the poiSearchQueryParam builded with the input info
     */
    private createPoiSearchQueryParams(location: IgniteInterface.IIgniteResponse.TripReport.LocationCoord): TomTom.PoiSearchQueryParams {
        return {
            lat: location.latitude,
            lon: location.longitude,
            limit: 1,
            ofs: 0,
            radius: 100,
            categorySet: ''
        }
    }
    /*
     * this method return the batchSearchOption for the search  builded with the input info
     */
    private createBatchNearbySearch(queryParamLocation: TomTom.PoiSearchQueryParams): TomTom.BatchSearchOption {
        return {
            queryParams: queryParamLocation,
            segment: '/nearbySearch/.json',
            schema: NearbySearchResponseSchema,
        }
    }
    /*
     * this method return the batchSearchOption for the reverse builded with the input info
     */
    private createBatchReverseGeocode(location: IgniteInterface.IIgniteResponse.TripReport.LocationCoord): TomTom.BatchSearchOption {
        return {
            segment: '/reverseGeocode/' + location.latitude + ',' + location.longitude + '.json',
            schema: ReverseGeocodeResponseSchema,
        }
    }



}