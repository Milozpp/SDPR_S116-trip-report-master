import { IgniteInterface } from 'gcv-ignite';
import { GcvDynamoDbInterfaces } from 'gcv-dynamodb-dao';

export namespace Constants {

	export interface MethodMapping {
		[key: string]: RequestTypeMapping;
	}

	export interface RequestTypeMapping {
		[key: string]: MethodSettings;
	}

	export interface MethodSettings {
		requestType: RequestType;
		schema: any;
	}
}

export type RequestType = 'TRIP_ID_DETAILS' | 'GET_TRIP_LIST' | 'GET_LAST_TRIP' | 'TRIP_STATUS';

export interface ServiceParams {
	requestType: RequestType;
	request: TripIdDetailsServiceParams | GetTripListServiceParams | LastTripServiceParams | TripStatus;
}

export interface TripIdDetailsServiceParams {
	userid: string;
	vehicleid: string;
	tripids: string[];
}

export interface GetTripListServiceParams {
	userid: string;
	vehicleid: string;
	since: number;
	till: number;
	offset: number;
	size: number;
}

export interface LastTripServiceParams {
	userid: string;
	vehicleid: string;
}

export interface Address {
	streetNumber?: string,
	streetName?: string,
	municipality?: string,
	countrySecondarySubdivision?: string,
	countrySubdivision?: string,
	postalCode?: string,
	countryCode?: string,
	country?: string,
	countryCodeISO3?: string,
	freeformAddress?: string,
	localName?: string
}
export interface ExtendedLocation {
	latitude: number,
	longitude: number,
	timestamp: number,
	locationName?: string,
	address: Address
}

export type GenericResponse =
	IgniteInterface.IIgniteResponse.TripReport.GetAllTripsDetailsBetweenDurationsResponse
	| IgniteInterface.IIgniteResponse.TripReport.GetTripDetailsByTripId
	| LastTripResponse
	| Response;

export type TripReport = IgniteInterface.IIgniteResponse.TripReport.Data

export interface EnrichedLocations {
	startLocation: ExtendedLocation,
	endLocation: ExtendedLocation
}

export interface EnrichedTripReport extends TripReport {
	startLocation?: ExtendedLocation,
	endLocation?: ExtendedLocation,
	evModePercentage?: number,
	evMode?: GcvDynamoDbInterfaces.TripReport.EvMode[]
}

export interface TripStatus {
	userid: string,
	vehicleid: string,
	sessionid: string,
	EventID: string,
	Version: string,
	Timestamp: number,
	Data: TripReport
}

export interface LastTripResponse extends Omit<TripStatus, "userid" | "vehicleid" | "sessionid"> {
	userVin: string
}

export interface Response {
	message: string
}