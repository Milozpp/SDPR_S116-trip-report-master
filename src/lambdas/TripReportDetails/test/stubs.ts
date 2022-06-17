import { VehicleDiscovery, VehicleMaster } from "gcv-vehicle-dao";
import { IgniteInterface } from 'gcv-ignite';
import { TomTom } from 'gcv-tomtom';
import { IDataModels } from "../src/interfaces";
import {TripReportDetailsEnriched } from 'gcv-dynamodb-dao/dist/interfaces/i-trip-report';
export namespace Stubs {

	export const USER_ID = 'test-userid';
	export const VIN = 'test-vin';
	export const TRIPID = "test-tripid";
	export const X_CLIENTAPP_VERSION = 'x-clientapp-version-test';
	export const AUTHORIZATION = 'Authorization';
	export const CONTENT_TYPE = 'application/json';
	export const X_API_KEY = 'x-api-key-test';
	export const LOCALE = 'locale-test';
	export const X_ORIGINATOR_TYPE = 'server';
	export const CLIENT_REQUEST_ID = 'clientrequestid-test';
	export const TIMESTAMP = 123456;

	export const REQUEST_TYPE: IDataModels.RequestType[] = [
        'GET_TRIP_LIST',
        'TRIP_ID_DETAILS',
        'GET_LAST_TRIP',
		'TRIP_STATUS'
    ]

	export const TRIP_SERVICE_FUNCTION = {
		'GET_TRIP_LIST': 'getAllTripsDetails',
        'TRIP_ID_DETAILS': 'getTripDetails',
        'GET_LAST_TRIP': 'getLastTripReport',
		'TRIP_STATUS': 'processRequest'
	} as const;

	export const VEHICLE_DISCOVERY_RESPONSE: VehicleDiscovery = {
        userid: USER_ID,
		vehicles: [
			{
				vin: VIN,
				services: [
					{
						service: 'TRIPREPORT',
						serviceEnabled: true,
						vehicleCapable: true
					}
				]		
			}
		]
	}

	export const LOCATION: IgniteInterface.IIgniteResponse.TripReport.LocationCoord = {
		latitude: 30.536526,
		longitude: 103.899567,
		timestamp: 1630990756453
	}

	export const VALID_TRIP_REPORT: IDataModels.TripReport = {
		tripId: TRIPID,
		travelDate: 1630987156453,
		duration: 3600000,
		distance: 120,
		startTime: 1630987156453,
		endTime: 1630990756453,
		averageSpeed: 90,
		topSpeed: 120,
		dayDrive: 90,
		numBoundary: 1,
		nightDrive: 10,
		isBusinessTrip: true,
		startLocation: LOCATION,
		endLocation: LOCATION,
		evModePercentage: 0.65,
		driveStyles: [
			{
				duration: 2340000,
				style: "City"
			},
			{
				duration: 840000,
				style: "Winter"
			}
		],
		numHardBraking: 1,
		numHardAcceleration: 2,
		numHardCornering: 3,
		isBoundaryOn: true,
		cost: 123,
		idleTime: 360000,
		encodedMapData: "idkyDi{cyR??ajY?sse@?maT?kb[?ur^?wyU?}ci@?zwqE?",
		fuelEfficiency: 123,
		fullLocation: [
			{
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453
			},
			{
				latitude: 31.615712,
				longitude: 103.89957,
				timestamp: 1630990336453
			},
			{
				latitude: 30.671424,
				longitude: 103.89957,
				timestamp: 1630987816453
			},
			{
				latitude: 31.282963,
				longitude: 103.89957,
				timestamp: 1630989556453
			},
			{
				latitude: 30.536526,
				longitude: 103.899567,
				timestamp: 1630987156453
			},
			{
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453
			},
			{
				latitude: 30.869275,
				longitude: 103.89957,
				timestamp: 1630988236453
			},
			{
				latitude: 30.536526,
				longitude: 103.89957,
				timestamp: 1630987456453
			},
			{
				latitude: 31.121085,
				longitude: 103.89957,
				timestamp: 1630989256453
			}
		],
		evMode: [
			{
				locations: [
					{
						latitude: 30.977194,
						longitude: 103.89957,
						timestamp: 1630988716453
					},
					{
						latitude: 30.671424,
						longitude: 103.89957,
						timestamp: 1630987816453
					},
					{
						latitude: 30.869275,
						longitude: 103.89957,
						timestamp: 1630988236453
					}
				]
			},
			{
				locations: [
					{
						latitude: 31.615712,
						longitude: 103.89957,
						timestamp: 1630990336453
					},
					{
						latitude: 31.399875,
						longitude: 103.89957,
						timestamp: 1630989916453
					}
				]
			}
		],
		hardBraking: [
			{
				duration: 420000,
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453,
				distance: 5
			}
		],
		hardAcceleration: [
			{
				duration: 540000,
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453,
				distance: 5
			},
			{
				duration: 420000,
				latitude: 30.671424,
				longitude: 103.89957,
				timestamp: 1630987816453,
				distance: 5
			}
		],
		hardCornering: [
			{
				duration: 540000,
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453,
				distance: 5
			},
			{
				duration: 420000,
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453,
				distance: 5
			},
			{
				duration: 780000,
				latitude: 30.536526,
				longitude: 103.89957,
				timestamp: 1630987456453,
				distance: 5
			}
		],
		boundary: [
			{
				latitude: 42.683868408203125,
				longitude: -83.22891998291016,
				timestamp: 1630990780580
			}
		],
		energyEfficiency: 48,
		totalEnergyConsumption: 2.5	
	}

