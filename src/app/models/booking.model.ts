import { Flight } from './flight.model';
import { Fare, FareDbrLeg } from './fare.model';
import { ScheduleLeg } from './schedule.model';
import { Currency } from './currency.model';
import { Agent } from './agent.model';
import { CabinClass } from './cabin-class.model';
import { PassengerType } from './passenger-type.model';

import * as moment from 'moment';
import { User } from './user.model';

export class Booking
{
    iri            : string;
    iriType        : string;
    id             : number;

    date    : string;
    effectiveDate   : string;
    status  : string|null = 'NEW';
    isGroup: boolean;
    // origin  : string;
    // destination: string;
    bookingLegs: BookingLeg[];
    email   : string;
    phone   : string;
    payments: Payment[];
    passengers: Passenger[];
    contacts: Passenger[];

    recordLocator: string;
    groupName   : string;
    bookingAgent: Agent;
    isCancelled : boolean;
    amountPaid  : number;
    amountDue   : number;
    amountPending: number;
    waitList    : string;
    bookingRemarks: any[]; //BookingRemark
    bookingHistories: any[]; //BookingHistory
    
    /**
     * Constructor
     *
     * @param booking
     */
    constructor(booking?: any)
    {

        let iri = typeof booking ==="string" ? booking : null;
        let id  = typeof booking ==="number" ? booking : null;
        
        booking = booking || {};
        this.iri = iri? iri:booking["@id"];
        this.iriType = booking["@type"] || null;
        this.id = booking.id || id;

        this.date = booking.date || null;
        this.effectiveDate = booking.effective_date || null;
        this.status = booking.status || id?null:'NEW';//'NEW';
        this.isGroup    = booking.is_group || false
        // this.origin = booking.origin || null;
        // this.destination = booking.destination || null;
        this.bookingLegs   = booking.booking_legs ? booking.booking_legs.map((bookingLeg:any) => new BookingLeg(bookingLeg)): [];
        this.email     = booking.email || null;
        this.phone      = booking.phone || null;
        this.payments     = booking.payments ? booking.payments.map((payment:any) => new Payment(payment)): [];
        this.passengers  = booking.passengers ? booking.passengers.map((passenger:any) => new Passenger(passenger)): [];
        this.contacts  = booking.contacts ? booking.contacts.map((contact:any) => new Contact(contact)): [];
        this.recordLocator    = booking.record_locator || null;
        this.groupName   = booking.group_name || null;
        this.bookingAgent        = new Agent(booking.booking_agent || {});
        this.isCancelled       = booking.is_cancelled || false;
        this.amountPaid     = booking.amount_paid || 0;
        this.amountDue      = booking.amount_due || 0;
        this.amountPending  = booking.amount_pending || 0;
        this.waitList       = booking.wait_list || null;
        this.bookingRemarks  = booking.remarks ? booking.remarks.map((bookingRemark:any) => new BookingRemark(bookingRemark)): [];
        this.bookingHistories  = booking.booking_histories ? booking.booking_histories.map((bookingHistory:any) => new BookingHistory(bookingHistory)): [];
    }

}


export class BookingLeg {
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    booking     : any; //Booking;
    flight      : any; //Flight;
    fare        : any; //Fare;
    fareDbrLeg  : any; //FareDbrLeg; //old legFare
    bookingLegStops: any[]; //ScheduleLeg[];
    charges     : any[]; //AppliedCharges[]
    isCheckedIn : boolean;
    isBoarded   : boolean;
    isNoShow    : boolean;
    isDeleted   : boolean;
    checkIn     : any; //CheckIn;
    isCancelled : boolean;
    isOpen      : boolean;
    isWaitlisted: boolean;
    isTicketed  : boolean;
    cabinClass  : any; //CabinClass; //not needed? already known in fareDbrLeg
    ssrs        : any[]; //string[];
    bookingLegFare: any; //BookingLegFare
    // bookingLegProducts: any[];//BookingLegProduct[]
    coupons     : Coupon[];
    expireAt     : any;

