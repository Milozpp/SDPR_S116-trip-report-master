import { AbstractTripGetterService } from "./abstract-trip-getter-service";
import { ITripGetterRequest } from "../../interfaces/i-trip-request-models";
import { Models } from "../../interfaces";
import { IIgniteRequest, IIgniteResponse } from "gcv-ignite/dist/interfaces";
import { FactoryService } from "..";
import logger from "gcv-logger";

const logPrefixClass = 'GetMonthlyTripsSummaryService | ';

export class GetMonthlyTripsSummaryService extends AbstractTripGetterService{

    private static resource: Models.Resource = "MONTHLY_TRIPS";

    public constructor(serviceParams: ITripGetterRequest.ITripGetterRequest) {
       super(GetMonthlyTripsSummaryService.resource, serviceParams);
    }

    /**
     * @returns {Promise<ITripGetterResponses.ITripResponse>}
     * @memberof GetMonthlyTripsSummaryService
     */
    public async executeRequest(): Promise<IIgniteResponse.TripReport.TripReportSummaryResponse> {
        const logPrefix = logPrefixClass + 'executeRequest monthly|';

        await this.preprocessVehicleDetails(this.serviceParams.vin, this.serviceParams.userid);
        
        const params = this.getParamsForRequest();

        const igniteService = await FactoryService.getIgniteService();
        
        try {
            const response: IIgniteResponse.TripReport.ITripMonthlyResponse = await igniteService.getMonthlyTripsSummaryDetails(this.serviceParams.vin, this.serviceParams.userid, params as IIgniteRequest.TripReportSummary.DayWeekMonthTripsSummaryParams);

            logger.info(`${logPrefix} response from Ignite: ${JSON.stringify(response)}`);
    
            return response;        

        }catch(error){
          if(error.intfcMsgCode === 'PROXY_INTEGRATION_ERROR' && error.errorCode === 404){
            logger.info(`${logPrefix} No data returned by ignite - return empty response`);
            //no data from ignite
            return {}
          }
          throw error;
        }
    }

}