	export const TRIP_STATUS_DATA : IgniteInterface.IIgniteResponse.TripReport.Data = {
        tripId: TRIPID,
        travelDate: 47.75,
        duration: 696.5,
        distance: -96.25,
        startTime: -97.5,
        endTime: 674.75,
        averageSpeed: 204.25,
        topSpeed: 603.75,
        dayDrive: 677.75,
        nightDrive: 580.0,
        isBusinessTrip: true,
        isFavouriteTrip: false,
        startLocation: {
            latitude: -13.25,
            longitude: 533.25,
            timestamp: 647.75
        },
        endLocation: {
            latitude: 679.75,
            longitude: 368.5,
            timestamp: 344.5
        },
        evModePercentage: 921.25,
        driveStyles: [],
        numHardBraking: 369.75,
        numHardAcceleration: 16.25,
        numHardCornering: 806.25,
        numBoundary: 2.25,
        isBoundaryOn: true,
        cost: 117.0,
        idleTime: 651.5,
        encodedMapData: 'ABCDEFGHIJKLMNOPQRSTUVWXYZA',
        fuelEfficiency: 273.75,
        fullLocation: [],
        ecoData: [],
        evMode: [],
        hardBraking: [],
        hardAcceleration: [],
        hardCornering: [],
        boundary: [],
        profiles: []
    }

	export const VALID_EVENTS: { [key in IDataModels.RequestType]: any } = {
		'GET_TRIP_LIST': {
			pathParams: {
				"vin": VIN,
				"userid": USER_ID
			},
			headers: {
				'clientrequestid': 'mock',
				'x-originator-type': 'mock',
				'content-type': 'application/json',
				'locale': 'mock',
				'x-clientapp-name': 'mock',
				'x-api-key': 'mock',
				'Authorization': 'mock'
			},
			queryStringParams: {
				'startTime': '0',
				'endTime': '0',
				'offset': '0',
				'size': '0'
			},
			runTimeInfo: {
				httpMethod: 'GET',
				resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips'
			}
		},
		'TRIP_ID_DETAILS': {
			pathParams: {
				"tripid": TRIPID,
				"vin": VIN,
				"userid": USER_ID
			},
			headers: {
				'clientrequestid': 'mock',
				'x-originator-type': 'mock',
				'content-type': 'application/json',
				'locale': 'mock',
				'x-clientapp-name': 'mock',
				'x-api-key': 'mock',
				'Authorization': 'mock'
			},
			runTimeInfo: {
				httpMethod: 'GET',
				resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips/{tripid}'
			}
		},
		'GET_LAST_TRIP': {
			pathParams: {
				userid: USER_ID,
				vin: VIN
			},
			headers: {
				'x-clientapp-version': X_CLIENTAPP_VERSION,
				'content-type': CONTENT_TYPE,
				'x-api-key': X_API_KEY,
				'locale': LOCALE,
				'x-originator-type': X_ORIGINATOR_TYPE,
				'clientrequestid': CLIENT_REQUEST_ID,
				'Authorization': AUTHORIZATION
			},
			runTimeInfo: {
				httpMethod: 'GET',
				resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/trips/last'
			}
		},
		'TRIP_STATUS': {
			pathParams: {
				userid: USER_ID,
				vin: VIN
			},
			headers: {
				'x-clientapp-version': X_CLIENTAPP_VERSION,
				'content-type': CONTENT_TYPE,
				'x-api-key': X_API_KEY,
				'locale': LOCALE,
				'x-originator-type': X_ORIGINATOR_TYPE,
				'clientrequestid': CLIENT_REQUEST_ID,
				'Authorization': AUTHORIZATION,
				'platformresponseid': '1234',
				'sessionid': 'mock'
			},
			runTimeInfo: {
				httpMethod: 'POST',
				resourcePath: '/v2/accounts/{userid}/vehicles/{vin}/tripreport/status'
			},
			requestBody: {
				userid: USER_ID,
				vin: VIN,
				sessionid: 'mock',
				EventID: 'ABCDEF',
				Version: 'ABCDEFGHIJKLMNOP',
				Timestamp: 95.25,
				Data: TRIP_STATUS_DATA
			}			
		}
	}

