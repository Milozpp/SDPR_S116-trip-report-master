import { LambdaTracer } from 'gcv-lambda-tracer';
import logger from 'gcv-logger';
import { UtilityObjects } from 'gcv-utils';
import { HandlerUtils } from 'gcv-utilities';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { TripReportOrchestrator, ServiceHandler } from "./services";
import { IUtilInterface } from 'gcv-utilities/dist/interfaces';
import { AbstractTripGetterService } from './services/trip-getter-services/abstract-trip-getter-service';


const lambdaTracer = new LambdaTracer();

const LOG_PREFIX_FN = "TripReportHandler |";

/**
    * @description Handler is the entry point for lambda.
    * @param {*} event: Request in JSON format received by Lambda.
    * @param {*} context: AWS Lambda uses this parameter to provide details of your Lambda function's 
    * execution.
 */
module.exports.handler = async (event: APIGatewayProxyEvent, context: Context) => {
    HandlerUtils.ApiGatewayLambdaHelper.preInit(event);
    logger.info(`${LOG_PREFIX_FN} #LAMBDA_START#`);
    const cacheNodesArray: IUtilInterface.CacheKeys[] = ["CS_CL_COMMON"];
    let lambdaProxyResponse: UtilityObjects.LambdaResponse = {
        statusCode: 200
    };

    try {
        lambdaTracer.tracerInitialize(event);
        logger.maskInfo(`${LOG_PREFIX_FN} Received Event: ${JSON.stringify(event)}`)

        // Transforming the input event
        const transformedInputEvent = HandlerUtils.ApiGatewayLambdaHelper.transformApiGatewayEvent(event, context);
        logger.debug(`${LOG_PREFIX_FN} trasformed input event: ${JSON.stringify(transformedInputEvent)}`);

        // Initializing cache, logger and loading generic properties        
        await HandlerUtils.ApiGatewayLambdaHelper.initialize(transformedInputEvent, cacheNodesArray);

        const {serviceName, serviceParams} = ServiceHandler.getServiceParams(transformedInputEvent);

        // call to the service layer
        const service: AbstractTripGetterService = TripReportOrchestrator.getRequestedService(serviceName, serviceParams);

        lambdaProxyResponse.body = await service.executeRequest();
 
    } catch (error) {
        logger.error(`${LOG_PREFIX_FN} Error: ${JSON.stringify(error)} stack ${error.stack}`);
        // Call the module gcv-utils.message to get the exact error from cache / db and display channel
        lambdaProxyResponse = HandlerUtils.ResponseHelper.getErrorMessage(error);
    } finally {
        //Get lambda proxy response along with applicable headers
        HandlerUtils.ResponseHelper.formatResponseWithCors(lambdaProxyResponse, event.headers)
        HandlerUtils.ApiGatewayLambdaHelper.finalize();
        logger.info(`${LOG_PREFIX_FN} Lambda Response: ${JSON.stringify(lambdaProxyResponse)}`)
    }
    return lambdaProxyResponse;
};

lambdaTracer.tracerFinalize(module);
