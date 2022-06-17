import logger from 'gcv-logger';
import { GCVErrors } from "gcv-utils";
import { Utilities } from "gcv-utilities";
import { VehicleMaster } from "gcv-vehicle-dao";
import { Constants } from "../../constants";
import { FactoryService } from './factory-service';

const logPrefixClass = 'VehicleDetailsService | ';

export class VehicleDetailsService {

    /**
     * @param {string} vin
     * @param {string} userId
     * @returns {Promise<string>}
     * @memberof VehicleDetailsService
     */
     public async checkVehicleDetails(vin: string, userId?: string): Promise<string> {
        const logPrefix = logPrefixClass + 'getVehicleDetails |';

        logger.debug(`${logPrefix} Calling vehicle discovery`);
        const wiseServices =  await FactoryService.getWiseServices();
        try {
            const vehicleDetails = await wiseServices.getVehicleMasterData(vin);

            logger.debug(logPrefix, `vehicle get VehicleMasterData result: ${JSON.stringify(vehicleDetails)}`);
            if(!userId){
                userId = this.getOwner(vehicleDetails);
            } else {
                this.checkUserExist(vehicleDetails, userId, vin);
            }
            this.checkServiceId(vehicleDetails);
        } catch(error){
            if (error instanceof GCVErrors.NotFound){
                throw new GCVErrors.VehicleDoesNotExist("Vin doesn't exist")
            }
            throw error;
        }

        return userId!;
    }

    /**
     * @param {VehicleMaster} vehicleDetails     
     * @returns {void}
     * @memberof VehicleDetailsService
     */
     private checkUserExist(vehicleDetails: VehicleMaster, userId: string, vin: string): void {
        if(!vehicleDetails.users){
            //error users missing
            throw new GCVErrors.BadRequest("The vehicle doesn't have users associated");
        }
        
        const user = vehicleDetails.users.find(user => user.userId == userId);
        
        // error user not associated to the vehicle
        if(!user){                
            throw new GCVErrors.Forbidden(`The user with userId: ${userId} isn't associated with the vehicle with vin: ${vin}`);
        }
    }
    
    /**
     * @param {VehicleMaster} vehicleDetails     
     * @returns {string}
     * @memberof VehicleDetailsService
     */
    private getOwner(vehicleDetails: VehicleMaster): string {
        if(!vehicleDetails.users){
            //error users missing
            throw new GCVErrors.BadRequest("The vehicle doesn't have users associated");
        }
        
        const user = vehicleDetails.users.find(user => user.role == 'O');
        
        // error owner missing
        if(!user){
            throw new GCVErrors.Forbidden("The vehicle doesn't have an owner");
        }

        return user.userId;
    }

    /**
     * @param {Vehicle} vehicle
     * @returns {void}
     * @memberof VehicleDetailsService
     */
    private checkServiceId(vehicle: VehicleMaster): void {
        const logPrefix = logPrefixClass + 'checkServiceId |';
        
        const configuredServiceIDs = Constants.SERVICE_ID;

        if(vehicle.services){
            const vehicleMatchingServiceIDs = vehicle
                .services!
                .find(service => service.service &&
                    configuredServiceIDs === service.service &&
                    service.serviceEnabled === true)

            if (!vehicleMatchingServiceIDs || Utilities.isEmptyObject(vehicleMatchingServiceIDs)) {
                throw new GCVErrors.BadRequest(`Vin: ${vehicle.vin} does not have ${Constants.SERVICE_ID} service enabled`);
            }
            
            logger.info(`${logPrefix} Vin: ${vehicle.vin} has ${Constants.SERVICE_ID} service enabled`);
        } else {
            throw new GCVErrors.BadRequest(`Vin: ${vehicle.vin} does not have services`);
        }
    }
}