    /**
     * Constructor
     *
     * @param bookingLeg
     */
    constructor(bookingLeg?: any)
    {

        let iri = typeof bookingLeg ==="string" ? bookingLeg : null;
        let id  = typeof bookingLeg ==="number" ? bookingLeg : null;
        
        bookingLeg = bookingLeg || {};
        this.iri = iri? iri:bookingLeg["@id"];
        this.iriType = bookingLeg["@type"] || null;
        this.id = bookingLeg.id || id;
        
        this.booking    = bookingLeg.booking || {}; // new Booking(bookingLeg.booking);//needed?
        this.flight     = bookingLeg.flight || {}; // new Flight(bookingLeg.flight || {});
        this.fare       = bookingLeg.fare || {}; // new Fare(bookingLeg.fare || {});
        this.fareDbrLeg = bookingLeg.fare_dbr_leg || {}; // new FareDbrLeg(bookingLeg.fare_dbr_leg || {});
        this.bookingLegStops    = bookingLeg.booking_leg_stops || []; //bookingLeg.booking_leg_stops ? bookingLeg.booking_leg_stops.map((stop) => new ScheduleLeg(stop)): [];
        this.charges    = bookingLeg.charges || []; //charges.map
        this.expireAt   = new Date(bookingLeg.expire_at);
        this.isCheckedIn= bookingLeg.is_checked_in || false;
        this.isBoarded  = bookingLeg.is_boarded || false;
        this.isNoShow   = bookingLeg.is_no_show || false;
        this.isDeleted  = bookingLeg.is_deleted || false;
        this.checkIn    = bookingLeg.check_in || null;
        this.isCancelled= bookingLeg.is_cancelled || false;
        this.isOpen     = bookingLeg.is_open || false;
        this.isWaitlisted   = bookingLeg.is_waitlisted || false;
        this.isTicketed = bookingLeg.is_ticketed || false;
        this.cabinClass = bookingLeg.cabin_class || {}; //new CabinClass(bookingLeg.cabin_class || {});//needed?
        this.ssrs       = bookingLeg.ssrs || null;
        this.bookingLegFare = new BookingLegFare(bookingLeg.booking_leg_fare);
        // this.bookingLegProducts = bookingLeg.booking_leg_products ? bookingLeg.booking_leg_products.map((booking_leg_product) => new BookingLegProduct(booking_leg_product)): [];
        this.coupons = bookingLeg.coupons ? bookingLeg.coupons.map((coupon:any) => new Coupon(coupon)): [];
    }
}


export class Coupon{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    ticketNumber    : number;
    amount          : number;
    // currency        : any; //Currency;
    passenger       : any; //Passenger;
    bookingLeg      : any; //BookingLeg
    checkIn         : any; //CheckIn;
    reservedSeats   : any[]; //any[]
    reservedSeatName: string;
    ssrs            : any[]; //SSR;
    // status          : string;
    isHeldConfirmed : boolean;
    isTicketed      : boolean;
    isSeatSelected  : boolean;
    isWaitlisted    : boolean;
    isTimechanged   : boolean;
    // isDeleted    : boolean;
    bookedProducts  : any[];//BookedProduct[]
    expireAt        : any; //Datetim|moment

    /**
     * Constructor
     *
     * @param coupon
     */
    constructor(coupon?: any)
    {

        let iri = typeof coupon ==="string" ? coupon : null;
        let id  = typeof coupon ==="number" ? coupon : null;
        
        coupon = coupon || {};
        this.iri = iri? iri:coupon["@id"];
        this.iriType = coupon["@type"] || null;
        this.id = coupon.id || id;
        
        this.ticketNumber   = coupon.ticket_number || null; 
        this.amount         = coupon.amount || 0; 
        // this.currency       = coupon.currency || {};
        this.passenger      = coupon.passenger || {};
        this.bookingLeg     = coupon.booking_leg || {};
        this.checkIn        = coupon.checkIn || {};
        this.reservedSeats  = coupon.reserved_seats || []; //coupon.reserved_seats ? coupon.reserved_seats.map((seat) => {return new ReservedSeat(seat)}) : [];
        this.reservedSeatName= coupon.reserved_seat_name || coupon.reserved_seats[0] ? coupon.reserved_seats[0].seat : null;
        this.ssrs           = coupon.ssrs || [];
        // this.status         = coupon.status || null;
        this.isHeldConfirmed= coupon.is_held_confirmed || false;
        this.isTicketed     = coupon.is_ticketed || false;
        this.isSeatSelected = coupon.is_seat_selected || false;
        this.isWaitlisted   = coupon.is_waitlisted || false;
        this.isTimechanged  = coupon.is_timechanged || false;
        this.bookedProducts = coupon.booked_products ? coupon.booked_products.map((bookedProduct:any) => new BookedProduct(bookedProduct)): [];
        this.expireAt       = coupon.expire_at || null;
    }
}


export class BookedProduct{
   
    iri : string;
    iriType : string;
    id : number;
    product : any; //Product
    name : string;
    price : number;
    quantity : number;
    amount : number;
    tax : number;

