import { Airline } from './airline.model';
import { Aircraft } from './aircraft.model';
import { AircraftType } from './aircraft-type.model';
import { City } from './city.model';
import { Time } from '@angular/common';
import { Flight } from './flight.model';
import { CabinClass } from './cabin-class.model';
import { Airport } from './airports.model';

import * as moment from 'moment';
import { Fare } from './fare.model';

export class Schedule
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    airline: Airline;
    flightNumber: number;
    initialDepartCity: City;
    finalArriveCity: City;
    initialDepartAirport: Airport;
    finalArriveAirport: Airport;
    startDate: string|null;
    endDate: string|null;
    // aircraftType: AircraftType;
    aircraft: Aircraft;
    seatConfiguration?: object;
    scheduleLegs: ScheduleLeg[];
    flights: any[];
    pnl: Pnl;
    inventories: Inventory[];
    // segment: object;
    // inventory: any;
    pnlDistribution: string;
    fare: Fare;
    // permissions: number[];
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
    isNestingDown: boolean;

    isActive: boolean;
    hideOnWeb: boolean;
    hideOnAgent: boolean;


    //   // Format date of a column
    //   dateTimeFormatter(params) {
    //     return moment(params.value, 'YYYY-MM-DD\THH:mm:ssP').format('DD/MM/YYYY HH:mm');
    //   }

    /**
     * Constructor
     *
     * @param schedule
     */
    constructor(schedule?:any,dept=0)
    {
        let iri = typeof schedule ==="string" ? schedule : null;
        let id  = typeof schedule ==="number" ? schedule : null;
        schedule            = schedule || {};
        this.iri            = schedule["@id"] || iri;
        this.iriType        = schedule["@type"] || null;
        this.id             = schedule.id || id;
        this.name           = schedule.name || null;

       
        // isString!=null
        if( true){
        // if(dept>0){
         
        // dept--;
        this.flightNumber       = schedule.flight_number || 0;
        this.initialDepartCity = new City(schedule.initial_depart_city || {});
        this.finalArriveCity = new City(schedule.final_arrive_city || {});
        this.initialDepartAirport = new Airport(schedule.initial_depart_airport || {});
        this.finalArriveAirport = new Airport(schedule.final_arrive_airport || {});
        this.airline        = new Airline(schedule.airline || {});
        this.startDate      = schedule.start_date? moment(schedule.start_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD\THH:mm:ss') : null;
        // this.startDate      = schedule.start_date || null;
        
        // this.endDate        = schedule.end_date || null;
        this.endDate        = schedule.end_date? moment(schedule.end_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD\THH:mm:ss') : null;
        
        // console.log(5555,dept,schedule.start_date,moment(schedule.start_date || null, 'YYYY-MM-DD\THH:mm:ssP').add(1,'hours').format('YYYY-MM-DD\THH:mm:ss'));
        // this.aircraftType   = new AircraftType(schedule.aircraft_type || {}); 
        this.aircraft       = new Aircraft(schedule.aircraft || {}); 
        this.seatConfiguration = new Airline(schedule.seat_configuration || {});
        // this.scheduleLegs           = new ScheduleLeg(schedule.scheduleLegs || {});
        // TODO: make models for this
        // let schedule_legs   =schedule.schedule_legs;
        this.scheduleLegs   = schedule.schedule_legs ? schedule.schedule_legs.map((leg:any)=>new ScheduleLeg(leg || {})) : [];
        this.inventories   = schedule.inventories ? schedule.inventories.map((inventory:any)=>new Inventory(inventory || {})) : [];
        this.flights        = schedule.flights ? schedule.flights.map((flight:any)=>new Flight(flight || {})) : [];
        this.pnl            = new Pnl(schedule.pnl || {})
        // this.inventory      = schedule.inventory || {};
        this.pnlDistribution= schedule.pnl_distribution || null;
        this.fare = new Fare(schedule.fare || {})

        this.mon = schedule.mon || false;
        this.tue = schedule.tue || false;
        this.wed = schedule.wed || false;
        this.thu = schedule.thu || false;
        this.fri = schedule.fri || false;
        this.sat = schedule.sat || false;
        this.sun = schedule.sun || false;
        this.isActive = schedule.is_active || false;
        this.isNestingDown = schedule.is_nesting_down || false;
        this.hideOnWeb = schedule.hide_on_web || false;
        this.hideOnAgent = schedule.hide_on_agent || false;   
        // }
        }

    }
}


export class ScheduleLeg
{
    iri     : string;
    iriType : string;
    id      : number;
    sn      : number;
    // name: string;
    airline         : Airline;
    flightNumber    : number;
    departCity      : City;
    arriveCity      : City;
    departAirport   : Airport;
    arriveAirport   : Airport;
    // departDate       : Date;
    // arriveDate       : Date;
    etd             : string|null;
    eta             : string|null;
    // localEtd        : Time;
    // localEta        : Time;
    // daysCrossover   : string;
    // startDate       : string;
    // endDate         : string;
    // aircraftType    : AircraftType;
    aircraft        : Aircraft;
    seatConfiguration?: object;
    // inventories       : [any];
    stopFlights     : Flight[];
    inventoryCaps   : InventoryCap[];
    // pnlDistribution : string;
    isActive        : boolean;

    /**
     * Constructor
     *
     * @param scheduleLeg
     */
    constructor(scheduleLeg?:any)
    {
        // console.log(7777,'new ScheduleLeg');
        let iri     = typeof scheduleLeg ==="string" ? scheduleLeg : null;
        let id      = typeof scheduleLeg ==="number" ? scheduleLeg : null;
        scheduleLeg         = scheduleLeg || {};
        this.iri            = scheduleLeg["@id"] || iri;
        this.iriType        = scheduleLeg["@type"] || null;
        this.sn             = scheduleLeg.sn || null;
        this.id             = scheduleLeg.id || id;
        this.flightNumber    = scheduleLeg.flight_number || 0;
        this.departCity     = new City(scheduleLeg.depart_city || {});
        this.arriveCity     = new City(scheduleLeg.arrive_city || {});
        this.departAirport  = new Airport(scheduleLeg.depart_airport || {});
        this.arriveAirport  = new Airport(scheduleLeg.arrive_airport || {});
        this.airline        = new Airline(scheduleLeg.airline || {});
        // this.departDate      = scheduleLeg.depart_date || null;
        // this.arriveDate      = scheduleLeg.arrive_date || null;
        this.etd            = scheduleLeg.etd?moment(scheduleLeg.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm'):null;
        this.eta            = scheduleLeg.eta?moment(scheduleLeg.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm'):null;
        // this.localEtd       = scheduleLeg.local_etd;
        // this.localEta       = scheduleLeg.local_eta;
        // this.startDate      = scheduleLeg.start_date || null;
        // this.endDate        = scheduleLeg.end_date || null;
        // this.aircraftType   = new AircraftType(scheduleLeg.aircraft_type || {}); 
        this.aircraft       = new Aircraft(scheduleLeg.aircraft || {}); 
        // TODO: make models for this
        // this.flights        = scheduleLeg.flights || [];
        // this.inventories      = scheduleLeg.inventories || [];
        this.stopFlights    = scheduleLeg.stop_flights ? scheduleLeg.stop_flights.map((stop_flight:any)=>new Flight(stop_flight || {})) : [];
        this.inventoryCaps    = scheduleLeg.inventory_caps ? scheduleLeg.inventory_caps.map((inventory_cap:any)=>new InventoryCap(inventory_cap || {})) : [];
        this.isActive       = scheduleLeg.is_active || false;

        // console.log('new Leg',{scheduleLeg},this)
    }
}

// export class Airport
// {
//     iri: string;
//     iriType: string;
//     id: number;
//     name: string;
//     city: City;


//     /**
//      * Constructor
//      *
//      * @param airport
//      */
//     constructor(airport?)
//     {
//         airport         = airport || {};
//         this.iri        = airport["@id"] || null;
//         this.iriType    = airport["@type"] || null;
//         this.id         = airport.id || null;;
//         this.name       = airport.name || null;
//         this.city       = new City(airport.city || {})
//     }

// }

export class Pnl
{
    iri: string;
    iriType: string;
    id: number;
    autoPnl: boolean;
    pnlHours: number;
    pnlSent: boolean;
    ssmDistribution: boolean;
    activatePnx: boolean;
    activatePnl: boolean;
    pnl1Sent: boolean;
    pnl1Hours: number;
    pnl2Sent: boolean;
    pnl2Hours: number;
    pnx1Sent: boolean;
    pnx1Hours: number;
    pnx2Sent: boolean;
    pnx2Hours: number;
    includeEticket: boolean;
    includePticket: boolean;
    adl: boolean;


    /**
     * Constructor
     *
     * @param pnl
     */
    constructor(pnl?:any)
    {
        pnl             = pnl || {};
        this.iri        = pnl["@id"] || null;
        this.iriType    = pnl["@type"] || null;
        this.id         = pnl.id || null;

        this.autoPnl    = pnl.auto_pnl  || false;
        this.pnlHours   = pnl.pnl_hours || 0;
        this.pnlSent    = pnl.pnl_sent  || false;
        this.ssmDistribution    = pnl.ssm_distribution  || false;
        this.activatePnx    = pnl.activate_pnx  || false;
        this.activatePnl    = pnl.activate_pnl  || false;
        this.pnl1Sent   = pnl.pnl1_sent || false;
        this.pnl1Hours  = pnl.pnl1_hours    || 0;
        this.pnl2Sent   = pnl.pnl2_sent || false;
        this.pnl2Hours  = pnl.pnl2_hours    || 0;
        this.pnx1Sent   = pnl.pnx1_sent || false;
        this.pnx1Hours  = pnl.pnx1_hours || 0;
        this.pnx2Sent   = pnl.pnx2_sent || false;
        this.pnx2Hours  = pnl.pnx2_hours || false;
        this.includeEticket = pnl.include_eticket || false;
        this.includePticket = pnl.include_pticket || false;
        this.adl    = pnl.adl   || false;

        // console.log('new Pnl',this)
    }

}


export class Inventory
{
    iri         : string;
    iriType     : string;
    id          : number;
    schedule            : Schedule;
    cabinClass          : CabinClass;
    bookingClass        : string;
    classCapacity       : number;
    // agentCapacity       : number;
    agentAvailability   : number;
    internalAvailability: number;
    qtyReservation      : number;
    // avsThreshold        : number;
    closed              : boolean;
    // preallocated        : number;
    // preallocatedSold    : number;


    /**
     * Constructor
     *
     * @param inventory
     */
    constructor(inventory?: any)
    {
        let iri = typeof inventory ==="string" ? inventory : null;
        let id = typeof inventory ==="number" ? inventory : null;
        inventory       = inventory || {};
        this.iri        = inventory["@id"] || iri;
        this.iriType    = inventory["@type"] || null;
        this.id         = inventory.id || id;
        this.agentAvailability  = inventory.agent_availability || 0;
        // this.agentCapacity      = inventory.agent_capacity || 0;
        // this.avsThreshold       = inventory.avs_threshold || 0;
        this.bookingClass       = inventory.booking_class || null;
        this.classCapacity      = inventory.class_capacity || 0;
        this.cabinClass         = new CabinClass(inventory.cabin_class || {});
        this.closed             = inventory.closed || false;
        this.internalAvailability= inventory.internal_availability || 0;
        // this.preallocated       = inventory.preallocated || 0;
        // this.preallocatedSold   = inventory.preallocated_sold || 0;
        this.qtyReservation     = inventory.qty_reservation || 0;
        this.schedule           = new Schedule(inventory.schedule || {});

    }
}


export class InventoryCap
{
    iri         : string;
    iriType     : string;
    id          : number;
    // schedule            : Schedule;
    scheduleLeg         : ScheduleLeg;
    cabinClass          : CabinClass;
    bookingClass        : string;
    classCapacity       : number;
    // agentCapacity       : number;
    agentAvailability   : number;
    internalAvailability: number;
    qtyReservation      : number;
    // avsThreshold        : number;
    closed              : boolean;
    // preallocated        : number;
    // preallocatedSold    : number;



    /**
     * Constructor
     *
     * @param inventoryCap
     */
    constructor(inventoryCap?: any)
    {
        let iri = typeof inventoryCap ==="string" ? inventoryCap : null;
        let id = typeof inventoryCap ==="number" ? inventoryCap : null;
        inventoryCap       = inventoryCap || {};
        this.iri        = inventoryCap["@id"] || iri;
        this.iriType    = inventoryCap["@type"] || null;
        this.id         = inventoryCap.id || id;
        // this.schedule           = new Schedule(inventoryCap.schedule || {});
        this.scheduleLeg           = new ScheduleLeg(inventoryCap.scheduleLeg || {});
        this.agentAvailability  = inventoryCap.agent_availability || 0;
        // this.agentCapacity      = inventoryCap.agent_capacity || 0;
        // this.avsThreshold       = inventoryCap.avs_threshold || 0;
        this.bookingClass       = inventoryCap.booking_class || null;
        this.classCapacity      = inventoryCap.class_capacity || 0;
        this.cabinClass         = new CabinClass(inventoryCap.cabin_class || {});
        this.closed             = inventoryCap.closed || false;
        this.internalAvailability= inventoryCap.internal_availability || 0;
        // this.preallocated       = inventoryCap.preallocated || 0;
        // this.preallocatedSold   = inventoryCap.preallocated_sold || 0;
        this.qtyReservation     = inventoryCap.qty_reservation || 0;


    }

}


export class InventoryLeg extends InventoryCap {
        
}