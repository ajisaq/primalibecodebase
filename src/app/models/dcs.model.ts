import { Time } from '@angular/common';
import { Aircraft } from './aircraft.model';
import { ScheduleLeg } from './schedule.model';
import { AircraftType } from './aircraft-type.model';
import { Airline } from './airline.model';
import { Airport } from './airports.model';
import { Product } from './products.model';

import * as moment from 'moment';
import { Seat } from './seat.model';
import { PassengerType } from './fare.model';
import { upperCase } from 'lodash';

export class Departure
{
    id: number;
    date: string|null;
    flightNo: string;
    arrive: string;
    depart: string;

    /**
     * Constructor
     *
     * @param departure
     */
    constructor(departure:any)
    {
        {
            this.id         = departure.id || null;
            this.date       = moment(departure.depart_date).format('YYYY-MM-DD') || null;
            this.flightNo      = departure.flight_number || null;
            this.arrive   = departure.arrive_airport || null;
            this.depart = departure.depart_airport || null;
        }
    }
}

export class DepartureSearch
{
    search_by: string;
    flight_date: string;
    departure: string;
    flight: string;

    /**
     * Constructor
     *
     * @param departureSearch
     */
    constructor(departureSearch:any)
    {
        {
            this.search_by       = departureSearch.search_by || null;
            this.flight_date      = departureSearch.flight_date || null;
            this.departure   = departureSearch.departure || null;
            this.flight = departureSearch.flight || null;
        }
    }
}


export class Pnr
{
    pnr: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    gender: string;
    destination: string;
    is_group: boolean;
    pax_count: number;
    service_class: string;
    baggage_pcs: number;
    baggage_weight: number;
    seat: string;
    status: number;
    description: string;
    ssr: string[];

    /**
     * Constructor
     *
     * @param pnr
     */
    constructor(pnr:any)
    {
        {
            this.pnr       = pnr.pnr || null;
            this.first_name      = pnr.first_name || null;
            this.last_name      = pnr.last_name || null;
            this.phone     = pnr.phone || null;
            this.email     = pnr.email || null;
            this.gender    = pnr.gender || null;
            this.destination    = pnr.destination || null;
            this.is_group  = pnr.is_group || null;
            this.pax_count = pnr.pax_count || 0;
            this.service_class = pnr.service_class || null;
            this.baggage_pcs = pnr.baggage_pcs || 0;
            this.baggage_weight = pnr.baggage_weight || 0;
            this.seat = pnr.seat || null;
            this.status = pnr.status || null;
            this.description = pnr.remarks || null;
            this.ssr = pnr.ssr || [];
        }
    }
}

//
    // export class Flight
    // {
    //     iri     : string;
    //     iriType : string;
    //     id      : number;
    //     sn      : number;
    //     // name: string;
    //     airline         : Airline;
    //     flightNumber    : string;
    //     // departCity      : City;
    //     // arriveCity      : City;
    //     departAirport   : Airport;
    //     arriveAirport   : Airport;
    //     departDate       : Date;
    //     arriveDate       : Date;
    //     departDay       : Date;
    //     arriveDay       : Date;
    //     etd             : string;
    //     eta             : string;
    //     boardingGate    : string;
    //     // localEtd        : Time;
    //     // localEta        : Time;
    //     daysCrossover   : string;
    //     // startDate       : string;
    //     // endDate         : string;
    //     type            : string;
    //     hasStop         : boolean;
    //     stops           : number;
    //     initialDepartLeg: ScheduleLeg;
    //     finalArriveLeg  : ScheduleLeg;
    //     aircraftType    : AircraftType;
    //     aircraft        : Aircraft;
    //     seatConfiguration: object;
    //     inventory       : any;
    //     pnlDistribution : string;
    //     isActive        : boolean;

    //     /**
    //      * Constructor
    //      *
    //      * @param flight
    //      */
    //     constructor(flight?)
    //     {
    //         let iri     = typeof flight ==="string" ? flight : null;
    //         let id      = typeof flight ==="number" ? flight : null;
    //         flight         = flight || {};
    //         this.iri            = flight["@id"] || iri;
    //         this.iriType        = flight["@type"] || null;
    //         this.sn             = flight.sn || null;
    //         this.id             = flight.id || id;
    //         this.flightNumber   = flight.flight_number || null;
    //         // this.departCity     = new City(flight.depart_city || {});
    //         // this.arriveCity     = new City(flight.arrive_city || {});
    //         this.departAirport  = new Airport(flight.depart_airport || {});
    //         this.arriveAirport  = new Airport(flight.arrive_airport || {});
    //         this.airline        = new Airline(flight.airline || {});
    //         this.departDate      = flight.depart_date || null;
    //         this.arriveDate      = flight.arrive_date || null;
    //         this.departDay      = flight.depart_day || null;
    //         this.arriveDay      = flight.arrive_day || null;
    //         this.etd            = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm');
    //         this.eta            = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm');
    //         // this.localEtd       = flight.local_etd;
    //         // this.localEta       = flight.local_eta;
    //         this.boardingGate        =  flight.boarding_gate || null;
    //         this.type           = flight.type;
    //         this.hasStop        = flight.hasStop;
    //         this.stops          = flight.stops;
    //         this.initialDepartLeg= flight.initialDepartLeg;
    //         this.finalArriveLeg = flight.finalArriveLeg;
    //         // this.startDate      = scheduleLeg.start_date || null;
    //         // this.endDate        = scheduleLeg.end_date || null;
    //         this.aircraftType   = new AircraftType(flight.aircraft_type || {}); 
    //         this.aircraft       = new Aircraft(flight.aircraft || {}); 
    //         // TODO: make models for this
    //         // this.flights        = scheduleLeg.flights || [];
    //         // this.inventory      = scheduleLeg.inventory || {};

    //         this.isActive       = flight.is_active || false;

    //     }
    // }