    /**
     * Constructor
     *
     * @param bookedProduct
     */
    constructor(bookedProduct?:any)
    {

        let iri = typeof bookedProduct ==="string" ? bookedProduct : null;
        let id  = typeof bookedProduct ==="number" ? bookedProduct : null;
        
        bookedProduct = bookedProduct || {};
        this.iri = iri? iri:bookedProduct["@id"];
        this.iriType = bookedProduct["@type"] || null;
        this.id = bookedProduct.id || id;
        
        this.product    = bookedProduct.product || {};
        this.name       = bookedProduct.name || null;
        this.price      = bookedProduct.price || 0;
        this.quantity   = bookedProduct.quantity || 0;
        this.amount     = bookedProduct.amount || 0;
        this.tax        = bookedProduct.tax || 0;
    }
}


export class BookingLegFare{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    bookingLeg  : any; //BookingLeg;
    bookingClass: any;
    fareDbrLeg  : any; //FareDbrLeg; //old legFare
    adultCost   : number;
    price       : number;
    tax         : number;
    discount    : number;
    cost        : number;
    surcharge        : number;
    manualFare  : number;
    rbd         : string;
    costBreakdown: any;
    fareRules   : any[];

    /**
     * Constructor
     *
     * @param bookingLegFare
     */
    constructor(bookingLegFare?: any)
    {

        let iri = typeof bookingLegFare ==="string" ? bookingLegFare : null;
        let id  = typeof bookingLegFare ==="number" ? bookingLegFare : null;
        
        bookingLegFare = bookingLegFare || {};
        this.iri = iri? iri:bookingLegFare["@id"];
        this.iriType = bookingLegFare["@type"] || null;
        this.id = bookingLegFare.id || id;
        
        this.bookingLeg = bookingLegFare.booking_leg || {}; // new BookingLeg(bookingLegFare.booking_leg);//needed?
        this.bookingClass= bookingLegFare.rbd || null;
        this.fareDbrLeg = bookingLegFare.fare_dbr_leg || {}; // new FareDbrLeg(bookingLegFare.fare_dbr_leg || {});
        this.adultCost  = bookingLegFare.adult_cost || null;
        this.price      = bookingLegFare.price || 0;
        this.tax        = bookingLegFare.tax || 0;
        this.discount   = bookingLegFare.discount || 0;
        this.cost       = bookingLegFare.cost || 0;
        this.surcharge  = bookingLegFare.surcharge || 0;
        this.manualFare = bookingLegFare.manual_fare || 0;
        this.rbd        = bookingLegFare.rbd || null;
        this.costBreakdown= bookingLegFare.cost_breakdown || [];
        this.fareRules  = bookingLegFare.fare_rules || [];
    }
}


export class BookingLegStop{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    bookingLeg     : any; //BookingLeg;
    scheduleLeg: any; //ScheduleLeg;
    noOfPassengers: number;
    fareDbrLeg  : any; //FareDbrLeg; //old legFare
    bookingLegStopFare: any; //BookingLegStopFare

    /**
     * Constructor
     *
     * @param bookingLegStop
     */
    constructor(bookingLegStop?: any)
    {

        let iri = typeof bookingLegStop ==="string" ? bookingLegStop : null;
        let id  = typeof bookingLegStop ==="number" ? bookingLegStop : null;
        
        bookingLegStop = bookingLegStop || {};
        this.iri = iri? iri:bookingLegStop["@id"];
        this.iriType = bookingLegStop["@type"] || null;
        this.id = bookingLegStop.id || id;
        
        this.bookingLeg     = bookingLegStop.booking_leg || {}; // new Booking(bookingLegStop.booking);//needed?
        // this.flightLeg    = bookingLegStop.flight_leg || {}; // new Flight(bookingLegStop.flight || {});
        this.scheduleLeg    = bookingLegStop.schedule_leg || {}; // new Flight(bookingLegStop.flight || {});
        this.bookingLegStopFare = new BookingLegStopFare(bookingLegStop.bookingLegStopFare);
        this.noOfPassengers = bookingLegStop.no_of_passengers || 0;
        this.fareDbrLeg     = bookingLegStop.fare_dbr_leg || {};
    }
}


export class BookingLegStopFare{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    bookingLegStop : any; //BookingLegStop;
    bookingClass  : any; //FareDbrLeg; //old legFare
    fareDbrLeg  : any; //FareDbrLeg; //old legFare
    adultCost   : number;
    price       : number;
    tax         : number;
    discount    : number;
    cost        : number;
    costBreakdown: any;

