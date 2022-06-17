import logger from 'gcv-logger';
import { LambdaTracer } from 'gcv-lambda-tracer';
import { HandlerUtils, IUtilInterface } from 'gcv-utilities';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DispatchService, ServiceHandler } from "./services";
import { IDataModels } from './interfaces';
import { ApiConfig } from '../constants';

const cacheNodesArray: IUtilInterface.CacheKeys[] = ["CS_CL_COMMON"];

const lambdaTracer = new LambdaTracer();

const LOG_PREFIX_FN = "Handler |";

/**
    * @description Handler is the entry point for lambda.
    * @param {*} event: Request in JSON format received by Lambda.
    * @param {*} context: AWS Lambda uses this parameter to provide details of your Lambda function's 
    * execution.
 */
module.exports.handler = async (event: APIGatewayProxyEvent, context: Context) => {
    // Initializing logger
    HandlerUtils.ApiGatewayLambdaHelper.preInit(event);
    logger.info(`${LOG_PREFIX_FN} #LAMBDA_START#`);
    
    let lambdaProxyResponse: IUtilInterface.LambdaResponse = {
        statusCode: 200
    }
    try {
        lambdaTracer.tracerInitialize(event);
        logger.maskInfo(`${LOG_PREFIX_FN} Received Event: ${JSON.stringify(event)}`)

        //Call transform event received from API gateway lambda proxy into a generic format
        const transformedInputEvent: IUtilInterface.ApiGatewayTrasformedEvent = HandlerUtils.ApiGatewayLambdaHelper.transformApiGatewayEvent(event, context);
        logger.debug(`${LOG_PREFIX_FN} trasformed input event: ${JSON.stringify(transformedInputEvent)}`);

        // Initializing cache, logger and loading generic properties
        await HandlerUtils.ApiGatewayLambdaHelper.initialize(transformedInputEvent, cacheNodesArray);

        // Validate event
        const serviceHandler: ServiceHandler = new ServiceHandler(ApiConfig);
        const inputParams: IDataModels.TripReportSettingsRequest = serviceHandler.getServiceParams(transformedInputEvent);

        // call to the service layer
        lambdaProxyResponse.body = await new DispatchService().dispatch(inputParams);

    } catch (error) {
        logger.error(`${LOG_PREFIX_FN} Error: ${JSON.stringify(error)} stack ${error.stack}`);
        // Call the module gcv-utils.message to get the exact error from cache / db and display channel
        lambdaProxyResponse = HandlerUtils.ResponseHelper.getErrorMessage(error);
    } finally {
        //Get lambda proxy response along with applicable headers
        HandlerUtils.ResponseHelper.formatResponseWithCors(lambdaProxyResponse, event.headers);
        HandlerUtils.ApiGatewayLambdaHelper.finalize();
        logger.info(`${LOG_PREFIX_FN} Lambda Response: ${JSON.stringify(lambdaProxyResponse)}`)
    }

    return lambdaProxyResponse;
};

lambdaTracer.tracerFinalize(module);