	export const VALID_SERVICE_PARAMS: { [key in IDataModels.RequestType]: IDataModels.ServiceParams } = {
		'GET_TRIP_LIST': {
			requestType: 'GET_TRIP_LIST',
			request: {
				userid: USER_ID,
				vehicleid: VIN,
				since: 0,
				till: 0,
				offset: 0,
				size: 0
			}
		},
		'TRIP_ID_DETAILS': {
			requestType: 'TRIP_ID_DETAILS',
			request: {
				userid: USER_ID,
				vehicleid: VIN,
				tripids: [
					TRIPID
				]
			}
		},
		'GET_LAST_TRIP': {
			requestType: 'GET_LAST_TRIP',
			request: {
				userid: USER_ID,
				vehicleid: VIN
			}
		},
		'TRIP_STATUS': {
			requestType: 'TRIP_STATUS',
			request: {
				userid: USER_ID,
				vehicleid: VIN,
				sessionid: 'mock',
				EventID: 'ABCDEF',
				Version: 'ABCDEFGHIJKLMNOP',
				Timestamp: 95.25,
				Data: TRIP_STATUS_DATA
			}
		}
	}

	export const NEARBY_SEARCH_RESPONSE: TomTom.NearbySearchResponse = {
		results: [
			{
				id: 'test',
				dist: 123,
				position: {
					lat: 30.536526,
					lon: 103.899567
				},
				poi: {
					name: 'Test'
				},
				address: {
					streetName: 'test street',
					//@ts-ignore
					streetNumber: '1'
				}
			}
		]
	}

	export const BATCH_RESPONSE: TomTom.BatchSearchResponse = {
		formatVersion: '',
		summary: {
			successfulRequests: 1,
			totalRequests: 1
		},
		batchItems: [{
			statusCode: 200,
			response: {
				results: [
					{
						id: 'test',
						dist: 123,
						position: {
							lat: 30.536526,
							lon: 103.899567
						},
						poi: {
							name: 'Test'
						},
						address: {
							streetName: 'test street',
							//@ts-ignore
							streetNumber: '1'
						}
					}
				]
			}
		},
		{
			statusCode: 200,
			response: {
				results: [
					{
						id: 'test',
						dist: 123,
						position: {
							lat: 30.536526,
							lon: 103.899567
						},
						poi: {
							name: 'Test'
						},
						address: {
							streetName: 'test street',
							//@ts-ignore
							streetNumber: '1'
						}
					}
				]
			}
		},
		{
			statusCode: 200,
			response: {
				results: [
					{
						id: 'test',
						dist: 123,
						position: {
							lat: 30.536526,
							lon: 103.899567
						},
						poi: {
							name: 'Test'
						},
						address: {
							streetName: 'test street',
							//@ts-ignore
							streetNumber: '1'
						}
					}
				]
			}
		},
		{
			statusCode: 200,
			response: {
				results: [
					{
						id: 'test',
						dist: 123,
						position: {
							lat: 30.536526,
							lon: 103.899567
						},
						poi: {
							name: 'Test'
						},
						address: {
							streetName: 'test street',
							//@ts-ignore
							streetNumber: '1'
						}
					}
				]
			}
		},]

	}

	export const VEHICLE_MASTER_DATA: VehicleMaster = { 
		users: [
			{
				userId: USER_ID,
				index: undefined,
				role:  null,
				regStatus: '',
				nickName:  null,				
				activatioSource: '',
				regTimestamp: 0
			}
		],
		services: [
			{
				service: 'TRIPREPORT',
				serviceEnabled: true,
				vehicleCapable: true
			}
		]
	}

