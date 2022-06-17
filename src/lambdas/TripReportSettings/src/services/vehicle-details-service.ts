import logger from 'gcv-logger';
import { CommonServices } from 'gcv-common-services';
import { GCVErrors } from "gcv-utils";
import { Utilities } from "gcv-utilities";
import { Vehicle } from "gcv-vehicle-dao";
import { Constants } from "../../constants";

const logPrefixClass = 'VehicleDetailsService | ';

export class VehicleDetailsService {

    /**
     * @param {string} vin
     * @param {string} userId
     * @returns {Promise<void>}
     * @memberof VehicleDetailsService
     */
    public async checkVehicleDetails(vin: string, userId: string): Promise<void>{
        const vehicle = await this.getVehicleDetails(vin, userId);
        this.checkServiceId(vehicle);
    }

    /**
     * @param {string} vin
     * @param {string} userId
     * @returns {Promise<void>}
     * @memberof VehicleDetailsService
     */
    private async getVehicleDetails(vin: string, userId: string): Promise<Vehicle> {
        const logPrefix = logPrefixClass + 'getVehicleDetails |';

        logger.debug(`${logPrefix} Calling vehicle discovery`);
        const vehicleDiscoveryService = new CommonServices.VehicleDiscoveryService();
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
     * @param {Vehicle} vehicle
     * @returns {Promise<void>}
     * @memberof VehicleDetailsService
     */
    private checkServiceId(vehicle: Vehicle): void {
        const logPrefix = logPrefixClass + 'checkServiceId |';
        
        const configuredServiceIDs = Constants.SERVICE_ID;

        const vehicleMatchingServiceIDs = vehicle
            .services!
            .find(service => service.service &&
                configuredServiceIDs === service.service &&
                service.serviceEnabled === true)

        if (!vehicleMatchingServiceIDs || Utilities.isEmptyObject(vehicleMatchingServiceIDs)) {
            throw new GCVErrors.BadRequest(`Vin: ${vehicle.vin} does not have ${Constants.SERVICE_ID} service enabled`);
        }
        
        logger.info(`${logPrefix} Vin: ${vehicle.vin} has ${Constants.SERVICE_ID} service enabled`);
    }
}