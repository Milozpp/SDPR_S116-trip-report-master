export interface ConstantsModel {
    [key: string]: RequestTypeMapping;
}

export interface RequestTypeMapping {
    [key: string]: string;
}

export type RequestType = "GET_DEFAULT_TRIP_REPORT_SETTINGS" | "UPDATE_DEFAULT_TRIP_REPORT_SETTINGS" | "GET_TRIP_REPORT_SETTINGS" | "UPDATE_TRIP_REPORT_SETTINGS";

export type Currency = "USD" | "CAD" | "EURO" | "CNY" | "GBP" | "BRL";

export interface TripReportSettingsRequest {
    requestType?: RequestType;
    userid: string;
    vin: string;
    tripid?: string;
    settings?: TripReportSettings;
}

export interface TripReportSettings {
    isBusiness: boolean;
    isFavorite?: boolean;
    fuelCostPerGallon: number;
    costPerEnergy?: number;
    currency: Currency;
}