export class Flight
{
    iri     : string;
    iriType : string;
    id      : number;
    // name: string;
    airline         : Airline;
    flightNumber    : string;
    departAirport   : string;
    arriveAirport   : string;
    departDate      : string|null;
    arriveDate      : string|null;
    departDay       : string|null;
    arriveDay       : string|null;
    etd             : string|null;
    eta             : string|null;
    localEtd        : string|null;
    localEta        : string|null;
    boardingGate    : string;
    // daysCrossover   : string;
    type            : string;
    hasStop         : boolean;
    stops           : any; //string[], schedule_legs_iris
    // initialDepartAirport: string;
    // finalArriveAirport  : string;
    aircraftType    : string;
    aircraft        : string;
    seatConfiguration?: object;
    inventory       : any;
    pnlDistribution? : string;
    isActive        : boolean;
    isCancelled     : boolean;
    fare            : string;

    bookings : string[];
    flightLegs: FlightLeg[];
    crew : Crew;
    summary : Summary;

    /**
     * Constructor
     *
     * @param flight
     */
    constructor(flight?:any)
    {
        flight         = flight || {};
        this.iri            = flight["@id"] || null;
        this.iriType        = flight["@type"] || null;
        this.id             = flight.id || null;
        this.flightNumber   = flight.flight_number || null;
        this.departAirport  = flight.depart_airport || null;
        this.arriveAirport  = flight.arrive_airport || null;
        this.airline        = flight.airline || null;
        this.departDate     = moment(flight.depart_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.arriveDate     = moment(flight.arrive_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.departDay      = moment(flight.depart_date, 'YYYY-MM-DD\THH:mm:ssP').format('ddd') || null;
        this.arriveDay      = moment(flight.arrive_date, 'YYYY-MM-DD\THH:mm:ssP').format('ddd') || null;
        this.etd            = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.eta            = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.localEtd       = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.localEta       = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.boardingGate        =  flight.boarding_gate || null;
        this.type           = flight.type || null;
        this.hasStop        = flight.hasStop || false;
        this.stops          = flight.stops || [];
        // this.initialDepartAirport= flight.schedule.initial_depart_airport || null;
        // this.finalArriveAirport = flight.schedule.final_arrive_airport || null;
        this.aircraftType   = flight.schedule.aircraft_type || null; 
        this.aircraft       = flight.schedule.aircraft || null; 

        this.isActive       = flight.is_active || false;
        this.isCancelled       = flight.is_cancelled || false;
        this.fare       = flight.fare || null;
        this.bookings = flight.booking_legs || [];
        this.flightLegs = flight.flight_legs ? flight.flight_legs.map((legs:any) => new FlightLeg(legs)) : [];
        this.crew = new Crew(flight.crew || {});
        this.summary = new Summary(flight.summary || {});

    }
}


export class Manifest
{
    iri     : string;
    iriType : string;
    id      : number;
    // name: string;
    airline         : Airline;
    flightNumber    : string;
    departAirport   : string;
    arriveAirport   : string;
    departDate       : string|null;
    arriveDate       : string|null;
    departDay       : string|null;
    arriveDay       : string|null;
    etd             : string|null;
    eta             : string|null;
    localEtd        : string|null;
    localEta        : string|null;
    boardingGate    : string;
    // daysCrossover   : string;
    type            : string;
    hasStop         : boolean;
    stops           : any; //string[], schedule_legs_iris
    // initialDepartAirport: string;
    // finalArriveAirport  : string;
    aircraftType    : string;
    aircraft        : string;
    seatConfiguration?: object;
    inventory       : any;
    pnlDistribution ?: string;
    isActive        : boolean;
    isCancelled     : boolean;
    fare            : string;

    bookings : Booking[];
    flightLegs: FlightLeg[];
    crew : Crew;
    summary : Summary;

    /**
     * Constructor
     *
     * @param flight
     */
    constructor(flight?:any)
    {
        flight         = flight || {};
        this.iri            = flight["@id"] || null;
        this.iriType        = flight["@type"] || null;
        this.id             = flight.id || null;
        this.flightNumber   = flight.flight_number || null;
        this.departAirport  = flight.depart_airport || null;
        this.arriveAirport  = flight.arrive_airport || null;
        this.airline        = flight.airline || null;
        this.departDate     = moment(flight.depart_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.arriveDate     = moment(flight.arrive_date, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.departDay      = moment(flight.depart_date, 'YYYY-MM-DD\THH:mm:ssP').format('ddd') || null;
        this.arriveDay      = moment(flight.arrive_date, 'YYYY-MM-DD\THH:mm:ssP').format('ddd') || null;
        this.etd            = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.eta            = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.localEtd       = moment(flight.etd, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.localEta       = moment(flight.eta, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.boardingGate        =  flight.boarding_gate || null;
        this.type           = flight.type || null;
        this.hasStop        = flight.hasStop || false;
        this.stops          = flight.stops || [];
        // this.initialDepartAirport= flight.schedule.initial_depart_airport || null;
        // this.finalArriveAirport = flight.schedule.final_arrive_airport || null;
        this.aircraftType   = flight.schedule.aircraft_type || null; 
        this.aircraft       = flight.aircraft || null; 

        this.isActive       = flight.is_active || false;
        this.isCancelled       = flight.is_cancelled || false;
        this.fare       = flight.fare || null;
        this.bookings = flight.booking_legs ? flight.booking_legs.map((bookingLeg:any) => new Booking(bookingLeg)) : [];
        this.flightLegs = flight.flight_legs ? flight.flight_legs.map((legs:any) => new FlightLeg(legs)) : [];
        this.crew = new Crew(flight.crew || {});
        this.summary = new Summary(flight.summary || {});

    }
}

export class FlightLeg
{
    iri    : string;
    // iriType: string;
    id     : number;
    reservedSeats : any;
    // flight: string;
    // passenger: string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.iri = manifest['@id'] || null;
        this.reservedSeats = manifest.reserved_seats ? manifest.reserved_seats.map((seat:any) => {return new ReservedSeat(seat)}) : [];
        // this.flight = manifest.flight || null;
        // this.schedule_leg = manifest.schedule_leg || null;
    }
}

export class Booking
{
    iri            : string;
    // iriType        : string;
    id             : number;

    cabinClass      : string;
    fare            : string;
    bookingLegFare  : string;
    isStopFare      : boolean;
    isCheckedIn     : boolean;
    isBoarded       : boolean;
    isNoShow        : boolean;
    isDeleted       : boolean;
    isWaitlisted    : boolean;
    isTicketed      : boolean;
    isCancelled     : boolean;
    isOpen          : boolean;
    bookingLegStops : string[];
    charges         : string[];
    coupons         : Coupon[];

    bookingId      : number;
    bookingIri     : string;
    // checkinId      : number;
    // checkinIri     : string;
    recordLocator  : string;
    // origin         : string;
    // destination    : string;
    // baggagePcs     : number;
    // baggageWeight  : number;
    phone           : string; 
    email           : string;
    status          : string;
    date            : string; 
    effectiveDate   : string;
    expireAt        : string;
    bookingAgent    : string;
    groupName       : string;
    isGroup         : boolean;
    bookingIsCancelled: boolean;
    // waitlist        : any;
    // bookingLegs     : string[];
    amountPaid      : number;
    amountDue       : number;
    amountPending   : number;
    // remarks         : any[];
    // payments        : any[];
    // ssrs            : any[];

    // bookingHistory  : any[];
    passengers      : Passenger[];

    /**
     * Constructor
     *
     * @param bookingLeg
     */
    constructor(bookingLeg?:any)
    {
        bookingLeg = bookingLeg || {};
        this.id = bookingLeg.id || null;
        this.iri = bookingLeg['@id'] || null;
        //bookingLeg
        this.cabinClass     = bookingLeg.cabin_class || null;
        this.fare           = bookingLeg.fare || null;
        this.bookingLegFare = bookingLeg.booking_leg_fare || null;
        this.isStopFare     = bookingLeg.is_stop_fare || false;
        this.isCheckedIn    = bookingLeg.is_checked_in || false;
        this.isBoarded      = bookingLeg.is_boarded || false;
        this.isNoShow       = bookingLeg.is_no_show || false;
        this.isDeleted      = bookingLeg.is_deleted || false;
        this.isWaitlisted   = bookingLeg.is_waitlisted || false;
        this.isTicketed     = bookingLeg.is_ticketed || false;
        this.isCancelled    = bookingLeg.is_cancelled || false;
        this.isOpen         = bookingLeg.is_open || false;
        
        this.bookingLegStops= bookingLeg.booking_leg_stops || [];
        this.charges        = bookingLeg.charges || [];
        this.coupons        = bookingLeg.coupons ? bookingLeg.coupons.map((coupon:any) => new Coupon(coupon)) : [];
        
        //booking
        this.bookingId      = bookingLeg.booking.id || null;
        this.bookingIri     = bookingLeg.booking['@id'] || null;
        this.recordLocator  = bookingLeg.booking.record_locator || null;
        this.date           = bookingLeg.booking.date || "2021-08-04T13:59:08.488Z";
        this.effectiveDate  = bookingLeg.booking.effective_date || "2021-08-04T13:59:08.488Z";
        this.expireAt       = bookingLeg.booking.expire_at || "2021-08-04T13:59:08.488Z";
        this.phone          = bookingLeg.booking.phone || null;
        this.email          = bookingLeg.booking.email || null;
        this.isGroup        = bookingLeg.booking.is_group || false;
        this.groupName      = bookingLeg.booking.group_name || null;
        this.status         = bookingLeg.booking.status || null;
        this.bookingIsCancelled= bookingLeg.booking.is_cancelled || false;
        this.bookingAgent   = bookingLeg.booking.booking_agent || null;
        // this.waitlist       = bookingLeg.booking.waitlist || null;
        this.amountPaid     = bookingLeg.booking.amount_paid || 0;
        this.amountDue      = bookingLeg.booking.amount_due || 0;
        this.amountPending  = bookingLeg.booking.amount_pending || 0;
        // this.remarks        = bookingLeg.booking.remarks || [];
        // this.payments       = bookingLeg.booking.payments || [];
        // this.bookingHistory = bookingLeg.booking.booking_history || [];
        this.passengers    = bookingLeg.booking.passengers ? bookingLeg.booking.passengers.map((pax:any) => new Passenger(pax)) : [];
    }
}

export class Passenger
{
    iri             : string;
    // iriType         : string;
    id              : number;
    title           : string;
    firstName       : string;
    lastName        : string;
    fullName        : string;
    phone           : string; 
    address         : string; 
    gender          : string;
    dateOfBirth     : string|null;
    passengerType   : PassengerType;
    email           : string;
    status          : string;
    ticketNumber    : string;
    coupons         : string[];
    ffp             : string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.iri = manifest['@id'] || null;
        this.title        = manifest.title || null;
        this.firstName    = manifest.first_name || null;
        this.lastName     = manifest.last_name || null;
        this.fullName     = upperCase(`${manifest.last_name}/${manifest.first_name}${manifest.title}`) || null;
        this.address      = manifest.address || null;
        this.gender       = manifest.gender || null;
        this.passengerType= new PassengerType(manifest.passengerType) || null;
        this.phone        = manifest.phone || null;
        this.dateOfBirth  = moment(manifest.date_of_birth, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.email        = manifest.email || null;
        this.status       = manifest.status || null;
        this.ticketNumber = manifest.ticket_number || null;
        this.coupons      = manifest.coupons || []
        this.ffp          = manifest.ffp || []
    }
}

export class Coupon
{
    iri    : string;
    // iriType: string;
    id     : number;
    // coupon: string;
    amount: number;
    currency: string;
    passenger: Passenger;
    checkIn: Checkin;
    reservedSeats: ReservedSeat[];
    reservedSeatName: string;
    ssrs: SSR[];
    status: string;
    isHeldConfirmed: boolean;
    isTicketed: boolean;
    isSeatSelected: boolean;
    isWaitlisted: boolean;
    isTimeChanged: boolean;
    ticket: Ticket;
    bookedProducts: string[];
    expireAt: "2021-08-04T13:59:08.488Z";
    // seat            : string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.iri = manifest['@id'] || null;
        this.amount = manifest.amount || 0;
        this.currency = manifest.currency || null;
        this.passenger = new Passenger(manifest.passenger) || new Passenger({});
        this.checkIn = new Checkin(manifest.check_in) || new Checkin({});
        this.reservedSeatName = manifest.reserved_seat_name || null;
        this.status = manifest.status || null;
        this.isHeldConfirmed = manifest.is_held_confirmed || false;
        this.isTicketed = manifest.is_ticketed || false;
        this.isSeatSelected = manifest.is_seat_selected || false;
        this.isWaitlisted = manifest.is_waitlisted || false;
        this.isTimeChanged = manifest.is_time_changed || false;
        this.ticket = new Ticket(manifest.ticket) || new Ticket({});
        this.bookedProducts = manifest.booked_products || [];
        this.expireAt = manifest.expire_at || "2021-08-04T13:59:08.488Z";
        this.reservedSeats= manifest.reserved_seats ? manifest.reserved_seats.map((seat:any) => {return new ReservedSeat(seat)}) : [];
        this.ssrs= manifest.ssrs ? manifest.ssrs.map((ssr:any) => {return new SSR(ssr)}) : [];
    }
}

export class Ticket
{
    iri       : string;
    // iriType   : string;
    id        : number;
    ticketNumber: string;
    status    : boolean;
    seatRow   : string;
    seatColumn: string;
    payments  : string[];

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest  = manifest || {};
        this.id   = manifest.id || null;
        this.iri  = manifest['@id'] || null;
        this.ticketNumber = manifest.ticket_number || null;
        this.status     = manifest.status || false;
        this.seatRow    = manifest.seat_row || null;
        this.seatColumn = manifest.seat_column || null;
        this.payments   = manifest.payments || [];
    }
}

export class Checkin
{
    iri     : string;
    // iriType : string;
    id      : number;
    time    : string;
    baggageWeight : number;
    baggageCount  : number;
    airport : string;
    baggageStatus : boolean;
    agent   : string;
    baggages: Baggage[];
    bpPrintCount  : number;
    coupons : string[];

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest      = manifest || {};
        this.id       = manifest.id || null;
        this.iri      = manifest['@id'] || null;
        this.time     = manifest.time || "2021-08-04T13:59:08.488Z";
        this.baggageWeight= manifest.baggage_weight || 0;
        this.baggageCount = manifest.baggage_count || 0;
        this.airport  = manifest.airport || null;
        this.baggageStatus= manifest.baggage_status || false;
        this.agent    = manifest.agent || null;
        this.baggages = manifest.baggages ? manifest.baggages.map((baggage:any) => {return new Baggage(baggage)}) : [];
        this.bpPrintCount = manifest.bp_print_count || 0;
        this.coupons  = manifest.coupons || [];
    }
}

export class SSR
{
    iri       : string;
    // iriType   : string;
    id        : number;
    code      : string;
    description: string;
    isActive  : true;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.iri = manifest['@id'] || null;
        this.code = manifest.code || null;
        this.description = manifest.description || null;
        this.isActive = manifest.isActive || false;
    }
}

export class Baggage
{
    iri    : string;
    // iriType: string;
    id     : number;
    barcode: string;
    status: string;
    location: string;
    weight: number;
    description: string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest    = manifest || {};
        this.id     = manifest.id || null;
        this.iri    = manifest['@id'] || null;
        this.barcode= manifest.status || null;
        this.status = manifest.status || null;
        this.location= manifest.location || null;
        this.weight = manifest.weight || 0;
        this.description = manifest.description;
    }
}

