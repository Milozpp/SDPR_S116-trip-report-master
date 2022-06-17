
import { STS } from "aws-sdk";
import { GcvDynamoDbDao } from 'gcv-dynamodb-dao';
import { CommonServices } from 'gcv-common-services';
import { IgniteService } from 'gcv-ignite';
import { GetTripsService } from './get-trips-service';
import { TripStatusService} from './trip-status-service';
import { VehicleDetailsService } from './vehicle-details-service';
import { MappingService } from './mapping-service';
import { VehicleCharacteristicsService } from 'gcv-wisedb-dao/dist/services';
import { WiseServices } from "gcv-vehicle-dao";
import { KinesisStream } from 'gcv-utils';

export class FactoryService {

    private static wiseServices: WiseServices;

    public static getVehicleDiscoveryService(): CommonServices.VehicleDiscoveryService{
        return new CommonServices.VehicleDiscoveryService();
    }

    public static getTripReportDao(): GcvDynamoDbDao.TripReportDao{
        return new GcvDynamoDbDao.TripReportDao();
    }

    public static getIgniteService(): Promise<IgniteService> {
        return IgniteService.getInstance();
    }

    public static getTripsService(): GetTripsService{
        return new GetTripsService();
    }

    public static getVehicleDetailsService(): VehicleDetailsService {
        return new VehicleDetailsService();
    }

    public static async getWiseServices(): Promise<WiseServices> {
        if(!this.wiseServices){
            this.wiseServices = new WiseServices();
            await WiseServices.initializeDao();
        }
        return this.wiseServices;
    }
    
    public static getMappingService(): MappingService {
        return new MappingService();
    }

    public static getTripStatusService(): TripStatusService {
        return new TripStatusService();
    }

    public static getStsClient(): AWS.STS {
        return new STS({ region: process.env.REGION });
    }

    public static getVehicleCharacteristicsService(): VehicleCharacteristicsService{
        return new VehicleCharacteristicsService();
    }

    public static getKinesisStream(): KinesisStream {
        return new KinesisStream();
    }

}