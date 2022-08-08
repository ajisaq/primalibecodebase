import { Tax } from "./tax.model";
import { CabinClass } from './cabin-class.model';
import * as moment from 'moment';
import { Airport } from './airports.model';
import { Airline } from './airline.model';
import { Currency } from "./currency.model";

export class Fare {
    iri: string;
    iriType: string;
    id: number;
    title: string;
    airline: Airline;
    // bookingClass: string;
    code: string;
    // basis: string;
    refundable: boolean;
    // cabinClass: CabinClass;
    validity: Validity;
    bookingBlackouts: Blackout[];
    flightBlackouts: Blackout[];
    legFares: LegFare[];
    // salesChannel: SalesChannel;
    saleLocations: string[];
    // passengerTypeDiscount: boolean;
    // enableCommission: boolean;
    salesRestriction: SalesRestriction;
    discounts: Discount[];
    commissions: Commission[];
    fareDbrs: FareDbr[];
    // fareBaggages: FareBaggage[];
    isActive: boolean;
    currency: Currency;
    schedules: string[];//Schedule

    /**
     * Constructor
     *
     * @param fare
     */
    constructor(fare?:any) {

        let iri = typeof fare ==="string" ? fare : null;
        let id  = typeof fare ==="number" ? fare : null;
        
        fare = fare || {};
        this.iri = iri? iri:fare["@id"];
        this.iriType = fare["@type"] || null;
        this.id = id? id:fare.id; // FuseUtils.generateGUID();
        this.title = fare.title || null;
        this.airline = new Airline(fare.airline || {});
        // this.bookingClass = fare.booking_class || null;
        this.code = fare.code || null;
        // this.basis = fare.basis || null;
        this.refundable = fare.refundable || false;
        // this.cabinClass = new CabinClass(fare.cabin_class || {});
        this.validity = new Validity(fare.validity || {});
        // this.salesChannel = new SalesChannel(fare.sales_channel || {});
        this.saleLocations = fare.saleLocations || [];
        this.salesRestriction = new SalesRestriction(fare.sales_restriction || {});
        this.bookingBlackouts = fare.booking_blackouts? fare.booking_blackouts.map((blackout:any) => new Blackout(blackout)): [];
        this.flightBlackouts = fare.flight_blackouts? fare.flight_blackouts.map((blackout:any) => new Blackout(blackout)): [];
        this.legFares = fare.leg_fares? fare.leg_fares.map((legFare:any) => new LegFare(legFare)): [];
        this.discounts = fare.discounts? fare.discounts.map((discount:any) => new Discount(discount)): [];
        this.commissions = fare.commissions? fare.commissions.map((commission:any) => new Commission(commission)): [];
        this.fareDbrs = fare.fare_dbrs? fare.fare_dbrs.map((fareDbr:any) => new FareDbr(fareDbr)): [];
        // this.fareBaggages = fare.fare_baggages? fare.fare_baggages.map((fareBaggage) => new FareBaggage(fareBaggage)): [];
        this.isActive = fare.is_active || false;
        this.currency = new Currency(fare.currency || {});
        this.schedules = fare.schedules || [];

    }
}

export class FareDetail {
    iri: string;
    id: number;
    title: string;
    airline: string;
    bookingClass: object;
    code: string;
    basis: string;

    /**
     * Constructor
     *
     * @param fareDetail
     */
    constructor(fareDetail?:any) {
        let iri = typeof fareDetail ==="string" ? fareDetail : null;
        let id  = typeof fareDetail ==="number" ? fareDetail : null;
        
        fareDetail = fareDetail || {};
        this.iri = iri? iri:fareDetail["@id"];
        this.id = id? id:fareDetail.id; // FuseUtils.generateGUID();
        this.title = fareDetail.title || null;
        this.airline = fareDetail.airline || null;
        this.bookingClass = fareDetail.booking_class || null;
        this.code = fareDetail.code || null;
        this.basis = fareDetail.basis || null;
    }
}

