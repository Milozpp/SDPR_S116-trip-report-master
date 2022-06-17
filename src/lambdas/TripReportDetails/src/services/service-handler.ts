import { IDataModels } from '../interfaces';
import { Utilities, IUtilInterface } from 'gcv-utilities';

export class ServiceHandler extends Utilities.ServiceHandler<IDataModels.ServiceParams, IDataModels.RequestType>{
    protected map(event: IUtilInterface.ApiGatewayTrasformedEvent,requestMethod: IDataModels.RequestType): IDataModels.ServiceParams {
        switch (requestMethod) {
            case 'GET_TRIP_LIST':
                return {
                    requestType: requestMethod,
                    request: {
                        userid: event.pathParams!.userid!,
                        vehicleid: event.pathParams!.vin!,
                        since: parseInt(event.queryStringParams!.startTime!),
                        till: parseInt(event.queryStringParams!.endTime!),
                        offset: parseInt(event.queryStringParams!.offset!),
                        size: parseInt(event.queryStringParams!.size!),
                    }
                };
            case 'TRIP_ID_DETAILS':
                return {
                    requestType: requestMethod,
                    request: {
                        userid: event.pathParams!.userid!,
                        vehicleid: event.pathParams!.vin!,
                        tripids: [event.pathParams!.tripid!],
                    }
                };
            case 'GET_LAST_TRIP':
                return {
                    requestType: requestMethod,
                    request: {
                        userid: event.pathParams!.userid!,
                        vehicleid: event.pathParams!.vin!
                    }
                };
            case 'TRIP_STATUS': {
                return {
                    requestType: requestMethod,
                    request: {
                        userid: event.pathParams.userid!,
                        vehicleid: event.pathParams.vin!,
                        sessionid: event.headers.sessionid!,
                        EventID: event.requestBody.EventID,
                        Version: event.requestBody.Version,
                        Timestamp: event.requestBody.Timestamp,
                        Data: event.requestBody.Data
                    }
                }
            };
        }
    }
}