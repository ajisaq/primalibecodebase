import { City } from './city.model';

export class Airport {
    iri: string;
    iriType: string;
    id: number;
    name: string;
    code: string;
    icao: string;
    state: string;
    elevation: string;
    latitude: string;
    longitude: string;
    city: City;
    minimumConnectingMinute: number;
    maximumConnectingMinute: number;
    minimumConnectingCity: number;
    maximumConnectingCity: number;
    collectExcessBaggage: boolean;
    hideOnWeb: boolean;
    webCheckIn: boolean;
    barcodeAvailability: boolean;
    surchargeAmount: number;


    /**
     * Constructor
     *
     * @param airport
     */
    constructor(airport?:any) {
        let iri = typeof airport === "string" ? airport : null;
        let id = typeof airport === "number" ? airport : null;
        airport = airport || {};
        this.iri = airport['@id'] || iri;
        this.iriType = airport['@type'] || id;
        this.id = airport.id || null;//FuseUtils.generateGUID();
        this.name = airport.name || null;
        this.code = airport.code || null;
        this.icao = airport.icao || null;
        this.state = airport.state || null;
        this.elevation = airport.elevation || null;
        this.latitude = airport.latitude || null;
        this.longitude = airport.longitude || null;
        this.minimumConnectingCity = airport.minimum_connecting_city || null;
        this.maximumConnectingCity = airport.maximum_connecting_city || null;
        this.minimumConnectingMinute = airport.minimum_connecting_minute || null;
        this.maximumConnectingMinute = airport.maximum_connecting_minute || null;
        this.collectExcessBaggage = airport.collect_excess_baggage || false;
        this.hideOnWeb = airport.hide_on_web || false;
        this.barcodeAvailability = airport.barcode_availability || false;
        this.webCheckIn = airport.web_check_in || false;
        this.city = new City(airport.city || {});
        this.surchargeAmount = airport.surcharge_amount || 0;
    }

}