    /**
     * Constructor
     *
     * @param bookingLegStopFare
     */
    constructor(bookingLegStopFare?:any)
    {

        let iri = typeof bookingLegStopFare ==="string" ? bookingLegStopFare : null;
        let id  = typeof bookingLegStopFare ==="number" ? bookingLegStopFare : null;
        
        bookingLegStopFare = bookingLegStopFare || {};
        this.iri = iri? iri:bookingLegStopFare["@id"];
        this.iriType = bookingLegStopFare["@type"] || null;
        this.id = bookingLegStopFare.id || id;
        
        this.bookingLegStop = bookingLegStopFare.booking_leg_stop || {}; // new BookingLeg(bookingLegStopFare.booking_leg);//needed?
        this.bookingClass     = bookingLegStopFare.booking_class || null;
        this.fareDbrLeg     = bookingLegStopFare.fare_dbr_leg || {}; // new FareDbrLeg(bookingLegStopFare.fare_dbr_leg || {});
        this.adultCost      = bookingLegStopFare.adult_cost || 0;
        this.price          = bookingLegStopFare.price || 0;
        this.tax            = bookingLegStopFare.tax || 0;
        this.discount       = bookingLegStopFare.discount || 0;
        this.cost           = bookingLegStopFare.cost || 0;
        this.costBreakdown  = bookingLegStopFare.costBreakdown || [];
    }
}


export class Passenger{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
   
    booking: any; //Booking;
    firstName: string;
    lastName: string;
    gender: string;
    title: string;
    passengerType: any; //PassengerType
    dateOfBirth: string;
    phone: string;
    email: string;
    address: string;

    seat: string;
    ticketNumber: string;
    ffp: string;
    reservedSeats: any[]; //ReservedSeats   ??on passenger.
    ssrs: any[]; //SSR
    // bookingLegProducts: any[];
    coupons: Coupon[];


    // hasExtraDetails: boolean;

    /**
     * Constructor
     *
     * @param passenger
     */
    constructor(passenger?:any)
    {

        let iri = typeof passenger ==="string" ? passenger : null;
        let id  = typeof passenger ==="number" ? passenger : null;
        
        passenger = passenger || {};
        this.iri = iri? iri:passenger["@id"];
        this.iriType = passenger["@type"] || null;
        this.id = passenger.id || id;
        
        this.booking    = passenger.booking || {}; //new Booking(passenger.booking);//needed?
        this.firstName  = passenger.first_name || null;
        this.lastName   = passenger.last_name || null;
        this.gender     = passenger.gender || null;
        this.title      = passenger.title || null;
        this.passengerType  = passenger.passenger_type || {}; //new PassengerType(passenger.passenger_type || {}); //new PassengerType(passenger.passenger_type || {});
        this.dateOfBirth= passenger.date_of_birth? moment(passenger.date_of_birth, 'YYYY-MM-DD\THH:mm:ssP').format('YYYY-MM-DD\THH:mm:ss'):moment().format('YYYY-MM-DD\THH:mm:ss');
        this.phone      = passenger.phone || null;
        this.email      = passenger.email || null;
        this.address    = passenger.address || null;
        this.seat       = passenger.seat || null;
        this.ticketNumber   = passenger.ticket_number || null;
        this.ffp        = passenger.ffp || null;
        this.reservedSeats  = passenger.reserved_seats || [];
        this.ssrs       = passenger.ssrs || [];
        // this.bookingLegProducts = passenger.booking_leg_products ? passenger.booking_leg_products.map((booking_leg_product) => new BookingLegProduct(booking_leg_product)): [];
        this.coupons    = passenger.coupons ? passenger.coupons.map((coupon:any) => new Coupon(coupon)): [];
        // this.hasExtraDetails = false;//todo: logic
    }

    hasExtraDetails = () => {
        return true;// (this.dateOfBirth !==null || this.email !==null || this.address !==null);
    }
}


export class BookingLegProduct{
   
    iri            : string;
    iriType        : string;
    id             : number;
 
    bookingLeg  : any; //BookingLeg;
    passenger  : any; //Passenger;
    product  : any; //Product;
    name  : string; //redundant
    amount      : number;
    tax         : number;

    /**
     * Constructor
     *
     * @param bookingLegProduct
     */
    constructor(bookingLegProduct?: any)
    {

        let iri = typeof bookingLegProduct ==="string" ? bookingLegProduct : null;
        let id  = typeof bookingLegProduct ==="number" ? bookingLegProduct : null;
        
        bookingLegProduct = bookingLegProduct || {};
        this.iri = iri? iri:bookingLegProduct["@id"];
        this.iriType = bookingLegProduct["@type"] || null;
        this.id = bookingLegProduct.id || id;
        
        this.bookingLeg = bookingLegProduct.booking_leg || {}; // new BookingLeg(bookingLegProduct.booking_leg);//needed?
        this.passenger  = bookingLegProduct.passenger || {};// new Passenger(bookingLegProduct.passenger);//needed?
        this.product = bookingLegProduct.product || {}; // new Product(bookingLegProduct.product || {});
        this.name     = bookingLegProduct.name || null;
        this.amount     = bookingLegProduct.amount || 0;
        this.tax        = bookingLegProduct.tax || 0;
    }
}