	export const VEHICLE_MASTER_DATA_WITH_SERVICE_NOT_ENABLED: VehicleMaster = { 
		vin: VIN,
		users: [
			{
				userId: USER_ID,
				index: undefined,
				role:  null,
				regStatus: 'B',
				nickName:  null,				
				activatioSource: '',
				regTimestamp: 0
			}
		],
		services: [
			{
				service: 'TRIPREPORT',
				serviceEnabled: false,
				vehicleCapable: true
			}
		]
	}

	export const REVERSE_GEOCODE: TomTom.ReverseGeocodeResponse = {
		addresses: [
			{
				address: {
					streetNumber: "1",
					streetName: "test street"		
				}
			}
		]
	}

	export const EXTENDED_LOCATION: IDataModels.ExtendedLocation = {
		latitude: 30.536526,
		longitude: 103.899567,
		timestamp: 1630990756453,
		locationName: "Test",
		address: {
			streetNumber: "1",
			streetName: "test street"
		}
	}

	export const VALID_ENRICHED_TRIP_REPORT: IDataModels.EnrichedTripReport = {
		tripId: TRIPID,
		travelDate: 1630987156453,
		duration: 3600000,
		distance: 120,
		startTime: 1630987156453,
		endTime: 1630990756453,
		averageSpeed: 90,
		topSpeed: 120,
		dayDrive: 90,
		numBoundary: 1,
		nightDrive: 10,
		isBusinessTrip: true,
		startLocation: EXTENDED_LOCATION,
		endLocation: EXTENDED_LOCATION,
		evModePercentage: 0.65,
		driveStyles: [
			{
				duration: 2340000,
				style: "City"
			},
			{
				duration: 840000,
				style: "Winter"
			}
		],
		numHardBraking: 1,
		numHardAcceleration: 2,
		numHardCornering: 3,
		isBoundaryOn: true,
		cost: 123,
		idleTime: 360000,
		encodedMapData: "idkyDi{cyR??ajY?sse@?maT?kb[?ur^?wyU?}ci@?zwqE?",
		fuelEfficiency: 123,
		fullLocation: [
			{
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453
			},
			{
				latitude: 31.615712,
				longitude: 103.89957,
				timestamp: 1630990336453
			},
			{
				latitude: 30.671424,
				longitude: 103.89957,
				timestamp: 1630987816453
			},
			{
				latitude: 31.282963,
				longitude: 103.89957,
				timestamp: 1630989556453
			},
			{
				latitude: 30.536526,
				longitude: 103.899567,
				timestamp: 1630987156453
			},
			{
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453
			},
			{
				latitude: 30.869275,
				longitude: 103.89957,
				timestamp: 1630988236453
			},
			{
				latitude: 30.536526,
				longitude: 103.89957,
				timestamp: 1630987456453
			},
			{
				latitude: 31.121085,
				longitude: 103.89957,
				timestamp: 1630989256453
			}
		],
		evMode: [
			{
				locations: [
					{
						latitude: 30.977194,
						longitude: 103.89957,
						timestamp: 1630988716453
					},
					{
						latitude: 30.671424,
						longitude: 103.89957,
						timestamp: 1630987816453
					},
					{
						latitude: 30.869275,
						longitude: 103.89957,
						timestamp: 1630988236453
					}
				]
			},
			{
				locations: [
					{
						latitude: 31.615712,
						longitude: 103.89957,
						timestamp: 1630990336453
					},
					{
						latitude: 31.399875,
						longitude: 103.89957,
						timestamp: 1630989916453
					}
				]
			}
		],
		hardBraking: [
			{
				duration: 420000,
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453,
				distance: 5
			}
		],
		hardAcceleration: [
			{
				duration: 540000,
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453,
				distance: 5
			},
			{
				duration: 420000,
				latitude: 30.671424,
				longitude: 103.89957,
				timestamp: 1630987816453,
				distance: 5
			}
		],
		hardCornering: [
			{
				duration: 540000,
				latitude: 30.977194,
				longitude: 103.89957,
				timestamp: 1630988716453,
				distance: 5
			},
			{
				duration: 420000,
				latitude: 31.399875,
				longitude: 103.89957,
				timestamp: 1630989916453,
				distance: 5
			},
			{
				duration: 780000,
				latitude: 30.536526,
				longitude: 103.89957,
				timestamp: 1630987456453,
				distance: 5
			}
		],
		boundary: [
			{
				latitude: 42.683868408203125,
				longitude: -83.22891998291016,
				timestamp: 1630990780580
			}
		],
		energyEfficiency: 48,
		totalEnergyConsumption: 2.5	
	}

