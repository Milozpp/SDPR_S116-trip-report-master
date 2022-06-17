import { IDataModels } from '../interfaces';
import { Utilities, IUtilInterface} from 'gcv-utilities';

/**
 * @description ServiceHandler consists of three functions: getServiceParams will validate and filter
 *  the service layer required json elements, validateEvent is used to validate the input  event
 *  comapring it with the schema, mapServiceParams filter the event json to the data required by
 *  service layer
 * @class ServiceHandler
 */
export class ServiceHandler extends Utilities.ServiceHandler<IDataModels.TripReportSettingsRequest, IDataModels.RequestType>{

    protected map(event: IUtilInterface.ApiGatewayTrasformedEvent, requestType: IDataModels.RequestType): IDataModels.TripReportSettingsRequest {
        switch(requestType) {
            case 'GET_DEFAULT_TRIP_REPORT_SETTINGS':
                return {
                    requestType: 'GET_DEFAULT_TRIP_REPORT_SETTINGS',
                    userid: event.pathParams.userid!,
                    vin: event.pathParams.vin!
                };
            case 'GET_TRIP_REPORT_SETTINGS':
                return {
                    requestType: 'GET_TRIP_REPORT_SETTINGS',
                    userid: event.pathParams.userid!,
                    vin: event.pathParams.vin!,
                    tripid: event.pathParams.tripid
                };
            case 'UPDATE_DEFAULT_TRIP_REPORT_SETTINGS':
                return {
                    requestType: 'UPDATE_DEFAULT_TRIP_REPORT_SETTINGS',
                    userid: event.pathParams.userid!,
                    vin: event.pathParams.vin!,
                    settings: {
                        isBusiness: event.requestBody.isBusiness,
                        fuelCostPerGallon: event.requestBody.fuelCostPerGallon,
                        costPerEnergy: event.requestBody.costPerEnergy,
                        currency: event.requestBody.currency
                    }
                };
            case 'UPDATE_TRIP_REPORT_SETTINGS':
                return {
                    requestType: 'UPDATE_TRIP_REPORT_SETTINGS',
                    userid: event.pathParams.userid!,
                    vin: event.pathParams.vin!,
                    tripid: event.pathParams.tripid,
                    settings: {
                        isBusiness: event.requestBody.isBusiness,
                        isFavorite: event.requestBody.isFavorite,
                        fuelCostPerGallon: event.requestBody.fuelCostPerGallon,
                        costPerEnergy: event.requestBody.costPerEnergy,
                        currency: event.requestBody.currency   
                    }
                };
        }
    }
}
