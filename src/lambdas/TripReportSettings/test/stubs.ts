import { IDataModels } from "../src/interfaces";
import { IIgniteRequest, IIgniteResponse } from "gcv-ignite/dist/interfaces";
import { IUtilInterface } from "gcv-utilities";
import { APIGatewayProxyEventHeaders, APIGatewayProxyEventMultiValueQueryStringParameters, APIGatewayProxyEventPathParameters, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventStageVariables } from "aws-lambda";
import { Constants } from "../constants";

export namespace TripReportSettingsStub {
    export const USERID = 'userid';
    export const VIN = 'vin';
    export const TRIPID = 'tripid';
    export const AUTHORIZATION = 'Authorization';
    export const CONTENT_TYPE = 'application/json';
    export const X_API_KEY = 'x-api-key-test';
    export const LOCALE = 'locale-test';
    export const X_ORIGINATOR_TYPE = 'server';
    export const CLIENT_REQUEST_ID = 'clientrequestid-test';
    export const CLIENT_APP_VERSION = 'clientapp-version-test';
    export const FUEL_COST_PER_LITER = 10;
    export const COST_PER_ENERGY = 5;

    export class MockIgniteService {
        public async getTripReportSettings(userid: string, vin: string, tripid?:string): Promise<IIgniteResponse.TripReport.GetSettings> {
            [userid, vin, tripid]
            return {} as IIgniteResponse.TripReport.GetSettings;
        }

        public async updateTripReportSettings(userid: string, vin: string, settings: IIgniteRequest.TripReport.Settings, tripid?:string): Promise<IIgniteResponse.GenericSuccessResponse>  {
            [userid, vin, tripid, settings]
            return {} as IIgniteResponse.GenericSuccessResponse;
        }
    }

    //export const VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_EVENT: UtilityObjects.TransformedInputEvent = {
    export const VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_EVENT: IUtilInterface.ApiGatewayTrasformedEvent = 
    createApiGatewayTrasformedEvent(
        createRunTimeInfo('GET', '/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings'),
        {
            userid: USERID,
            vin: VIN
        }
    );

    export const VALID_GET_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST: IDataModels.TripReportSettingsRequest = {
        requestType: 'GET_DEFAULT_TRIP_REPORT_SETTINGS',
        userid: USERID,
        vin: VIN
    }

    export const VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_EVENT: IUtilInterface.ApiGatewayTrasformedEvent = 
    createApiGatewayTrasformedEvent(
        createRunTimeInfo('GET', '/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings/{tripid}'),
        {
            userid: USERID,
            vin: VIN,
            tripid: TRIPID
        }
    );

    export const VALID_GET_TRIPID_TRIP_REPORT_SETTINGS_REQUEST: IDataModels.TripReportSettingsRequest = {
        requestType: 'GET_TRIP_REPORT_SETTINGS',
        userid: USERID,
        vin: VIN,
        tripid: TRIPID
    }

    export const DEFAULT_TRIP_REPORT_SETTINGS: IDataModels.TripReportSettings = {
        isBusiness: true,
        fuelCostPerGallon: FUEL_COST_PER_LITER * Constants.LITER_TO_GALLON,
        costPerEnergy: COST_PER_ENERGY,
        currency: 'USD'
    }

    export const DEFAULT_IGNITE_RESPONSE: IIgniteResponse.TripReport.GetSettings = {
        isBusiness: true,
        costPerLiter: FUEL_COST_PER_LITER,
        costPerEnergy: COST_PER_ENERGY,
        currency: 'USD'
    }

    export const TRIPID_TRIP_REPORT_SETTINGS: IDataModels.TripReportSettings = {
        isBusiness: true,
        isFavorite: false,
        fuelCostPerGallon: FUEL_COST_PER_LITER * Constants.LITER_TO_GALLON,
        costPerEnergy: COST_PER_ENERGY,
        currency: 'USD'
    }

    export const TRIPID_IGNITE_RESPONSE: IIgniteResponse.TripReport.GetSettings = {
        isBusiness: true,
        isFavorite: false,
        costPerLiter: FUEL_COST_PER_LITER,
        costPerEnergy: COST_PER_ENERGY,
        currency: 'USD'
    }