export class Payment{
    iri         : string;
    iriType     : string;
    id          : number;

    booking     : any; //Booking; //todo: server return "bookings"
    amount      : number;
    date        : any;
    modeOfPayment: string;
    reference   : string;
    currency    : any; //Currency;
    remarks     : string;
    isCredit    : boolean;
    isDeleted   : boolean;


    /**
     * Constructor
     *
     * @param payment
     */
    constructor(payment?: any)
    {
        let iri = typeof payment ==="string" ? payment : null;
        let id  = typeof payment ==="number" ? payment : null;
        payment = payment || {};
        this.iri = iri? iri:payment["@id"];
        this.iriType = payment["@type"] || null;
        this.id = payment.id || id;
        
        this.booking = payment.booking || {}; //new Booking(payment.booking || {}); 
        this.amount = payment.amount || 0; 
        this.date = payment.date || null; 
        this.modeOfPayment = payment.mode_of_payment || null; 
        this.reference = payment.reference || null; 
        this.currency = payment.currency || {}; //new Currency(payment.currency || {}); 
        this.remarks = payment.remarks || null; 
        this.isCredit = payment.is_credit || false; 
        this.isDeleted = payment.is_deleted || false;  
    }
}

export class Contact{
   
    iri            : string;
    iriType        : string;
    id             : number;
   
    booking: any; //Booking;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    fqtvNumber: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact?: any)
    {

        let iri = typeof contact ==="string" ? contact : null;
        let id  = typeof contact ==="number" ? contact : null;
        
        contact = contact || {};
        this.iri = iri? iri:contact["@id"];
        this.iriType = contact["@type"] || null;
        this.id = contact.id || id;
        
        this.booking    = contact.booking || {}; //new Booking(contact.booking);//needed?
        this.firstName  = contact.first_name || null;
        this.lastName   = contact.last_name || null;
        this.title      = contact.title || null;
        this.phone      = contact.phone || null;
        this.email      = contact.email || null;
        this.address    = contact.address || null;
        this.fqtvNumber = contact.fqtv_number || null;
    }
}

export class BookingRemark{
    iri            : string;
    iriType        : string;
    id             : number;
    remark: string;
    date: any;

    /**
     * Constructor
     *
     * @param remark
     */
    constructor(remark?:any)
    {
        let iri = typeof remark ==="string" ? remark : null;
        let id  = typeof remark ==="number" ? remark : null;
        
        remark      = remark || {};
        this.iri    = iri? iri:remark["@id"];
        this.iriType= remark["@type"] || null;
        this.id     = remark.id || id;
        this.remark = remark.remark || null;
        this.date   = remark.date || null;
    }
}

export class BookingHistory{
    iri            : string;
    iriType        : string;
    id             : number;
    date: any;
    bookingAgent    : any; //Agent
    user            : User;
    title           : string;
    message         : string;
    type            : string;

    /**
     * Constructor
     *
     * @param history
     */
    constructor(history?:any)
    {
        let iri = typeof history ==="string" ? history : null;
        let id  = typeof history ==="number" ? history : null;
        
        history      = history || {};
        this.iri    = iri? iri:history["@id"];
        this.iriType= history["@type"] || null;
        this.id     = history.id || id;
        this.date   = history.date || null;
        this.bookingAgent   = history.booking_agent || null;
        this.user   = new User(history.user || {});
        this.title  = history.title || null;
        this.message    = history.message || null;
        this.type   = history.type || null;

    }
}

export class ApFax{
    iri            : string;
    iriType        : string;
    id             : number;
    code: string;
    description    : string;
    passengers      : any[];
    segments        : any[];
    booking         : any|Booking;

    /**
     * Constructor
     *
     * @param apFax
     */
    constructor(apFax?:any)
    {
        let iri = typeof apFax ==="string" ? apFax : null;
        let id  = typeof apFax ==="number" ? apFax : null;
        
        apFax      = apFax || {};
        this.iri    = iri? iri:apFax["@id"];
        this.iriType= apFax["@type"] || null;
        this.id     = apFax.id || id;
        this.code   = apFax.code || null;
        this.description   = apFax.description || null;
        this.passengers   = apFax.passengers || [];
        this.segments  = apFax.segments || [];
        this.booking   = apFax.booking || null;

    }
}