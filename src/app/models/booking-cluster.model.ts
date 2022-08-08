import { Currency } from './currency.model';
import { Airport } from './airports.model';
import { CabinClass } from './cabin-class.model';
import * as moment from 'moment';

export class BookingCluster
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    code: string;
    cabinClass: CabinClass;
    bookingClasses      : string[];
    rbds                : string[];
    baggageNumber : number;
    baggageWeight : number;
    currency   : Currency;
    surchargeAmount     : number;
    headerForeColor     : string;
    headerBackColor     : string;
    bodyForeColor       : string;
    bodyBackColor       : string;
    fqtvPoints          : number;
    changeFee           : number;
    cancellationFee     : number;
    seatSelectionFee    : number;
    noShowFee           : number;
    isRefundable        : boolean;
    ticketValidityDays  : number;
    bookingClusterRules : BookingClusterRule[]; 
    // bookingClusterSurcharges : BookingClusterSurcharge[];
    isFreeSeatSelection? :boolean;
    freeChanges?         :number;



    /**
     * Constructor
     *
     * @param bookingCluster
     */
    constructor(bookingCluster?:any)
    {
        bookingCluster  = bookingCluster || {};
        let iri     = typeof bookingCluster ==='string' ? bookingCluster : null;
        let id      = typeof bookingCluster ==='number' ? bookingCluster : null;
        this.iri = bookingCluster["@id"] || iri;
        this.iriType = bookingCluster["@type"] || null;
        this.id         = bookingCluster.id || id;
        this.name       = bookingCluster.name || null;
        this.code       = bookingCluster.code || null;
        this.cabinClass     = new CabinClass(bookingCluster.cabin_class || {});
        this.bookingClasses = bookingCluster.booking_classes || [];
        this.rbds = bookingCluster.rbds || [];
        this.baggageNumber    = bookingCluster.baggage_number || 0;
        this.baggageWeight    = bookingCluster.baggage_weight || 0;
        this.currency  = new Currency(bookingCluster.currency || {});
        this.surchargeAmount    = bookingCluster.surcharge_amount || 0;
        this.headerForeColor    = bookingCluster.header_fore_color || null;
        this.headerBackColor    = bookingCluster.header_back_color || null;
        this.bodyForeColor  = bookingCluster.body_fore_color || null;
        this.bodyBackColor  = bookingCluster.body_back_color || null;
        this.fqtvPoints     = bookingCluster.fqtv_points || 0;
        this.changeFee              = bookingCluster.change_fee || 0;
        this.cancellationFee        = bookingCluster.cancellation_fee || 0;
        this.seatSelectionFee       = bookingCluster.seat_selection_fee || 0;
        this.noShowFee              = bookingCluster.no_show_fee || 0;
        this.isRefundable           = bookingCluster.is_refundable || false;    
        this.ticketValidityDays     = bookingCluster.ticket_validity_days || 365;
        this.bookingClusterRules    = bookingCluster.booking_cluster_rules
            ? bookingCluster.booking_cluster_rules
                .map((bookingClusterRule:any) => new BookingClusterRule(bookingClusterRule)): [];
        // this.bookingClusterSurcharges    = bookingCluster.booking_cluster_surcharges 
        //     ? bookingCluster.booking_cluster_surcharges
        //         .map((bookingClusterSurcharge) => new BookingClusterSurcharge(bookingClusterSurcharge)): [];

    }
}


export class BookingClusterRule
{
    iri: string;
    iriType: string;
    id: number;
    sn: string;
    icon: string;
    text: string;
    bookingCluster: BookingCluster;

    /**
     * Constructor
     *
     * @param bookingClusterRule
     */
    constructor(bookingClusterRule?:any)
    {
        bookingClusterRule  = bookingClusterRule || {};

        let iri     = typeof bookingClusterRule ==='string' ? bookingClusterRule : null;
        let id      = typeof bookingClusterRule ==='number' ? bookingClusterRule : null;
        this.iri    = bookingClusterRule["@id"] || iri;

        bookingClusterRule = bookingClusterRule || {};
        this.iri = bookingClusterRule["@id"] || iri;
        this.iriType = bookingClusterRule["@type"] || null;
        this.id         = bookingClusterRule.id || id;
        this.sn         = bookingClusterRule.sn || null;
        this.icon       = bookingClusterRule.icon || null;
        this.text       = bookingClusterRule.text || null;
        this.bookingCluster = new BookingCluster(bookingClusterRule.booking_cluster || {});
    }
}

export class BookingClusterSurcharge
{
    iri: string;
    iriType: string;
    id: number;
    bookingCluster: BookingCluster;
    departAirport: Airport; 
    arriveAirport: Airport; 
    rbd: string;
    isBiDirectional: boolean;
    saleStartDate: any;
    saleEndDate: any;
    travelFromDate: any;
    travelToDate: any;
    dow: number;
    flightNumber: string;
    currency: Currency;
    amount: number;

    /**
     * Constructor
     *
     * @param bookingClusterSurcharge
     */
    constructor(bookingClusterSurcharge?:any)
    {
        bookingClusterSurcharge  = bookingClusterSurcharge || {};

        let iri     = typeof bookingClusterSurcharge ==='string' ? bookingClusterSurcharge : null;
        let id      = typeof bookingClusterSurcharge ==='number' ? bookingClusterSurcharge : null;
        this.iri    = bookingClusterSurcharge["@id"] || iri;

        bookingClusterSurcharge = bookingClusterSurcharge || {};
        this.iri = bookingClusterSurcharge["@id"] || iri;
        this.iriType = bookingClusterSurcharge["@type"] || null;
        this.id         = bookingClusterSurcharge.id || id;
        this.bookingCluster = new BookingCluster(bookingClusterSurcharge.booking_cluster || {});

        this.departAirport  = new Airport(bookingClusterSurcharge.depart_airport || {});
        this.arriveAirport  = new Airport(bookingClusterSurcharge.arrive_airport || {});
        this.rbd            = bookingClusterSurcharge.rbd || null;
        this.isBiDirectional= bookingClusterSurcharge.is_bi_directional || false;
        this.saleStartDate  = moment(bookingClusterSurcharge.sale_start_date || new Date('now')).format('YYYY-MM-DD\THH:mm:SS');
        this.saleEndDate    = moment(bookingClusterSurcharge.sale_end_date || new Date('now')).format('YYYY-MM-DD\THH:mm:SS');
        this.travelFromDate = moment(bookingClusterSurcharge.travel_from_date || new Date('now')).format('YYYY-MM-DD\THH:mm:SS');
        this.travelToDate   = moment(bookingClusterSurcharge.travel_to_date || new Date('now')).format('YYYY-MM-DD\THH:mm:SS');
        this.dow            = bookingClusterSurcharge.dow || 0;
        this.flightNumber   = bookingClusterSurcharge.flight_number || null;
        this.currency       = new Currency(bookingClusterSurcharge.currency || {});
        this.amount         = bookingClusterSurcharge.amount || 0;

    }
}