export namespace ITripGetterRequest { 
    export interface ITripGetterRequest {
        // sessionId , clientRequestId and authorization are not listed here because setted by ignite library
        vin: string;
        userid: string;
        since?: number;
        till: number;
        offset?: number;
        size?: number;
    };
}