    export const VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_EVENT: IUtilInterface.ApiGatewayTrasformedEvent =
    createApiGatewayTrasformedEvent(
        createRunTimeInfo('POST', '/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings'),
        {
            userid: USERID,
            vin: VIN
        },
        DEFAULT_TRIP_REPORT_SETTINGS
    );

    export const VALID_UPDATE_DEFAULT_TRIP_REPORT_SETTINGS_REQUEST: IDataModels.TripReportSettingsRequest = {
        requestType: 'UPDATE_DEFAULT_TRIP_REPORT_SETTINGS',
        userid: USERID,
        vin: VIN,
        settings: DEFAULT_TRIP_REPORT_SETTINGS
    }

    export const VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_EVENT: IUtilInterface.ApiGatewayTrasformedEvent =
    createApiGatewayTrasformedEvent(
        createRunTimeInfo('POST', '/v2/accounts/{userid}/vehicles/{vin}/tripreport/settings/{tripid}'),
        {
            userid: USERID,
            vin: VIN,
            tripid: TRIPID
        },
        TRIPID_TRIP_REPORT_SETTINGS
    );

    export const VALID_UPDATE_TRIPID_TRIP_REPORT_SETTINGS_REQUEST: IDataModels.TripReportSettingsRequest = {
        requestType: 'UPDATE_TRIP_REPORT_SETTINGS',
        userid: USERID,
        vin: VIN,
        tripid: TRIPID,
        settings: TRIPID_TRIP_REPORT_SETTINGS
    }

    export const UPDATE_RESPONSE: IIgniteResponse.GenericSuccessResponse = {
        message: 'Success'
    }


    export function createApiGatewayTrasformedEvent(runTimeInfo:any, pathParams?:APIGatewayProxyEventPathParameters, requestBody?: any, headers?: APIGatewayProxyEventHeaders,
                                            stageVariables?: APIGatewayProxyEventStageVariables, queryStringParams?: APIGatewayProxyEventQueryStringParameters,
                                            multiValueQueryStringParams?: APIGatewayProxyEventMultiValueQueryStringParameters,
                                            envVariables?: any, derivedConfigs?: any) : IUtilInterface.ApiGatewayTrasformedEvent {
       return {
            pathParams: pathParams ? pathParams : {},
            headers: headers ? headers : { 
                'content-type': CONTENT_TYPE,
                'x-api-key': X_API_KEY,
                'locale': LOCALE,
                'x-originator-type': X_ORIGINATOR_TYPE,
                'clientrequestid': CLIENT_REQUEST_ID,
                'x-clientapp-version': CLIENT_APP_VERSION,
                'Authorization': AUTHORIZATION
            },
            runTimeInfo: runTimeInfo,
            stageVariables: stageVariables ? stageVariables : {},
            queryStringParams: queryStringParams ? queryStringParams : {},
            multiValueQueryStringParams: multiValueQueryStringParams ? multiValueQueryStringParams : {},
            envVariables: envVariables ? envVariables : {},    
            derivedConfigs: derivedConfigs ? derivedConfigs : {},
            requestBody: requestBody ? requestBody : {}
        }
    }

    export function createRunTimeInfo( httpMethod: string, resourcePath:string, answerRequestId?: string, executionRegion?: string, path?: string, domainName?: string, authorizer?: IUtilInterface.Authorizer,
        cognitoAuthProvider?:string, accountId?: string, cognitoIdentityPoolId?:string, cognitoIdentityId?: string){
        return {
            awsRequestId: answerRequestId ? answerRequestId : "",
            executionRegion: executionRegion ? executionRegion : "",
            path: path ? path : "",
            domainName: domainName ? domainName : "",
            authorizer: authorizer ? authorizer : createAuthorizer("",""),
            cognitoAuthProvider: cognitoAuthProvider ? cognitoAuthProvider : "",
            accountId: accountId ? accountId : "",
            cognitoIdentityPoolId: cognitoIdentityPoolId ? cognitoIdentityPoolId : "",
            cognitoIdentityId: cognitoIdentityId ? cognitoIdentityId : "",
            httpMethod: httpMethod ? httpMethod : "",
            resourcePath: resourcePath ? resourcePath : ""
        }
    }

    export function createAuthorizer(principalId:string, integrationLatency:string ){
        return {
            principalId: principalId ? principalId : "",
            integrationLatency: integrationLatency ? integrationLatency : "",
        }
    }
}