export class ReservedSeat
{
    iri    : string;
    // iriType: string;
    id     : number;
    seat   : Seat|null;
    seatIri : string;
    flightLeg: string;
    // coupon: string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.iri = manifest['@id'] || null;
        this.seat = manifest.seat ? new Seat(manifest.seat) : null;
        this.seatIri = manifest.seat ? manifest.seat['@id'] : null;
        this.flightLeg = manifest.flight_leg || null;
        // this.coupon = manifest.coupon || null;
    }
}

export class Crew
{
    // iri    : string;
    // iriType: string;
    id     : number;
    captain: string;
    firstOfficer: string;
    fltObs : string;
    flightAttendantGroup: string;
    other:   string;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        manifest = manifest || {};
        this.id = manifest.id || null;
        this.captain = manifest.captain || null;
        this.firstOfficer = manifest.first_officer || null;
        this.fltObs = manifest.flt_obs || null;
        this.flightAttendantGroup = manifest.flight_attendant_group || null;
        this.other = manifest.other || null;
    }
}

export class Summary
{
    
    cargo   : CargoSummary;
    baggage : BaggageSummary;
    pax     : PaxSummary;

    /**
     * Constructor
     *
     * @param manifest
     */
    constructor(manifest?:any)
    {
        this.cargo = new CargoSummary(manifest.cargo_summary || {});
        this.baggage = new BaggageSummary(manifest.baggage_summary || {});
        this.pax = new PaxSummary(manifest.pax_summary || {});
    }
}

    export class CargoSummary
    {
        
        totalPcs       : number;
        totalWeight    : number;
        

        /**
         * Constructor
         *
         * @param manifest
         */
        constructor(manifest?:any)
        {
            this.totalPcs = manifest.total_accepted || 0;
            this.totalWeight = manifest.total_weight || 0;
        }
    }

    export class BaggageSummary
    {
        totalWeight: number;
        totalPcs   : number;
        

        /**
         * Constructor
         *
         * @param manifest
         */
        constructor(manifest?:any)
        {
            this.totalWeight = manifest.total_weight || 0;
            this.totalPcs    = manifest.total_pcs || 0;
        }
    }

    export class PaxSummary
    {
        
        totalWeight  : number;
        totalCount   : number;
        maleCount    : number;
        femaleCount  : number;
        childCount   : number;
        infantCount  : number;
        fCount       : number;
        cCount       : number;
        yCount       : number;
        checkedIn    : any;
        waitlisted   : any;
        boarded      : any;
        ticketed     : any;

        /**
         * Constructor
         *
         * @param manifest
         */
        constructor(manifest?:any)
        {
            this.totalWeight = manifest.total_weight || 0;
            this.totalCount = manifest.total_count || 0;
            this.maleCount = manifest.male_count || 0;
            this.femaleCount = manifest.female_count || 0;
            this.childCount = manifest.child_count || 0;
            this.infantCount = manifest.infant_count || 0;
            this.fCount = manifest.f_count || 0;
            this.cCount = manifest.c_count || 0;
            this.yCount = manifest.y_count || 0;
            this.checkedIn = manifest.checked_in || {};
            this.waitlisted = manifest.waitlisted || {};
            this.boarded = manifest.boarded || {};
            this.ticketed = manifest.ticketed || {};
        }
    }

