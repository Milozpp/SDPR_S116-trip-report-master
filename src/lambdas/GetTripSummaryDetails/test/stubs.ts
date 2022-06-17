import { IIgniteResponse } from "gcv-ignite/dist/interfaces";
import { VehicleDiscovery } from "gcv-vehicle-dao";
import { Constants } from "../constants";
import { ITripGetterRequest } from "../src/interfaces";

export const TEST_USER_ID = 'test_user_id';
export const TEST_VIN = 'test_vin';
export const TEST_X_CLIENT_APP_NAME = 'test_x_client_app_name';
export const TEST_X_CLIENT_APP_VERSION = 'test_x_client_app_version';
export const TEST_CONTENT_TYPE = 'application/json';
export const TEST_X_API_KEY = 'bruh';
export const TEST_CLIENT_REQUEST_ID = 'test_client_id';
export const TEST_X_ORIGINATOR_TYPE = 'web';
export const TEST_AUTHORIZATION_COGNITO_TOKEN = 'test_authorization_cognito_token'
export const TEST_SINCE = 213124314;
export const TEST_TILL = 5323213124;
export const TEST_OFFSET = 12;
export const TEST_SIZE = 4;

export const validEventDaily = {
	pathParams: {
		userid: TEST_USER_ID,
		vin: TEST_VIN
	},
	queryStringParams: {
		since: TEST_SINCE.toString(),
		till: TEST_TILL.toString(),
		offset: TEST_OFFSET.toString(),
		size: TEST_SIZE.toString()
	},
	multiValueQueryStringParams: {
		since: [TEST_SINCE.toString()],
		till: [TEST_TILL.toString()],
		offset: [TEST_OFFSET.toString()],
		size: [TEST_SIZE.toString()]
	},
	headers: {
		'clientrequestid': 'test',
		'content-type': 'application/json',
		'x-api-key': 'test',
		'x-originator-type': 'app'
	},
	runTimeInfo: {
		httpMethod: 'GET',
		resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/daily'
	}
}


export const validEventWeekly = {
	pathParams: {
		userid: TEST_USER_ID,
		vin: TEST_VIN
	},
	queryStringParams: {
		since: TEST_SINCE.toString(),
		till: TEST_TILL.toString(),
		offset: TEST_OFFSET.toString(),
		size: TEST_SIZE.toString()
	},
	multiValueQueryStringParams: {
		since: [TEST_SINCE.toString()],
		till: [TEST_TILL.toString()],
		offset: [TEST_OFFSET.toString()],
		size: [TEST_SIZE.toString()]
	},
	headers: {
		'clientrequestid': 'test',
		'content-type': 'application/json',
		'x-api-key': 'test',
		'x-originator-type': 'app'
	},
	runTimeInfo: {
		httpMethod: 'GET',
		resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/weekly'
	}
}


export const validEventMonthly = {
	pathParams: {
		userid: TEST_USER_ID,
		vin: TEST_VIN
	},
	queryStringParams: {
		since: TEST_SINCE.toString(),
		till: TEST_TILL.toString(),
		offset: TEST_OFFSET.toString(),
		size: TEST_SIZE.toString()
	},
	multiValueQueryStringParams: {
		since: [TEST_SINCE.toString()],
		till: [TEST_TILL.toString()],
		offset: [TEST_OFFSET.toString()],
		size: [TEST_SIZE.toString()]
	},
	headers: {
		'clientrequestid': 'test',
		'content-type': 'application/json',
		'x-api-key': 'test',
		'x-originator-type': 'app'
	},
	runTimeInfo: {
		httpMethod: 'GET',
		resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/monthly'
	}
}

export const validEventCustomTimeframe = {
	pathParams: {
		userid: TEST_USER_ID,
		vin: TEST_VIN
	},
	queryStringParams: {
		till: TEST_TILL.toString()
	},
	multiValueQueryStringParams: {
		till: [TEST_TILL.toString()],
	},
	headers: {
		'clientrequestid': 'test',
		'content-type': 'application/json',
		'x-api-key': 'test',
		'x-originator-type': 'app'
	},
	runTimeInfo: {
		httpMethod: 'GET',
		resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/custom'
	}
}


export const eventForUnexistingEndpoint = {
	pathParams: {
		userid: TEST_USER_ID,
		vin: TEST_VIN
	},
	queryStringParams: {
		since: TEST_SINCE.toString(),
		till: TEST_TILL.toString(),
		offset: TEST_OFFSET.toString(),
		size: TEST_SIZE.toString()
	},
	multiValueQueryStringParams: {
		since: [TEST_SINCE.toString()],
		till: [TEST_TILL.toString()],
		offset: [TEST_OFFSET.toString()],
		size: [TEST_SIZE.toString()]
	},
	headers: {
		'clientrequestid': 'test',
		'content-type': 'application/json',
		'x-api-key': 'test',
		'x-originator-type': 'app'
	},
	runTimeInfo: {
		httpMethod: 'GET',
		resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/summary/dummystring'
	}
}