	export const IGNITE_RESPONSES = {
		'GET_TRIP_LIST': {
			numRecords: 1,
			trips: [
				VALID_TRIP_REPORT
			]
		},
		'TRIP_ID_DETAILS': {
			detailType: 'fulltripdata',
			trips: [
				VALID_TRIP_REPORT
			]
		}
	}
	export class MockIgniteService {
        public async getAllTripsDetailsBetweenDurations(userId: string, vehicleId: string, queryParameters: IgniteInterface.IIgniteRequest.TripReport.Params): Promise<IgniteInterface.IIgniteResponse.TripReport.GetAllTripsDetailsBetweenDurationsResponse> {
            [vehicleId, userId, queryParameters]
            return {} as IgniteInterface.IIgniteResponse.TripReport.GetAllTripsDetailsBetweenDurationsResponse;
        }

		public async getTripDetailsByTripIds(userId: string, vehicleId: string, tripids: string[]): Promise<IgniteInterface.IIgniteResponse.TripReport.GetTripDetailsByTripId> {
            [vehicleId, userId, tripids]
            return {} as IgniteInterface.IIgniteResponse.TripReport.GetTripDetailsByTripId;
        }
    }

	export const ENRICHED_LOCATIONS: IDataModels.EnrichedLocations = {
		startLocation: EXTENDED_LOCATION,
        endLocation: EXTENDED_LOCATION
	}

	export const VALID_ENRICHED_TRIP_REPORT2: TripReportDetailsEnriched = {
        tripId: TRIPID,
        startLocation: EXTENDED_LOCATION,
        endLocation: EXTENDED_LOCATION,
    }

	export const VALID_LAMBDA_RESPONSES = {
		'GET_TRIP_LIST': {
			numRecords: 1,
			trips: [
				VALID_TRIP_REPORT
			]
		},
        'TRIP_ID_DETAILS': {
			detailType: 'fulltripdata',
			trips: [
				VALID_ENRICHED_TRIP_REPORT
			]
		},
        'GET_LAST_TRIP': {
			userVin: `${USER_ID}:${VIN}`,
			EventID: 'test-event-id',
			Version: 'test',
			Timestamp: 1234,
			Data: VALID_ENRICHED_TRIP_REPORT2
		},
		'TRIP_STATUS': {
			message: "TripReport data received successfully"
		}
	}

	export const CHARACTERISTIC = [{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "ELT",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "BEV",
		X_VAL_DESC: "descrizione blabla",
		mapped: "notHide"
	},
	{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "ELT",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "PHEV",
		X_VAL_DESC: "descrizione blabla",
		mapped: "notHide"
	},
	{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "ELT",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "OTHER",
		X_VAL_DESC: "descrizione blabla",
		mapped: "hide"
	},
	{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "OTHER",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "BEV",
		X_VAL_DESC: "descrizione blabla",
		mapped: "hide"
	},
	{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "OTHER",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "PHEV",
		X_VAL_DESC: "descrizione blabla",
		mapped: "hide"
	},
	{
		I_VIN: "FCLF45433245565",
		C_CHARACTERISTIC_CODE: "OTHER",
		X_CHARACTERISTIC_DESC: "descrizione blabla",
		C_VAL_CODE: "OTHER",
		X_VAL_DESC: "descrizione blabla",
		mapped: "hide"
	}]

	export const DYNAMODB_RESPONSES = {
		'GET_LAST_TRIP_ENRICHED': {
			userVin: `${USER_ID}:${VIN}`,
			EventID: 'test-event-id',
			Version: 'test',
			userid: USER_ID,
			vin: VIN,
			Timestamp: 1234,
			Data: VALID_ENRICHED_TRIP_REPORT2
		},
		'GET_LAST_TRIP_NOT_ENRICHED': {
			userVin: `${USER_ID}:${VIN}`,
			EventID: 'test-event-id',
			Version: 'test',
			userid: USER_ID,
			vin: VIN,
			Timestamp: 1234,
			Data: {
				tripId:TRIPID
			}
		},
	}

	export const TRIP_DETAILS_BY_ID: IgniteInterface.IIgniteResponse.TripReport.GetTripDetailsByTripId = {
		detailType: "type",
		trips: [
			VALID_ENRICHED_TRIP_REPORT2
		]
	}
}