export class PNR
{
    iri            : string;
    // iriType        : string;
    id             : number;
    paxIri         : string;
    // paxId          : number;
    firstName      : string;
    lastName       : string;
    fullName       : string;
    recordLocator  : string;
    origin         : string;
    destination    : string;
    baggagePcs     : number;
    baggageWeight  : number;

    phone           : string; 
    address         : string; 
    gender          : string;
    dateOfBirth     : string|null;
    email           : string;
    isGroup         : boolean;
    bookingClass    : string;
    serviceClass    : string;
    status          : string;
    description     : string;
    ticketNo        : string;
    seat            : string;
    bookingSource   : string;
    ssrs            : any[];
    remarks         : any[];

    isCheckedIn     : boolean;
    isBoarded       : boolean;
    isNoShow        : boolean;
    isDeleted       : boolean;
    isWaitlisted    : boolean;
    isTicketed      : boolean;
    isCancelled     : boolean;
    isOpen          : boolean;

    waitlist        : any;
    checkIn         : any;

    // checkIns        : any[]
    amountPaid      : number;
    amountDue       : number;
    amountPending   : number;
    charges         : any[];
    bookingHistory  : any;

    /**
     * Constructor
     *
     * @param booking
     */
    constructor(booking?:any)
    {
        booking             = booking || {};
        this.id             = booking.id || null;
        this.iri            = booking.iri || null;
        this.paxIri         = booking.passenger
        this.firstName      = booking.first_name || null;
        this.lastName       = booking.last_name || null;
        this.fullName       = upperCase(`${booking.last_name}/${booking.first_name}${booking.title}`) || null;
        this.recordLocator  = booking.record_locator || null;
        this.origin         = booking.origin || null;
        this.destination    = booking.destination || null;
        this.baggagePcs     = booking.baggage_pcs || null;
        this.baggageWeight  = booking.baggage_weight || null;
        this.address        = booking.address || null;
        this.gender         = booking.gender || null;
        this.phone          = booking.phone || null;
        this.dateOfBirth    = moment(booking.date_of_birth, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD') || null;
        this.email          = booking.email || null;
        this.isGroup        = booking.is_group || null;
        this.bookingClass   = booking.booking_class || null;
        this.serviceClass   = booking.service_class || null;
        this.status         = booking.status || null;
        this.description    = booking.description || null;
        this.ticketNo       = booking.ticket_no || null;
        this.seat           = booking.seat || null;
        this.bookingSource  = booking.booking_source || null;

        this.isCheckedIn     = booking.isCheckedIn || false;
        this.isBoarded       = booking.isBoarded || false;
        this.isNoShow        = booking.isNoShow || false;
        this.isDeleted       = booking.isDeleted || false;
        this.isWaitlisted    = booking.isWaitlisted || false;
        this.isTicketed      = booking.isTicketed || false;
        this.isCancelled     = booking.isCancelled || false;
        this.isOpen          = booking.isOpen || false;

        this.waitlist        = booking.waitlist || null;
        this.checkIn         = booking.checked_in || null;

        this.amountPaid    = booking.amount_paid || 0;
        this.amountDue     = booking.amount_due || 0;
        this.amountPending = booking.amount_pending || 0;

        this.ssrs           = booking.ssrs || [];
        this.remarks        = booking.remarks || [];
        this.charges        = booking.charges || [];
        // this.checkIns       = booking.check_ins || [];

        this.bookingHistory = booking.booking_history || [];
    }
}


///////////////////////////////////////////////////////////---------------------///////////////////////////
/*
{
    "id": 0,
    "flight_number": "string",
    "schedule": {
      "id": 0,
      "name": "string",
      "flight_number": "string",
      "airline": "string",
      "aircraft": "string"
    },
    "depart_airport": {
      "id": 0,
      "code": "string",
      "icao": "string",
      "name": "string",
      "state": "string",
      "city": "string",
      "hide_on_web": true,
      "web_check_in": true
    },
    "arrive_airport": {
      "id": 0,
      "code": "string",
      "icao": "string",
      "name": "string",
      "state": "string",
      "city": "string",
      "hide_on_web": true,
      "web_check_in": true
    },
    "depart_date": "2021-08-04T13:59:08.488Z",
    "arrive_date": "2021-08-04T13:59:08.488Z",
    "depart_day": "2021-08-04T13:59:08.488Z",
    "arrive_day": "2021-08-04T13:59:08.488Z",
    "etd": "2021-08-04T13:59:08.488Z",
    "eta": "2021-08-04T13:59:08.488Z",
    "type": "string",
    "has_stop": true,
    "stops": [
      "string"
    ],
    "stop_legs": [
      {
        "id": 0,
        "sn": 0,
        "depart_airport": {
          "id": 0,
          "code": "string",
          "icao": "string",
          "name": "string",
          "state": "string",
          "city": "string",
          "hide_on_web": true,
          "web_check_in": true
        },
        "arrive_airport": {
          "id": 0,
          "code": "string",
          "icao": "string",
          "name": "string",
          "state": "string",
          "city": "string",
          "hide_on_web": true,
          "web_check_in": true
        },
        "price": 0,
        "tax": 0,
        "discount": 0,
        "cost": 0,
        "available_seats": 0
      }
    ],
    "is_active": true,
    "booking_legs": [
      {
        "id": 0,
        "fare": "string",
        "is_checked_in": true,
        "charges": [
          "string"
        ],
        "is_boarded": true,
        "is_no_show": true,
        "is_deleted": true,
        "booking": {
          "id": 0,
          "date": "2021-08-04T13:59:08.488Z",
          "effective_date": "2021-08-04T13:59:08.488Z",
          "status": "string",
          "is_group": true,
          "booking_legs": [
            null
          ],
          "email": "string",
          "phone": "string",
          "passengers": [
            {
              "id": 0,
              "title": "string",
              "first_name": "string",
              "last_name": "string",
              "phone": "string",
              "address": "string",
              "gender": "string",
              "date_of_birth": "2021-08-04T13:59:08.488Z",
              "email": "string",
              "ticket_number": "string",
              "passenger_type": {
                "id": 0,
                "code": "string",
                "name": "string",
                "description": "string"
              },
              "ffp": "string",
              "coupons": [
                null
              ]
            }
          ],
          "record_locator": "string",
          "group_name": "string",
          "booking_agent": "string",
          "is_cancelled": true,
          "amount_paid": 0,
          "amount_due": 0,
          "amount_pending": 0,
          "expire_at": "2021-08-04T13:59:08.488Z"
        },
        "booking_leg_stops": [
          "string"
        ],
        "is_cancelled": true,
        "is_open": true,
        "is_waitlisted": true,
        "is_ticketed": true,
        "cabin_class": "string",
        "booking_leg_fare": "string",
        "is_stop_fare": true,
        "coupons": [
          {
            "id": 0,
            "amount": 0,
            "currency": "string",
            "passenger": {
              "id": 0,
              "title": "string",
              "first_name": "string",
              "last_name": "string",
              "phone": "string",
              "address": "string",
              "gender": "string",
              "date_of_birth": "2021-08-04T13:59:08.488Z",
              "email": "string",
              "ticket_number": "string",
              "passenger_type": {
                "id": 0,
                "code": "string",
                "name": "string",
                "description": "string"
              },
              "ffp": "string",
              "coupons": [
                null
              ]
            },
            "check_in": {
              "id": 0,
              "time": "2021-08-04T13:59:08.488Z",
              "baggage_weight": 0,
              "baggage_count": 0,
              "airport": "string",
              "baggage_status": true,
              "agent": "string",
              "baggages": [
                {
                  "id": 0,
                  "barcode": "string",
                  "status": "string",
                  "location": "string",
                  "weight": 0,
                  "description": "string"
                }
              ],
              "bp_print_count": 0,
              "coupons": [
                null
              ]
            },
            "reserved_seats": [
              {
                "id": 0,
                "seat": {
                  "id": 0,
                  "seat_row": 0,
                  "seat_column": "string",
                  "is_blocked": true
                }
              }
            ],
            "reserved_seat_name": "string",
            "ssrs": [
              {
                "id": 0,
                "code": "string",
                "description": "string",
                "is_active": true
              }
            ],
            "status": "string",
            "is_held_confirmed": true,
            "is_ticketed": true,
            "is_seat_selected": true,
            "is_waitlisted": true,
            "is_time_changed": true,
            "ticket": {
              "id": 0,
              "ticket_no": "string",
              "status": true,
              "seat_row": "string",
              "seat_column": "string",
              "payments": [
                "string"
              ]
            },
            "booked_products": [
              "string"
            ],
            "expire_at": "2021-08-04T13:59:08.488Z"
          }
        ]
      }
    ],
    "boarding_gate": "string",
    "flight_legs": [
      {
        "id": 0,
        "avs": 0,
        "schedule_leg": {
          "id": 0,
          "sn": 0,
          "depart_airport": {
            "id": 0,
            "code": "string",
            "icao": "string",
            "name": "string",
            "state": "string",
            "city": "string",
            "hide_on_web": true,
            "web_check_in": true
          },
          "arrive_airport": {
            "id": 0,
            "code": "string",
            "icao": "string",
            "name": "string",
            "state": "string",
            "city": "string",
            "hide_on_web": true,
            "web_check_in": true
          },
          "price": 0,
          "tax": 0,
          "discount": 0,
          "cost": 0,
          "available_seats": 0
        },
        "reserved_seats": [
          {
            "id": 0,
            "seat": {
              "id": 0,
              "seat_row": 0,
              "seat_column": "string",
              "is_blocked": true
            }
          }
        ],
        "blocked_seats": [
          {
            "id": 0,
            "seat_column": "string",
            "seat_row": "string",
            "seat_name": "string"
          }
        ]
      }
    ],
    "fare": "string",
    "aircraft": "string",
    "summary": [
      "string"
    ],
    "is_cancelled": true
  }
  */