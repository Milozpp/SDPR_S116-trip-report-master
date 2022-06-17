export const Constants = {
    KINESIS_EVENT: {
        OUTPUT_EVENT_TYPE: 'TripReportUpdate',
        TARGET_KINESIS_DATA_STREAM: process.env.TARGET_KINESIS_DATA_STREAM ?? '',
        OUTPUT_EVENT_VERSION: 1.0
    },
    SERVICE_ID: "TRIPREPORT",
    FUEL_TYPES_HAVING_REGENERATION_SCORE: ["BEV", "PHEV"],
    C_CHARACTERISTIC_CODE_ELT: "ELT",
    SUCCESS_RESPONSE : {
        message : "TripReport data received successfully"
    }
}

export const REQUEST_ORDER_BATCH: { [name: string]: number; } =
{
    "SEARCH_START_LOCATION": 0,
    "SEARCH_END_LOCATION": 1,
    "REVERSE_START_LOCATION": 2,
    "REVERSE_END_LOCATION": 3
};