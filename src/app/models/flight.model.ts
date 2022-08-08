import { City } from './city.model';
import { Airline } from './airline.model';
import { Airport } from './airports.model';
import { Time } from '@angular/common';
import { ScheduleLeg, InventoryCap, Schedule } from './schedule.model';
import { AircraftType } from './aircraft-type.model';
import { Aircraft } from './aircraft.model';

import * as moment from 'moment';
import { Fare } from './fare.model';
import { FlightLeg } from './dcs.model';

export class Flight
{
    iri     : string;
    iriType : string;
    id      : number;
    sn      : number;
    // name: string;
    schedule?        : Schedule;
    scheduleIri?     : string;
    airline         : Airline;
    flightNumber    : string;
    // departCity      : City;
    // arriveCity      : City;
    departAirport   : Airport;
    arriveAirport   : Airport;
    departDate       : any;
    arriveDate       : any;
    departDay       : any;
    arriveDay       : any;
    etd             : string;
    eta             : string;
    // localEtd        : Time;
    // localEta        : Time;
    // daysCrossover   : string;
    // startDate       : string;
    // endDate         : string;
    type            : string;
    hasStop         : boolean;
    stops           : any;
    initialDepartLeg: ScheduleLeg;
    finalArriveLeg  : ScheduleLeg;
    // aircraftType    : AircraftType;
    aircraft        : Aircraft;
    seatConfiguration?: object;
    // inventory       : any;
    stopLegs        : any[]; //ScheduleLeg[]
    flightLegs        : any[]; //FlightLeg[]
    inventoryCaps   : InventoryCap[];
    // pnlDistribution : string;
    fare        : Fare;
    isActive        : boolean;
    isCancelled        : boolean;

    // cost: number;


    /**
     * Constructor
     *
     * @param flight
     */
    constructor(flight?:any)
    {
        // console.log(6666,'new Flight');
        let iri     = typeof flight ==="string" ? flight : null;
        let id      = typeof flight ==="number" ? flight : null;
        flight         = flight || {};
        this.iri            = flight["@id"] || iri;
        this.iriType        = flight["@type"] || null;
        this.sn             = flight.sn || 0;
        this.id             = flight.id || id;
        this.flightNumber   = flight.flight_number || null;
        // this.departCity     = new City(flight.depart_city || {});
        // this.arriveCity     = new City(flight.arrive_city || {});
        if(typeof flight.schedule === 'string'){
            this.scheduleIri  = flight.schedule;
        }else if(typeof flight.schedule === 'object'){
            this.schedule  = new Schedule(flight.schedule || {});
            this.scheduleIri  = this.schedule.iri;
        }
        this.departAirport  = new Airport(flight.depart_airport || {});
        this.arriveAirport  = new Airport(flight.arrive_airport || {});
        this.airline        = new Airline(flight.airline || {});
        this.departDate      = moment(flight.depart_date || null).format('YYYY-MM-DD\THH:mm:ss');
        this.arriveDate      = moment(flight.arrive_date || null).format('YYYY-MM-DD\THH:mm:ss');
        this.departDay      = moment(flight.depart_day || null).format('YYYY-MM-DD\THH:mm:ss');
        this.arriveDay      = moment(flight.arrive_day || null).format('YYYY-MM-DD\THH:mm:ss');
        this.etd            = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm');
        this.eta            = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm');
        // this.localEtd       = flight.local_etd;
        // this.localEta       = flight.local_eta;
        this.type           = flight.type;
        this.hasStop        = flight.has_stop;
        this.stops          = flight.stops;
        this.initialDepartLeg= flight.initial_depart_leg;
        this.finalArriveLeg = flight.final_arrive_leg;
        // this.startDate      = scheduleLeg.start_date || null;
        // this.endDate        = scheduleLeg.end_date || null;
        // this.aircraftType   = new AircraftType(flight.aircraft_type || {}); 
        this.aircraft       = new Aircraft(flight.aircraft || {}); 
        // TODO: make models for this
        // this.flights        = scheduleLeg.flights || [];
        // this.inventory      = scheduleLeg.inventory || {};
        this.flightLegs       = flight.flight_legs; //flight.flight_legs ? flight.flight_legs.map((flight_leg:any)=>new FlightLeg(flight_leg || {})) : [];
        this.stopLegs       = flight.stop_legs; //flight.stop_legs ? flight.stop_legs.map((stop_leg:any)=>new ScheduleLeg(stop_leg || {})) : [];
        this.inventoryCaps  = flight.inventory_caps ? flight.inventory_caps.map((inventory_cap:any)=>new InventoryCap(inventory_cap || {})) : [];
        this.fare           = new Fare(flight.fare || {});
        this.isActive       = flight.is_active || false;
        this.isCancelled       = flight.is_cancelled || false;

        // this.cost = flight.cost || null;
    }
}
