import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Pnr, Manifest, ReservedSeat, Coupon, Ticket, Checkin } from '../models/dcs.model';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';
@Injectable()
export class ManageBookingService implements Resolve<any>
{
    onPnrsChanged: BehaviorSubject<any>;
    onSelectedPnrsChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onSelectedFlightsChanged: Subject<any>;
    onSelectedFlightChanged: Subject<any>;

    // onFlightChanged: BehaviorSubject<any>;
    selFlight: number;
    selFlights: number[] = [];
    flight: any;

    pnrs: any[]=[];
    allFlightsPnrs: any[]=[];
    // user: any;
    selectedPnrs: number[] = [];

    searchText: string = '';
    filterBy: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onPnrsChanged = new BehaviorSubject([]);
        this.onSelectedPnrsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onSelectedFlightsChanged = new Subject();
        this.onSelectedFlightChanged = new Subject();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                // this.selFlight? this.getPnr(this.selFlight) : '',
                // this.selFlights.length ? this.getAllPnrs(this.selFlights) : ''
            ]).then(
                (x:any) => {

                    // this.onSelectedFlightChanged.subscribe(selected => {
                    //     console.log('pnr selected flight:',selected);
                    //     this.selFlight = selected.id;
                    //     this.flight=selected;
                    //     this.selFlights = [];
                    //     this.selFlights.push(selected);
                    //     console.log(this.selFlight,this.selFlights);
                    //     this.getPnr(selected.id);
                    // });
                    // this.onSelectedFlightsChanged.subscribe(selected => {
                        
                    //     this.selFlights=selected;
                        
                    //     console.log(this.selFlight,this.selFlights);
                    //     this.getAllPnrs(this.selFlights);
                    // });

                    resolve(this.pnrs);

                },
                reject
            );
        });
    }
    

    /**
     * Get pnr
     *
     * @returns {Promise<any>}
     */
    getPnr(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            // if (this.filterBy){
            //     // If PNR records should be requested passing required filters as parameters. 
            //     // If records will be read as in manifest, the PNR record filtering can be done realtime on the front-end in pnr-list.component.ts
            //     console.log(this.stringFilter());
            // }

            this._httpClient.get(environment.serverURL+'/api/flights/' + id + '/manifest')
                .subscribe((response: any) => {

                    console.log('row response:', response);
                    this.flight = new Manifest(response);
                    console.log('whole selected flight: ', this.flight)
                    
                    this.pnrs = this.genPnrs(this.flight.bookings);

                    console.log('pnrs', this.pnrs);
                    // .. search
                    // if ( this.searchText && this.searchText !== '' )
                    // {
                    //     this.pnrs = FuseUtils.filterArrayByString(this.pnrs, this.searchText);
                    // }

                    // Perform filters
                    this.pnrs = _.filter (this.pnrs, function(pnr){
                        return (pnr.isDeleted != 1);
                    });
                        
                    console.log('filtered removed deleted', this.pnrs);

                    // this.onPnrsChanged.next(this.pnrs);
                    resolve(this.pnrs);
                }, reject);
        }
        );
    }

    public async getAllPnrs(flightIds: number[]){
        this.allFlightsPnrs = [];
        for await (const iterator of flightIds) {
            this.getPnr(iterator).then(curFlightPnrs=>{
                this.allFlightsPnrs.push(...curFlightPnrs);
                //alternative to above this.allFlightsPnrs = [...this.allFlightsPnrs,...curFlightPnrs]
                console.log('pushed pnrs', curFlightPnrs);
            });
        }
        console.log('All Pnrs on Sel Flights', this.allFlightsPnrs);
        
        this.onPnrsChanged.next(this.allFlightsPnrs);
        return this.allFlightsPnrs;
    }

    private genPnrs(bookingLegs: any[]){
        //
        const flight = this.flight;
        console.log('at line 395',flight);
        let allReserved: any[] = [];
        let allBlocked: any[] = [];
        let _seats = [];
        
        // flight.flightLegs.map(flightLeg => {
        //     let rs = flightLeg.reservedSeats;
        //     console.log('rsseat',rs, 'flegseat', flightLeg);
        //     for (let i = 0; i < rs.length; i++) {
        //         console.log(rs[i], 'exist seat?', _pax.reservedSeats);
        //         for (let index = 0; index < _pax.reservedSeats.length; index++) {
        //             if(_pax.reservedSeats[index].iri == rs[i].iri){
        //                 return rs[i];
        //             }
        //         }
        //     }
        // }),
        const bookings = bookingLegs;//flight.bookings;
        let pnrList: Array<any> = [];
        for (let i = 0; i < bookings.length; i++) {
            const _booking = bookings[i];
            
            for ( let j = 0; j < _booking.coupons.length; j++ ) {
                const _coupon = _booking.coupons[j];
                const _pax = _booking.coupons[j].passenger;
                // if ( leg.departAirport !== _leg.arriveAirport ){
                    // console.log('booking/_pax:', booking, _pax, i,j );
                    // flightList.push( leg.departAirport + '-' + _leg.arriveAirport );

                    flight.flightLegs.map((flightLeg: any) => {
                        let rs = flightLeg.reservedSeats;
                        let bks = flightLeg.blockedSeats;
                        console.log('rsseat',rs, 'flegseat', flightLeg);
                        allReserved = allReserved.concat(rs);
                        allBlocked = allBlocked.concat(bks);
                    });

                    // for (let index = 0; index < _pax.reservedSeats.length; index++) {
                    //     // allReserved.find(x => x.iri === _pax.reservedSeats[index].iri);
                    //     // myArray.filter(x => x.id === '45').map(x => x.foo);
                    //     if(allReserved.find(x => x.iri === _pax.reservedSeats[index].iri)){
                    //         console.log('exist seat?', _pax.reservedSeats[index]);
                    //         _seats.push(_pax.reservedSeats[index]);
                    //     }
                    // }
                    let _pnr = {
                        iri          : _booking.iri,
                        id           : _booking.id,
                        cabinClass   : _booking.cabinClass,
                        fare         : _booking.fare,
                        bookingLegFare: _booking.fare,
                        isStopFare   : _booking.isStopFare,
                        // isCheckedIn  : _booking.isCheckedIn,
                        isCheckedIn  : _coupon.checkIn ? _coupon.checkIn.id ? true : false : false,
                        isBoarded    : _booking.isBoarded,
                        isNoShow     : _booking.isNoShow,
                        isDeleted    : _booking.isDeleted,
                        // isWaitlisted : _booking.isWaitlisted,
                        isWaitlisted : _coupon.isWaitlisted,
                        // isTicketed   : _booking.isTicketed,
                        isTicketed   : _coupon.isTicketed,
                        isCancelled  : _booking.isCancelled,
                        isOpen       : _booking.isOpen,
                        bookingLegStops: _booking.bookingLegStops,
                        charges      : _booking.charges,
                        coupons      : _booking.coupons,
                        bookingIri   : _booking.bookingIri,
                        bookingId    : _booking.bookingId,
                        recordLocator: _booking.recordLocator,
                        phone        : _booking.phone,
                        email        : _booking.email,
                        status       : _booking.status,
                        date         : _booking.date,
                        flightDate   : flight.date,
                        effectiveDate: _booking.effectiveDate,
                        expireAt     : _booking.expireAt,
                        bookingAgent : _booking.bookingAgent,
                        groupName    : _booking.groupName,
                        isGroup      : _booking.isGroup,
                        bookingIsCancelled: _booking.bookingIsCancelled,
                        paxCount     : _booking.passengers.length,
                        amountPaid   : _booking.amountPaid,
                        amountDue    : _booking.amountDue,
                        amountPending: _booking.amountPending,
                        // remarks      : _booking.remarks, 
                        // waitlist     : _booking.waitlist,
                        coupon       : _coupon,
                        couponId     : _coupon.id,
                        couponIri    : _coupon.iri,
                        amount       : _coupon.amount,
                        currency     : _coupon.currency,
                        serviceClass : _coupon.bookingClass,
                        checkinId    : _coupon.checkIn.id,
                        checkinIri   : _coupon.checkIn.iri,
                        checkIn      : _coupon.checkIn,
                        baggagePcs   : _coupon.checkIn ? _coupon.checkIn.baggage_count : 0,
                        baggageWeight: _coupon.checkIn ? _coupon.checkIn.baggage_weight : 0,
                        reservedSeats: _coupon.reservedSeats,
                        reservedSeatName: _coupon.reservedSeatName,
                        ssrs         : _coupon.ssrs,
                        couponStatus : _coupon.status,
                        isHeldConfirmed: _coupon.isHeldConfirmed,
                        couponIsTicketed   : _coupon.isTicketed,
                        isSeatSelected: _coupon.isSeatSelected,
                        couponIsWaitlisted : _coupon.isWaitlisted,
                        isTimeChanged: _coupon.isTimeChanged,
                        ticket       : _coupon.ticket,
                        bookedProducts: _coupon.bookedProducts,
                        couponExpireAt: _coupon.couponExpireAt,
                        // address      : _booking.address,
                        passenger    : _coupon.passenger,
                        paxIri       : _pax.iri,
                        paxId        : _pax.id,
                        firstName    : _pax.firstName,
                        lastName     : _pax.lastName,
                        fullName     : _pax.fullName,
                        gender       : _pax.gender,
                        passengerType: _pax.passengerType,
                        dateOfBirth  : _pax.dateOfBirth,
                        ticketNumber : _pax.ticketNumber,
                        seat         : _pax.passengerType ? _pax.passengerType.name != 'Infant' ? _coupon.reservedSeatName : 'NS' : _coupon.reservedSeatName,
                        passengerStatus: _pax.passengerStatus,
                        ffp          : _pax.ffp,
                        
                        legs         : flight.stops,
                        flightLegs   : flight.flightLegs,
                        flightLegsIris: flight.flightLegs.map((flightLeg: any)=>{return flightLeg.iri}),
                        flightId     : flight.id,
                        flight     : flight,
                        origin       : flight.departAirport,
                        destination  : flight.arriveAirport,
                    };

                    let tmp = JSON.stringify(_pnr);
                    _pnr = JSON.parse(tmp);
                    // _pnr.seat = _pnr.seats[0] ? _pnr.seats[0] : '';
                    // console.log('must be ',_pnr.seats[0] ? _pnr.seats[0].seat ? _pnr.seats[0].seat : 'ho' : '');
                    // console.log('checkedin pax',_booking.checkIns[0]?_booking.checkIns[0].passenger.id:"pax not object");
                    // console.log({_flight})
                    pnrList.push(_pnr);
                    // this._flightsService.createFlight(_flight);
                // }
            }
            // this._flightsService.getFlights({flight_number: this.chosenSchedule.flightNumber});
        }


        return pnrList;
    }

    /**
     * Toggle selected pnr by id
     *
     * @param id
     */
    toggleSelectedPnr(id: number): void {
        // First, check if we already have that pnr as selected...
        if (this.selectedPnrs.length > 0) {
            const index = this.selectedPnrs.indexOf(id);

            if (index !== -1) {
                this.selectedPnrs.splice(index, 1);
                console.log('new unselected pnr', this.selectedPnrs);
                // Trigger the next event
                this.onSelectedPnrsChanged.next(this.selectedPnrs);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedPnrs.push(id);
        console.log('new selected pnr added', this.selectedPnrs);
        // Trigger the next event
        this.onSelectedPnrsChanged.next(this.selectedPnrs);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedPnrs.length > 0) {
            this.deselectPnrs();
        }
        else {
            this.selectPnrs();
        }
    }

    /**
     * Select pnrs
     *
     * @param filterParameter
     * @param filterValue
     */
    selectPnrs(filterParameter?: any, filterValue?: any): void {
        // this.selectedPnrs = [];

        // If there is no filter, select all pnrs
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedPnrs = [];
            this.pnrs.map(pnr => {
                this.selectedPnrs.push(pnr.id);
            });
        }

        // Trigger the next event
        this.onSelectedPnrsChanged.next(this.selectedPnrs);
    }

    /**
     * Update passenger seat field
     *
     * @param paxId
     * @returns {Promise<any>}
     */
    updateSeat(myPnr: any, data: any): Promise<any> {
        console.log('updating seat: ', data);
        // const seat = {seat: data.seat};
        const paxId = myPnr.paxId;
        
        return new Promise((resolve, reject) => {
            this._httpClient.patch(environment.serverURL+'/api/passengers/' + paxId, data)
                .subscribe((response: any) => {
                    console.log('updated:',response);
                    this.pnrs = this.pnrs.map(pnr => {
                        if(pnr.paxId == response.id){
                            console.log('record to update', pnr, paxId);
                            pnr.seat = response.seat;
                        }
                        return pnr;
                    })
                    resolve(response);
                }, reject);
        });
    }

    createReservedSeats(bookingLeg: any, data: any): any {
        console.log('updating seat: ', data);
        let seatReservation: any[] = [];
        bookingLeg.flight.flightLegs.forEach((flightLeg: any) => {
            seatReservation.push({
                "seat": data.seat,
                "flight_leg": flightLeg,
                "coupon": data.coupon
              });
              console.log('ok', seatReservation);
        });
        console.log(seatReservation);
        seatReservation.forEach(element => { 
            console.log(element);
            this.createSeatReservation(element).then( response =>{
                // this.pnrs = this.pnrs.map(pnr => {
                //     if(pnr.paxIri == response.passenger){
                //         console.log('record to update', pnr, myPnr.paxId);
                        
                //         const myReserved = new ReservedSeat(response);
                //         pnr.seats.push(myReserved);
                //         pnr.seat = myReserved;
                //         pnr.reservedSeatName = myReserved.seat.name;
                //     }
                //     return pnr;
                // })
                // return response;
            });
        });
        
    }

    /**
     * Create Reserved Seat record
     *
     * @param mypnr
     * @returns {Promise<any>}
     */
    createSeatReservation(data: any): Promise<any> {
        console.log('adding seat reservation record: ', data);
        // let seatReservation = [];
        // myPnr.flightLegs.forEach(flightLeg => {
        //     seatReservation.push({
        //         "seat": data.seat,
        //         "flight_leg": flightLeg,
        //         "passenger": myPnr.paxId
        //       });
        // });
        // const paxId = myPnr.paxId;
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/reserved_seats', data)
                .subscribe((response: any) => {
                    console.log('reserved:',response);
                    
                    resolve(response);
                }, reject);
        });
    }


    /**
     * Print zpl
     * fails to work currently will try to find how to send http request/resource for printing later
     * @param data
     * @returns {Promise<any>}
     */
     print(data: any): Promise<any> {
        console.log('sending zpl data to printer: ', data);
        
        return new Promise((resolve, reject) => {
            this._httpClient.post('http://localhost:631/printers/zpl_raw', data)
                .subscribe((response: any) => {
                    console.log('response:',response);
                    
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Update Reserved Seat record
     *
     * @param mypnr
     * @returns {Promise<any>}
     */
    UpdateSeatReservation(myPnr: any, data: any): Promise<any> {
        console.log('updating seat: ', data);
        let seatReservation = [];
        myPnr.flightLegs.forEach((flightLeg: any) => {
            seatReservation.push({
                "seat": data.seat,
                "flight_leg": flightLeg,
                "passenger": myPnr.paxId
              });
        });
        const paxId = myPnr.paxId;
        
        return new Promise((resolve, reject) => {
            this._httpClient.patch(environment.serverURL+'/api/reserved_seats/'+paxId, data)
                .subscribe((response: any) => {
                    console.log('updated:',response);
                    this.pnrs = this.pnrs.map(pnr => {
                        if(pnr.paxId == response.id){
                            console.log('record to update', pnr, paxId);
                            pnr.seat = response.seat;
                            
                        }
                        return pnr;
                    })
                    resolve(response);
                }, reject);
        });
    }

    findIndexToUpdate(newPnr: any) {
        return newPnr.id === this;
    }

    /**
     * Deselect pnrs
     */
    deselectPnrs(): void {
        this.selectedPnrs = [];

        // Trigger the next event
        this.onSelectedPnrsChanged.next(this.selectedPnrs);
    }

    /**
     * Delete pnr
     *
     * @param pnr
     * @returns {Promise<any>}
     */
    deletePnr(pnr: any): Promise<any> {
        // const pnrIndex = this.pnrs.indexOf(pnr);
        // this.pnrs.splice(pnrIndex, 1);

        let pnrId = pnr;
        if (typeof pnr === 'object' && pnr.id) {
            pnrId = pnr.id;
        }
        const bookingLeg = {isDeleted: true};
        //////
        return new Promise((resolve, reject) => {
            console.log(pnr);

            this._httpClient.patch(environment.serverURL+'/api/booking_legs/' + pnrId, bookingLeg)
                .subscribe(response => {
                    this.getPnr(this.selFlight);

                    // this.onPnrsChanged.next(this.pnrs);
                    resolve(response);
                });
        });
        //////
        // this.onPnrsChanged.next(this.pnrs);
    }

    /**
     * Delete selected pnrs
     */
    deleteSelectedPnrs(): void {
        console.log('selected pnrs',this.selectedPnrs);
        for (const pnrId of this.selectedPnrs) {
            // const pnr = this.pnrs.find(_pnr => {
            //     return _pnr.id === pnrId;
            // });
            // const pnrIndex = this.pnrs.indexOf(pnr);
            // this.pnrs.splice(pnrIndex, 1);

            this.deletePnr(pnrId);
        }
        // this.onPnrsChanged.next(this.pnrs);
        this.deselectPnrs();
    }

     /**
     * Update pnr, post checkin and update bookingLeg status
     *
     * @param gate
     * @returns {Promise<any>}
     */
    checkin(data: any, pnr: any): Promise<any> {
        // const bookingLegId = data.booking_leg;
        const status = {is_checked_in:true, };
        const payload = {is_checked_in:true, check_in:data};
        return new Promise((resolve, reject) => {
            this._httpClient.patch(`${environment.serverURL}/api/coupons/${pnr.couponId}`, payload)
                .subscribe((response: any) => {
                    console.log(response);
                    // this.updateFlightBooking(pnr.id, status);
                    // this.getPnr();
                    this.pnrs = this.pnrs.map(x => {
                        if(pnr.couponId == x.couponId){
                            x.isCheckedIn = true;
                            x.checkinId = response.check_in.id;
                            x.checkinIri = response.check_in['@id'];
                            // pnr.checkIn = new Checkin(response.check_in);
                            // pnr.checkIns.push(response);
                            x.coupon = new Coupon(response);
                            // x.couponId = response.id;
                        }
                        return x;
                    })
                    resolve(response);
                }, reject);
        });
    }

     /**
     * Update pnr, patch checkin to flight on bookingLegs
     *
     * @param gate
     * @returns {Promise<any>}
     */
    checkinSelectedPnrs(bookingLegs: any[]): Promise<any> {
        const data = {booking_legs: bookingLegs};
        return new Promise((resolve, reject) => {
            this._httpClient.patch(environment.serverURL+'/api/flights/'+this.selFlight+'/checkin', data)
                .subscribe((response: any) => {
                    console.log(response);
                    this.getPnr(this.selFlight);
                    
                    resolve(response);
                }, reject);
        });
    }

     /**
     * Update pnr, delete checkin and update bookingLeg status
     *
     * @param gate
     * @returns {Promise<any>}
     */
    offload(pnr: any): Promise<any> {
        const status = {is_checked_in:false};
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.serverURL+'/api/check_ins/' + pnr.checkinId)
                .subscribe((response: any) => {
                    console.log(response);
                    // this.updateFlightBooking(pnr.id, status);
                    this.pnrs = this.pnrs.map(x => {
                        if(x.couponId == pnr.couponId){
                            x.checkinId = null;
                            x.checkinIri = null;
                            x.checkIn = null;
                            x.baggagePcs = 0;
                            x.baggageWeight = 0;
                            x.isCheckedIn = false;
                        }
                        return x;
                    })
                    resolve(response);
                }, reject);
        });
    }

     /**
     * Update Booking Leg statuses
     *
     * @param gate
     * @returns {Promise<any>}
     */
    updateFlightBooking(bookingLegId: number, data: any): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this._httpClient.patch(environment.serverURL+'/api/booking_legs/' + bookingLegId, data)
                .subscribe((response: any) => {
                    console.log(response);

                    console.log('response- ', response);
                    this.pnrs = this.pnrs.map(pnr => {
                        if(pnr.id == response.id){
                            console.log('record to update', pnr, bookingLegId, pnr.id);
                            pnr.isCheckedIn = response.is_checked_in;
                            pnr.isBoarded = response.is_boarded;
                            // pnr.baggageWeight = response.check_in.baggage_weight;
                            // pnr.baggagePcs = response.check_in.baggage_count;
                        }
                        return pnr;
                    })
                    this.getPnr(this.flight.id);

                    resolve(response);
                }, reject);
        });
    }

    /**
     * Update Boarding Gate
     *
     * @param gate
     * @returns {Promise<any>}
     */
    updateBoardingGate(gate: string): Promise<any> {
        console.log('updating gate: ', gate);
        const myFlight={boarding_gate:gate};
        console.log(myFlight);
        return new Promise((resolve, reject) => {
            this._httpClient.patch(environment.serverURL+'/api/flights/' + this.selFlight, myFlight)
                .subscribe((response: any) => {
                    console.log(response);
                    resolve(response);
                }, reject);
        });
    }

}
