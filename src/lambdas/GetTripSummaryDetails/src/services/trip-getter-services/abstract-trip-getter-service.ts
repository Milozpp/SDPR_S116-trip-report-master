import { ITripGetterRequest, Models } from "../../interfaces";
import logger from 'gcv-logger';
import { FactoryService } from "..";
import { Utilities, GCVErrors } from "gcv-utilities";
import { Constants } from "../../../constants";
import { Vehicle } from "gcv-vehicle-dao";
import { IIgniteRequest, IIgniteResponse } from "gcv-ignite/dist/interfaces";

const logPrefixClass = 'AbstractTripGetterService | ';

export abstract class AbstractTripGetterService {

    resourceConfig: Models.ResourceConfig;
    vehicle!: Vehicle;
    serviceParams: ITripGetterRequest.ITripGetterRequest;

    public constructor(resource: Models.Resource, serviceParams: ITripGetterRequest.ITripGetterRequest) {
        this.resourceConfig = this.getResourceConfig(resource);
        this.serviceParams = serviceParams;
    }

    /**
     * @param {Models.Resource} resource
     * @returns {Models.ResourceConfig}
     * @memberof AbstractTripGetterService
     */
    private getResourceConfig(resource: Models.Resource): Models.ResourceConfig {
        return Constants.RESOURCES_CONFIGURATION[resource];
    };

    /**
     * @returns {Promise<ITripGetterMappedResponses.TripGetterMappedResponse>}
     * @memberof AbstractTripGetterService
     */
    public abstract executeRequest(): Promise<IIgniteResponse.TripReport.TripReportSummaryResponse>;

    protected getParamsForRequest(): IIgniteRequest.TripReportSummary.Params{
        let params : IIgniteRequest.TripReportSummary.Params = {
            till: this.serviceParams.till,
            since: this.serviceParams.since,
            offset: this.serviceParams.offset,
            size: this.serviceParams.size
        }
        return Utilities.removeUndefinedFieldsUsingJsonParse(params);
    }

    /**
     * @param {string} vin
     * @param {string} userId
     * @returns {Promise<void>}
     * @memberof AbstractTripGetterService
     */
    public async preprocessVehicleDetails(vin: string, userId: string, checkFuelType: boolean = false): Promise<void>{
        const vehicle = await this.getVehicleDetails(vin, userId);
        this.checkServiceId(vehicle);
        if(checkFuelType){
            this.checkFuelType(vehicle);
        }
        this.vehicle = vehicle;
    }

    /**
     * @param {string} vin
     * @param {string} userId
     * @returns {Promise<void>}
     * @memberof AbstractTripGetterService
     */
    private async getVehicleDetails(vin: string, userId: string): Promise<Vehicle> {
        const logPrefix = logPrefixClass + 'getVehicleDetails |';

        logger.debug(`${logPrefix} Calling vehicle discovery`);
        const vehicleDiscoveryService = FactoryService.getVehicleDiscoveryService();
        const vehicleDiscovery = await vehicleDiscoveryService.getVehicleDetails(userId, vin);
        logger.debug(logPrefix, `vehicle discovery result: ${JSON.stringify(vehicleDiscovery)}`);

        const vehicle = vehicleDiscovery
            .vehicles!
            .find(vehicle => vehicle.vin === vin)!

        if (typeof vehicle === 'undefined'){
            throw new GCVErrors.BadRequest(`Vehicle ${vin} not found`);
        }

        return vehicle;
    }

    /**
     * @returns {Promise<void>}
     * @param {Vehicle} vehicle
     * @memberof AbstractTripGetterService
     */
    private checkServiceId(vehicle: Vehicle): void {
        const logPrefix = logPrefixClass + 'checkServiceId |';
        
        const configuredServiceIDs = Constants.ENDPOINT_CONFIGURATION.SERVICE_ID;

        const vehicleMatchingServiceIDs = vehicle
            .services!
            .find(service => service.service &&
                configuredServiceIDs === service.service &&
                service.serviceEnabled === true)

        if (!vehicleMatchingServiceIDs || Utilities.isEmptyObject(vehicleMatchingServiceIDs))
            throw new GCVErrors.BadRequest(`${vehicle.vin} does not have ${Constants.ENDPOINT_CONFIGURATION.SERVICE_ID} service enabled`);
        
        logger.info(`${logPrefix} ${vehicle.vin} has ${Constants.ENDPOINT_CONFIGURATION.SERVICE_ID} service enabled`);
    }

    /**
     * @returns {Promise<void>}
     * @param {Vehicle} vehicle
     * @memberof AbstractTripGetterService
     */
     private checkFuelType(vehicle: Vehicle): void {
        const logPrefix = logPrefixClass + 'checkFuelType |';

        if (!vehicle.fuelType){
            throw new GCVErrors.NotFound(`${vehicle.vin} does not have fuelType field defined`);
        }
        
        logger.info(`${logPrefix} ${vehicle.vin} has ${vehicle.fuelType} fuel type`);

    }
}