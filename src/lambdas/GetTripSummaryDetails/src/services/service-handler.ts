import logger from 'gcv-logger';
import { UtilityObjects } from 'gcv-utils';
import { Models } from '../interfaces';
import { Constants, JSONSchemas } from '../../constants';
import { GCVErrors, Utilities } from 'gcv-utilities';
import { ITripGetterRequest } from '../interfaces/i-trip-request-models';
import { IUtilInterface } from 'gcv-utilities/dist/interfaces';

const logPrefixClass = "ServiceHandler | ";
const jsonSchemaValidator: Utilities.JsonValidator = new Utilities.JsonValidator();

/**
 * @description ServiceHandler consists of three functions: getServiceParams will validate and filter
 *  the service layer required json elements, validateEvent is used to validate the input event
 *  comapring it with the schema, identifyRequestedService will retrive resource name 
 * @class ServiceHandler
 */
export class ServiceHandler {

    /**
     * @description -  This function will validate and map the parameters needed
     * @param {UtilityObjects.TransformedInputEvent} event - Transformed event passed by Handler.
     * @returns {Models.TripGetterServiceParams}
     * @throws  HttpMethodNotAllowed, InvalidRequestParameter, NotFound
     * @memberof ServiceHandler
     */
    public static getServiceParams(event: UtilityObjects.TransformedInputEvent): Models.TripGetterServiceParams {
        const logPrefix = logPrefixClass + 'getServiceParams|';

        // identify requested service along with required mapping and validation
        const serviceName: Models.Resource = ServiceHandler.identifyRequestedService(event);

        logger.info(`${logPrefix} Identified service: ${serviceName}`);

        let serviceParams: ITripGetterRequest.ITripGetterRequest;
        switch (serviceName) {
            case "DAILY_TRIPS":
                ServiceHandler.validateEvent(event, JSONSchemas.GetDailyTripSummaryDetailsRequestSchema);
                serviceParams = ServiceHandler.getTripsServiceParams(event as IUtilInterface.ApiGatewayTrasformedEvent);  
                break;
            case "WEEKLY_TRIPS":
                ServiceHandler.validateEvent(event, JSONSchemas.GetWeeklyTripSummaryDetailsRequestSchema);
                serviceParams = ServiceHandler.getTripsServiceParams(event as IUtilInterface.ApiGatewayTrasformedEvent);  
                break;
            case "MONTHLY_TRIPS":
                ServiceHandler.validateEvent(event, JSONSchemas.GetMonthlyTripSummaryDetailsRequestSchema);
                serviceParams = ServiceHandler.getTripsServiceParams(event as IUtilInterface.ApiGatewayTrasformedEvent);  
                break;
            case "CUSTOM_TIMEFRAME_TRIPS":
                ServiceHandler.validateEvent(event, JSONSchemas.GetCustomTimeframeTripSummaryDetailsRequestSchema);
                serviceParams = ServiceHandler.getTripsServiceParams(event as IUtilInterface.ApiGatewayTrasformedEvent);  
                break;
            default:
                throw new GCVErrors.NotFound('Service corresponding to endpoint not found');
        }

        Utilities.removeUndefinedFields(serviceParams);

        logger.debug(`${logPrefix} Service Params: ${JSON.stringify(serviceParams)}`);
        return { 
            serviceName, 
            serviceParams
        };
    }

    /**
     * @description -  This function will get the parameters for aggregated trips requests
     * @param {UtilityObjects.TransformedInputEvent} requestObj - Transformed event passed by Handler.
     * @returns {ITripGetterRequests.Trips}
     * @memberof ServiceHandler
     */
    private static getTripsServiceParams(requestObj:IUtilInterface.ApiGatewayTrasformedEvent): ITripGetterRequest.ITripGetterRequest {
        return {

            vin:requestObj['pathParams']!['vin']!,
            userid: requestObj['pathParams']!['userid']!,
            since: requestObj.queryStringParams!["since"] ? +requestObj.queryStringParams!["since"] : undefined, 
            till: +requestObj.queryStringParams!["till"]!, 
            offset: requestObj.queryStringParams!["offset"] ? +requestObj.queryStringParams!["offset"] : undefined,
            size: requestObj.queryStringParams!["size"] ? +requestObj.queryStringParams!["size"] : undefined, 
            
        }
    }

    /**
     * @description - This function is used to validate the event received by the lambda.
     * @private
     * @param {UtilityObjects.TransformedInputEvent} event - Transformed event passed by Handler.
     * @param {any} schema - JsonSchema used for validation.
     * @returns void 
     * @throws InvalidRequestParameter
     * @memberof ServiceHandler
     */
    protected static validateEvent(event: UtilityObjects.TransformedInputEvent, schema: any): void {
        const logPrefixFn: string = logPrefixClass + 'validateEvent |';

        const validatorResponse = jsonSchemaValidator.validateJson(event, schema);
        logger.info(`${logPrefixFn} Validation end, response: ${JSON.stringify(validatorResponse)}`);
    }

    /**
     * Matches resource path and http method against the configuration map to determine
     * requested resource
     * @param {UtilityObjects.TransformedInputEvent} event - Transformed event passed by Handler.
     * @returns {Models.Resource}
     * @memberof ServiceHandler
     */
     public static identifyRequestedService(event: UtilityObjects.TransformedInputEvent): Models.Resource {
        const matchedEntry = Object.entries(Constants.RESOURCES_CONFIGURATION)
            .find(([, resourceMap]) => {
                const resourcePath = event.runTimeInfo.resourcePath;
                const method: 'GET' = event.runTimeInfo.httpMethod;
                return typeof resourcePath === 'string' &&
                    resourcePath === resourceMap.path &&
                    resourceMap.method === method;
            });
        if (!matchedEntry || Utilities.isEmptyObject(matchedEntry)) {
            throw new GCVErrors.HttpMethodNotAllowed('No configuration for input path and/or http method');
        }

        const [resource, ] = matchedEntry;
        
        return resource as Models.Resource
    }
}