export const ValidRequest: ITripGetterRequest.ITripGetterRequest = {
	vin: TEST_VIN,
	userid: TEST_USER_ID,
	since: TEST_SINCE,
	till: TEST_TILL,
	offset: TEST_OFFSET,
	size: TEST_SIZE
}

export const ValidRequestCustomTimeframe: ITripGetterRequest.ITripGetterRequest = {
	vin: TEST_VIN,
	userid: TEST_USER_ID,
	till: TEST_TILL
}

export namespace VehicleDiscoveryStubs {

	export const ServiceEnabled: VehicleDiscovery = {
		userid: TEST_USER_ID,
		vehicles: [
			{
				vin: TEST_VIN,
				fuelType: "G",
				services: [
					{
						service: Constants.ENDPOINT_CONFIGURATION.SERVICE_ID,
						serviceEnabled: true
					}
				]
			}
		]
	}

	export const ServiceDisabled: VehicleDiscovery = {
		userid: TEST_USER_ID,
		vehicles: [
			{
				vin: TEST_VIN,
				fuelType: "G",
				services: [
					{
						service: Constants.ENDPOINT_CONFIGURATION.SERVICE_ID,
						serviceEnabled: false
					}
				]
			}
		]
	}

	export const ServiceNotPresent: VehicleDiscovery = {
		userid: TEST_USER_ID,
		vehicles: [
			{
				vin: TEST_VIN,
				fuelType: "G",
				services: [
					{
						service: 'TEST',
						serviceEnabled: false
					}
				]
			}
		]
	}
}

export const DAILY_TRIPS_SUMMARY_RESPONSE: IIgniteResponse.TripReport.ITripDailyResponse = {
	"numRecords": 0,
	"days": [
		{
			"trips": [
				{
					"cost": 0,
					"distance": 0,
					"isBusinessTrip": true,
					"isFavouriteTrip": true,
					"currency": "string",
					"tripId": "string",
					"travelDate": 0,
					"startTime": 0,
					"endTime": 0
				}
			],
			"startTime": 0,
			"endTime": 0,
			"duration": 0,
			"distance": 0,
			"fuelConsumptionRate": 0,
			"energyConsumptionRate": 0,
			"tripsCost": {
				"USD": 12.3,
				"CAD": 23.9,
			},
			"averageSpeed": 0,
			"numTriggers": 0,
			"numTrips": 0,
			"totalFuelConsumption": 0,
			"totalEnergyConsumption": 0,
			"ecoScore": [
				{
					"profileName": "string",
					"averageScore": 0
				}
			]
		}
	]
}

export const WEEKLY_TRIPS_SUMMARY_RESPONSE: IIgniteResponse.TripReport.ITripWeeklyResponse = {
	"numRecords": 0,
	"weeks": [
		{
			"trips": [
				{
					"tripId": "string",
					"travelDate": 0,
					"startTime": 0,
					"endTime": 0
				}
			],
			"startTime": 0,
			"endTime": 0,
			"duration": 0,
			"distance": 0,
			"fuelConsumptionRate": 0,
			"energyConsumptionRate": 0,
			"tripsCost": {},
			"averageSpeed": 0,
			"numTriggers": 0,
			"numTrips": 0,
			"totalFuelConsumption": 0,
			"totalEnergyConsumption": 0,
			"ecoScore": [
				{
					"profileName": "string",
					"averageScore": 0
				}
			]
		}
	]
}

export const MONTHLY_TRIPS_SUMMARY_RESPONSE: IIgniteResponse.TripReport.ITripMonthlyResponse = {
	"numRecords": 0,
	"months": [
		{
			"trips": [
				{
					"tripId": "string"
				}
			],
			"startTime": 0,
			"endTime": 0,
			"duration": 0,
			"distance": 0,
			"fuelConsumptionRate": 0,
			"energyConsumptionRate": 0,
			"tripsCost": {},
			"averageSpeed": 0,
			"numTriggers": 0,
			"numTrips": 0,
			"totalFuelConsumption": 0,
			"totalEnergyConsumption": 0,
			"ecoScore": [
				{
					"profileName": "string",
					"averageScore": 0
				}
			]
		}
	]
}

export const CUSTOM_TIMEFRAME_TRIPS_SUMMARY_RESPONSE: IIgniteResponse.TripReport.ITripCustomTimeframeResponse = {
	"totalTrips": 0,
	"totalDuration": 0,
	"totalDistance": 0,
	"totalTripCost": {
		"USD": 12.3,
		"CAD": 23.9
	},
	"averageSpeed": 0,
	"totalTriggerEvents": 0,
	"averageFuelConsumptionRate": 0
}



