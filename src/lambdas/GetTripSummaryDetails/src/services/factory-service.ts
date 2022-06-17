import { CommonServices } from 'gcv-common-services';
import { IgniteService } from 'gcv-ignite';

export class FactoryService {

    public static async getIgniteService(): Promise<IgniteService> {
        return await IgniteService.getInstance();
    }

    public static getVehicleDiscoveryService(): CommonServices.VehicleDiscoveryService {
        return new CommonServices.VehicleDiscoveryService();
    }

}