export class Validity {
    iri: string;
    id: number;
    fare: string;
    notValidBeforeDay: number;
    notValidAfterDay: number;
    ticketExpire: string;
    advancePurchase: number;
    nightStayMax: number;
    nightStayMin: number;
    // weekdaysOut        : string;
    // weekdaysBack       : string;
    dom: boolean; //[weekendout ? weekdaysout.slice(0,1) : null],
    dot: boolean; //[weekendout ? weekdaysout.slice(1,2) : null ],
    dow: boolean;
    doth: boolean;
    dof: boolean;
    dos: boolean;
    dosu: boolean;
    // weekdaysBack       : [weekdaysback],
    dbm: boolean;
    dbt: boolean;
    dbw: boolean;
    dbth: boolean;
    dbf: boolean;
    dbs: boolean;
    dbsu: boolean;
    outBefore: string|null;
    outAfter: string|null;
    backBefore: string|null;
    backAfter: string|null;
    flightStartDate: string;
    flightEndDate: string;
    bookStartDate: string;
    bookEndDate: string;

    /**
     * Constructor
     *
     * @param validity
     */
    constructor(validity?:any) {
        let iri = typeof validity ==="string" ? validity : null;
        let id  = typeof validity ==="number" ? validity : null;
        
        validity = validity || {};
        this.iri = iri? iri:validity["@id"];
        this.id = id? id:validity.id; // FuseUtils.generateGUID();
        this.fare = validity.fare || null;
        this.notValidAfterDay = validity.not_valid_after_day || null;
        this.notValidBeforeDay = validity.not_valid_before_day || null;
        this.ticketExpire = validity.ticket_expire || null;
        this.advancePurchase = validity.advance_purchase || null;
        this.nightStayMax = validity.night_stay_max || null;
        this.nightStayMin = validity.night_stay_min || null;
        // this.weekdaysOut = validity.weekdays_out || null;
        // this.weekdaysBack = validity.weekdays_back || null;
        this.dom = validity.dom || false;
        this.dot = validity.dot || false;
        this.dow = validity.dow || false;
        this.doth = validity.doth || false;
        this.dof = validity.dof || false;
        this.dos = validity.dos || false;
        this.dosu = validity.dosu || false;
        this.dbm = validity.dbm || false;
        this.dbt = validity.dbt || false;
        this.dbw = validity.dbw || false;
        this.dbth = validity.dbth || false;
        this.dbf = validity.dbf || false;
        this.dbs = validity.dbs || false;
        this.dbsu = validity.dbsu || false;
        this.outBefore = moment(validity.out_before, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.outAfter = moment(validity.out_after, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.backBefore = moment(validity.back_before, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.backAfter = moment(validity.back_after, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm') || null;
        this.flightStartDate = validity.flight_start_date || null;
        this.flightEndDate = validity.flight_end_date || null;
        this.bookStartDate = validity.book_start_date || null;
        this.bookEndDate = validity.book_end_date || null;
    }
}

export class LegFare {
    iri: string;
    id: number;
    // arrive: string;
    // depart: string;
    arriveAirport: Airport;
    departAirport: Airport;
    price: number;
    isStop: boolean;
    fare: string;
    taxes: Tax[];

    /**
     * Constructor
     *
     * @param legFare
     */
    constructor(legFare?:any) {
        let iri = typeof legFare ==="string" ? legFare : null;
        let id  = typeof legFare ==="number" ? legFare : null;
        
        legFare = legFare || {};
        this.iri = iri? iri:legFare["@id"];
        this.id = id? id:legFare.id; // FuseUtils.generateGUID();
        // this.arrive = legFare.arrive || null;
        // this.depart = legFare.depart || null;
        this.arriveAirport = new Airport(legFare.arrive_airport || {});
        this.departAirport = new Airport(legFare.depart_airport || {});
        this.price = legFare.price || 0;
        this.isStop = legFare.is_stop || false;
        this.fare = legFare.fare || null;
        this.taxes = legFare.taxes ? legFare.taxes.map((tax:any)=>new Tax(tax || {})) : [];
    }
}

export class SalesRestriction {
    iri: string;
    id: number;
    fare: string;
    // country: string;
    // flightNo: string;
    // ipAddress: string;

    /**
     * Constructor
     *
     * @param salesRestriction
     */
    constructor(salesRestriction?:any) {
        let iri = typeof salesRestriction ==="string" ? salesRestriction : null;
        let id  = typeof salesRestriction ==="number" ? salesRestriction : null;
        
        salesRestriction = salesRestriction || {};
        this.iri = iri? iri:salesRestriction["@id"];
        this.id = id? id:salesRestriction.id; // FuseUtils.generateGUID();
        this.fare = salesRestriction.fare || null;
        // this.country = salesRestriction.country || null;
        // this.flightNo = salesRestriction.flight_no || null;
        // this.ipAddress = salesRestriction.ip_address || null;
    }
}

export class SalesChannel {
    iri: string;
    id: number;
    fare: string;
    fg: boolean;
    fl: boolean;
    fd: boolean;
    interline: boolean;
    codeShare: boolean;
    salesOffice: boolean;
    outOfService: boolean;

    /**
     * Constructor
     *
     * @param salesChannel
     */
    constructor(salesChannel?:any) {
        let iri = typeof salesChannel ==="string" ? salesChannel : null;
        let id  = typeof salesChannel ==="number" ? salesChannel : null;
        
        salesChannel = salesChannel || {};
        this.iri = iri? iri:salesChannel["@id"];
        this.id = id? id:salesChannel.id; // FuseUtils.generateGUID();
        this.fare = salesChannel.fare || null;
        this.fg = salesChannel.fg || false;
        this.fl = salesChannel.fl || false;
        this.fd = salesChannel.fd || false;
        this.interline = salesChannel.interline || false;
        this.codeShare = salesChannel.code_share || false;
        this.salesOffice = salesChannel.sales_office || false;
        this.outOfService = salesChannel.out_of_service || false;
    }
}

export class Blackout {
    iri: string;
    id: number;
    fare: string;
    startDate: string;
    endDate: string;
    name: string;
    // type            : string;

    /**
     * Constructor
     *
     * @param blackout
     */
    constructor(blackout?:any) {
        let iri = typeof blackout ==="string" ? blackout : null;
        let id  = typeof blackout ==="number" ? blackout : null;
        
        blackout = blackout || {};
        this.iri = iri? iri:blackout["@id"];
        this.id = id? id:blackout.id; // FuseUtils.generateGUID();
        this.fare = blackout.fare || null;
        this.startDate = blackout.start_date || null;
        this.endDate = blackout.end_date || null;
        this.name = blackout.name || null;
        // this.type = blackout.type || null;
    }
}

export class Discount {
    iri: string;
    id: number;
    fare: string;
    rate: number;
    passengerType: PassengerType;
    operator: Operator;

    /**
     * Constructor
     *
     * @param discount
     */
    constructor(discount?:any) {
        // console.log({discount})
        let iri = typeof discount ==="string" ? discount : null;
        let id  = typeof discount ==="number" ? discount : null;
        
        discount = discount || {};
        this.iri = iri? iri:discount["@id"];
        this.id = id? id:discount.id;
        this.fare = discount.fare || null;
        this.rate = discount.rate || 0;
        this.passengerType = new PassengerType(discount.passenger_type || {});
        this.operator = new Operator(discount.operator || {});
        // console.log('this.discount',this)
    }
}  

export class Commission {
    iri: string;
    id: number;
    fare: string;
    rate: number;
    passengerType: PassengerType;
    operator: Operator;

    /**
     * Constructor
     *
     * @param commission
     */
    constructor(commission?:any) {
        let iri = typeof commission ==="string" ? commission : null;
        let id  = typeof commission ==="number" ? commission : null;
        
        commission = commission || {};
        this.iri = iri? iri:commission["@id"];
        this.id = id? id:commission.id; // FuseUtils.generateGUID();
        this.fare = commission.fare || null;
        this.rate = commission.rate || 0;
        this.passengerType = new PassengerType(commission.passenger_type || {});
        this.operator = new Operator(commission.operator || {});
    }
}

export class PassengerType {
    iri: string;
    id: number;
    name: string;
    description: string;

    /**
     * Constructor
     *
     * @param passengerType
     */
    constructor(passengerType?:any) {
        let iri = typeof passengerType ==="string" ? passengerType : null;
        let id  = typeof passengerType ==="number" ? passengerType : null;
        
        // console.log(8888,passengerType,iri,id)
        passengerType = passengerType || {};
        this.iri = iri? iri:passengerType["@id"];
        this.id = id? id:passengerType.id;
        this.name = passengerType.name || null;
        this.description = passengerType.description || null;
    }
}

export class Operator {
    iri: string;
    id: number;
    name: string;
    description: string;
    sign: string;

    /**
     * Constructor
     *
     * @param operator
     */
    constructor(operator?:any) {
        // console.log({operator})
        let iri = typeof operator ==="string" ? operator : null;
        let id  = typeof operator ==="number" ? operator : null;
        
        operator = operator || {};
        this.iri = iri? iri:operator["@id"];
        this.id = id? id:operator.id;
        this.name = operator.name || null;
        this.description = operator.description || null;
        this.sign = operator.sign || null;
        // console.log('operator.this',iri,this)
    }
}


export class FareDbr {
    iri: string;
    id: number;
    dbr: string;
    fareDbrLegs: [any];

    /**
     * Constructor
     *
     * @param fareDbr
     */
    constructor(fareDbr?:any) {
        let iri = typeof fareDbr ==="string" ? fareDbr : null;
        let id  = typeof fareDbr ==="number" ? fareDbr : null;
        
        fareDbr = fareDbr || {};
        this.iri = iri? iri:fareDbr["@id"];
        this.id = id? id:fareDbr.id;
        this.dbr = fareDbr.dbr || null;
        this.fareDbrLegs = fareDbr.fare_dbr_legs
            ? fareDbr.fare_dbr_legs.map((fareDbrLeg:any) => new FareDbrLeg(fareDbrLeg))
            : [];
    }
}

export class FareDbrLeg {
    iri: string;
    id: number;
    fareDbr: FareDbr;
    arriveAirport: Airport;
    departAirport: Airport;
    price: number;
    isStop: boolean;
    // fare: string;
    taxes: Tax[];

    /**
     * Constructor
     *
     * @param fareDbrLeg
     */
    constructor(fareDbrLeg?:any) {
        let iri = typeof fareDbrLeg ==="string" ? fareDbrLeg : null;
        let id  = typeof fareDbrLeg ==="number" ? fareDbrLeg : null;
        
        fareDbrLeg = fareDbrLeg || {};
        this.iri = iri? iri:fareDbrLeg["@id"];
        this.id = id? id:fareDbrLeg.id; // FuseUtils.generateGUID();
        this.fareDbr = new FareDbr(fareDbrLeg.fareDbr || {});
        // this.arrive = fareDbrLeg.arrive || null;
        // this.depart = fareDbrLeg.depart || null;
        this.arriveAirport = new Airport(fareDbrLeg.arrive_airport || {});
        this.departAirport = new Airport(fareDbrLeg.depart_airport || {});
        this.price = fareDbrLeg.price || 0;
        this.isStop = fareDbrLeg.is_stop || false;
        // this.fare = fareDbrLeg.fare || null;
        this.taxes = fareDbrLeg.taxes ? fareDbrLeg.taxes.map((tax:any)=>new Tax(tax || {})) : [];
    }
}



export class FareBaggage {
    iri: string;
    id: number;
    fare: string;
    unit: string;
    piece: number;
    uncheckedWeight: number;
    adultAllowance: number;
    childAllowance: number;
    infantAllowance: number;
    cabinClass: CabinClass;

    /**
     * Constructor
     *
     * @param fareBaggage
     */
    constructor(fareBaggage?:any) {
        let iri = typeof fareBaggage ==="string" ? fareBaggage : null;
        let id  = typeof fareBaggage ==="number" ? fareBaggage : null;
        
        fareBaggage = fareBaggage || {};
        this.iri = iri? iri:fareBaggage["@id"];
        this.id = id? id:fareBaggage.id; // FuseUtils.generateGUID();
        this.fare = fareBaggage.fare || null;
        this.unit = fareBaggage.unit || null;
        this.piece = fareBaggage.piece || 0;
        this.uncheckedWeight = fareBaggage.unchecked_weight || 0;
        this.adultAllowance = fareBaggage.adult_allowance || 0;
        this.childAllowance = fareBaggage.child_allowance || 0;
        this.infantAllowance = fareBaggage.infant_allowance || 0;
        this.cabinClass = new CabinClass(fareBaggage.cabin_class || {});
    }
}