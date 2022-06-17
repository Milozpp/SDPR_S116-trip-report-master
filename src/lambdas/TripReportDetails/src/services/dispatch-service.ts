import { GCVErrors } from 'gcv-utils';
import { FactoryService } from './factory-service';
import { IDataModels } from "../interfaces";

export class DispatchService {
    public async processRequest(serviceParams: IDataModels.ServiceParams): Promise<IDataModels.GenericResponse> {
        const tripsService = FactoryService.getTripsService();
        
        const vehicleDetailsService = FactoryService.getVehicleDetailsService();
        await vehicleDetailsService.checkVehicleDetails(serviceParams.request.vehicleid, serviceParams.request.userid!);

        switch (serviceParams.requestType) {            
            case 'GET_TRIP_LIST':
                return await tripsService.getAllTripsDetails(serviceParams.request as IDataModels.GetTripListServiceParams);
            case 'TRIP_ID_DETAILS':
                return await tripsService.getTripDetails(serviceParams.request as IDataModels.TripIdDetailsServiceParams);
            case 'GET_LAST_TRIP':
                return await tripsService.getLastTripReport(serviceParams.request as IDataModels.LastTripServiceParams);
            case 'TRIP_STATUS':
                const tripStatusService = FactoryService.getTripStatusService();
                return await tripStatusService.processRequest(serviceParams.request as IDataModels.TripStatus);
            default:
                throw new GCVErrors.ServiceNotSupported('Request Service not supported');
        }
    }
}