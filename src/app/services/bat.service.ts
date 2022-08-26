import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Passenger, Payment } from "../models/passenger.model";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Booking } from "../models/booking.model";
import { AclService } from "./acl.service";
@Injectable({ providedIn: "root" })
export class BatService {
    PNRToUpdate: string = "";
    isEditingMode: boolean = false;
    toNextStep: boolean = false;
    bookingInEditing: any = null;
    bookingInEditingChanged = new Subject<{}>();
    gotIssueTicketClicked: Subject<any> = new Subject();
    continueToPassengerInformation: BehaviorSubject<any> = new BehaviorSubject(null);
    onSelectFlightClicked: Subject<any> = new Subject();
    passengersAdded = new Subject<Passenger[]>();
    paymentsAdded = new Subject<Payment[]>();
    flightsAdded = new Subject<string[]>();
    onCreatePNRButtonClicked = new Subject<boolean>();
    // selectedSegments: [];
    passengersInPNR: Passenger[] = [];
    flightsInPNR: [] = [];
    contactsInPNR: []= [];
    // selectedFares: [];
    paymentsInPNR: []= [];
    passengerTypes: any = {
        "/api/passenger_types/1" : "Adult",
        "/api/passenger_types/2" : "Child",
        "/api/passenger_types/3" : "Infant",
    };


    onIndexedAirportsChanged: BehaviorSubject<any> =  new BehaviorSubject({});
    onIndexedCabinClassesChanged: BehaviorSubject<any> =  new BehaviorSubject({});
    onIndexedBookingClustersChanged: BehaviorSubject<any> =  new BehaviorSubject({});
    onIndexedPassengerTypesChanged: BehaviorSubject<any> =  new BehaviorSubject({});
    
    onBookingsChanged: BehaviorSubject<any> =  new BehaviorSubject([]);
    onResetOpenPNR: BehaviorSubject<any> =  new BehaviorSubject(null);
    bookings: Booking[] = [];

    onBookingFormChanged = new BehaviorSubject(new FormGroup({}));

    addSelectedSegment() {}
    constructor(private _httpClient: HttpClient, private aclService: AclService) {}

    /**
     * Get bookings
     *
     * @returns {Promise<any>}
     */
    getBookings(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/bookings')
                    .subscribe((response: any) => {

                        let bookings = response['hydra:member'];

                        // console.log('bookings',bookings);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.bookings = FuseUtils.filterArrayByString(this.bookings, this.searchText);
                        // }

                        this.bookings = bookings.map((booking: any) => {
                            return new Booking(booking);
                        });

                        this.onBookingsChanged.next(this.bookings);
                        resolve(this.bookings);
                    }, reject);
            }
        );
    }

    /**
     * Add booking
     *
     * @param booking
     * @returns {Promise<any>}
     */
    addBooking(booking: any): Promise<any>
    {
        let param : any = {
            "date": "2022-08-23T11:13:34.778Z",
            "effective_date": "2022-08-23T11:13:34.778Z",
            "status": "NEW",
            "is_group": true,
            "booking_legs": [
              {
                "flight": "/api/flights/1810",
                "fare": "string",
                "charges": [
                  "string"
                ],
                "is_deleted": true,
                "booking_leg_stops": [
                  {
                    "schedule_leg": "string",
                    "no_of_passengers": 0,
                    "fare_dbr_leg": "string",
                    "booking_leg_stop_fare": {
                      "fare_dbr_leg": "string",
                      "adult_cost": 0,
                      "tax": 0,
                      "surcharge": 0,
                      "price": 0,
                      "discount": 0,
                      "cost": 0,
                      "cost_breakdown": [
                        "string"
                      ]
                    }
                  }
                ],
                "is_cancelled": true,
                "is_open": true,
                "is_waitlisted": true,
                "is_ticketed": true,
                "cabin_class": "string",
                "booking_leg_fare": {
                  "fare_dbr": "string",
                  "rbd": "string",
                  "fare_dbr_leg": "string",
                  "adult_cost": 0,
                  "tax": 0,
                  "surcharge": 0,
                  "cost_breakdown": [
                    "string"
                  ],
                  "price": 0,
                  "cost": 0,
                  "discount": 0,
                  "manual_fare": 0,
                  "fare_rules": [
                    "string"
                  ],
                  "cluster_fare_rules": [
                    "string"
                  ]
                },
                "is_stop_fare": true,
                "coupons": [
                  {
                    "amount": 0,
                    "currency": "string",
                    "check_in": {
                      "time": "2022-08-23T11:13:34.779Z",
                      "baggage_weight": 0,
                      "baggage_count": 0,
                      "airport": "string",
                      "baggage_status": true,
                      "agent": "string",
                      "baggages": [
                        {
                          "barcode": "string",
                          "status": "string",
                          "location": "string",
                          "weight": 0,
                          "description": "string"
                        }
                      ],
                      "bp_print_count": 0
                    },
                    "reserved_seats": [
                      "string"
                    ],
                    "reserved_seat_name": "string",
                    "ssrs": [
                      "string"
                    ],
                    "status": "string",
                    "is_held_confirmed": true,
                    "is_ticketed": true,
                    "is_seat_selected": true,
                    "is_waitlisted": true,
                    "is_boarded": true,
                    "is_no_show": true,
                    "is_time_changed": true,
                    "booked_products": [
                      {
                        "product": "string",
                        "name": "string",
                        "amount": 0,
                        "tax": 0,
                        "quantity": 0,
                        "price": 0
                      }
                    ],
                    "expire_at": "2022-08-23T11:13:34.780Z",
                    "ticket_number": 0
                  }
                ],
                "expire_at": "2022-08-23T11:13:34.780Z",
                "rbd": "string"
              }
            ],
            "email": "string",
            "phone": "string",
            "passengers": [
              {
                "title": "string",
                "first_name": "string",
                "last_name": "string",
                "phone": "string",
                "address": "string",
                "gender": "string",
                "date_of_birth": "2022-08-23T11:13:34.780Z",
                "email": "string",
                "ticket_number": "string",
                "passenger_type": "string",
                "ffp": "string",
                "coupons": [
                  {
                    "amount": 0,
                    "currency": "string",
                    "check_in": {
                      "time": "2022-08-23T11:13:34.780Z",
                      "baggage_weight": 0,
                      "baggage_count": 0,
                      "airport": "string",
                      "baggage_status": true,
                      "agent": "string",
                      "baggages": [
                        {
                          "barcode": "string",
                          "status": "string",
                          "location": "string",
                          "weight": 0,
                          "description": "string"
                        }
                      ],
                      "bp_print_count": 0
                    },
                    "reserved_seats": [
                      "string"
                    ],
                    "reserved_seat_name": "string",
                    "ssrs": [
                      "string"
                    ],
                    "status": "string",
                    "is_held_confirmed": true,
                    "is_ticketed": true,
                    "is_seat_selected": true,
                    "is_waitlisted": true,
                    "is_boarded": true,
                    "is_no_show": true,
                    "is_time_changed": true,
                    "booked_products": [
                      {
                        "product": "string",
                        "name": "string",
                        "amount": 0,
                        "tax": 0,
                        "quantity": 0,
                        "price": 0
                      }
                    ],
                    "expire_at": "2022-08-23T11:13:34.780Z",
                    "ticket_number": 0
                  }
                ],
                "booking_leg_fare_breakdowns": [
                  "string"
                ],
                "booking_leg_stop_fare_breakdowns": [
                  {}
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
            "wait_list": "string",
            "remarks": [
              {
                "remark": "string",
                "date": "2022-08-23T11:13:34.780Z",
                "remark_by": {}
              }
            ],
            "contacts": [
              {
                "title": "string",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "fqtv_number": "string",
                "zip_code": "string",
                "address": "string",
                "addresses": [
                  "string"
                ],
                "phone": "string",
                "phones": [
                  "string"
                ]
              }
            ],
            "payments": [
              {
                "amount": 0,
                "date": "2022-08-23T11:13:34.780Z",
                "mode_of_payment": "string",
                "reference": "string",
                "currency": "string",
                "remarks": "string",
                "is_credit": true,
                "is_deleted": true
              }
            ],
            "booking_histories": [
              "string"
            ],
            "created_by": {},
            "updated_by": {},
            "ap_faxes": [
              "string"
            ],
            "expire_at": "2022-08-23T11:13:34.780Z",
            "booking_transactions": [
              "string"
            ]
          }
        console.log(booking);
        return new Promise((resolve, reject) => {
            // resolve(booking)
            // this._httpClient.post(environment.serverURL+'/api/bookings', booking)
            // this._httpClient.post(environment.serverURL+'/api/bookings', param)
            //     .subscribe(_booking => {
            //         console.log(_booking);
            //         // this.getBookings();
            //         // let booking = new Booking(_booking);
            //         resolve(_booking);
            //     });
        });
    }

    /**
     * Update booking
     *
     * @param booking
     * @returns {Promise<any>}
     */
    updateBooking(booking: { id: string; }): Promise<any>
    {
        // if(!booking.id){
        //     // notify
        //     return;
        // }
        // console.log('updating booking');
        return new Promise((resolve, reject) => {

            this._httpClient.patch(environment.serverURL+'/api/bookings/'+booking.id, booking)
                .subscribe(_booking => {
                    // this.getBookings();
                    let booking = new Booking(_booking);
                    resolve(booking);
                });
        });
    }

    /**
     * Create Tickets
     *
     * @param booking
     * @returns {Promise<any>}
     */
    createTickets(bookingId: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/generate_tickets/'+bookingId,{})
                .subscribe(booking => {
                    // console.log({booking});
                    // let booking = new Booking(_booking);
                    resolve(booking);
                });
        });
    }

    voidTickets(bookingId: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/void_tickets/'+bookingId,{})
                .subscribe(booking => {
                    resolve(booking);
                });
        });
    }

    openTickets(bookingId: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/open_tickets/'+bookingId,{})
                .subscribe(booking => {
                    resolve(booking);
                });
        });
    }

    changeFlight(bookingLegId,newBookingLeg): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/change_flight/'+bookingLegId,newBookingLeg)
                .subscribe(booking => {
                    resolve(booking);
                });
        });
    }

    
    addCashPayment(pnr: string,amount: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/cash-payment/'+pnr,{amount:amount})
                .subscribe(booking => {
                    // console.log({booking});
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(booking);
                });
        });
    }

    addBookingHold(pnr: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/hold-booking/'+pnr,{})
                .subscribe(booking => {
                    // console.log({booking});
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(booking);
                });
        });
    }

    getMyRecentBookings(){
        let email = this.aclService.getUsername();
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/bookings?created_by.email=' + email)
                    .subscribe((response: any) => {

                        let bookings = response['hydra:member'];
                        bookings = bookings.map((booking: any) => {
                            return new Booking(booking);
                        });
                        // this.onBookingsChanged.next(this.bookings);
                        resolve(bookings);
                    }, reject);
            }
        );
    }


    /**
     * Add Manual Fare
     *
     * @param data
     * @returns {Promise<any>}
     */
    addManualFare(bookingLegId: string,data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/manual-fare/'+bookingLegId, data)
                .subscribe(_booking => {
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(_booking);
                });
        });
    }

    sendEmailTicket(pnr: string,email: any): Promise<any>
    {
        console.log(pnr, email);
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/email-ticket/'+pnr, {email:email})
                .subscribe(_booking => {
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(_booking);
                });
        });
    }

    sendSmsTicket(pnr: string,phone: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.serverURL+'/api/sms-ticket/'+pnr, {phone:phone})
                .subscribe(_booking => {
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(_booking);
                });
        });
    }

    getPassengers(){
        return this._httpClient.get(environment.serverURL+'/api/passengers/')
              .pipe(map((res:any)=>{
                  return res
              }))
    }

    postPassenger(passengers: any){
        return this._httpClient.post(environment.serverURL+'/api/passengers/', passengers)
              .pipe(map((res:any)=>{
                  return res
              }))
    }
    updatePassenger(passenger: any, id: number){
        return this._httpClient.put(environment.serverURL+'/api/passengers/'+id, passenger)
              .pipe(map((res:any)=>{
                  return res
              }))
    }
    deletePassenger(id: number){
        return this._httpClient.delete(environment.serverURL+'/api/passengers/'+id)
              .pipe(map((res:any)=>{
                  return res
              }))
    }


    addPassengersToPNR(data: any) {
        if (data.valid) {
            data.value.passengers.forEach((passenger: { firstname: any; lastname: any; gender: any; dob: any; type: any; title: any; }) => {
                const {
                    firstname,
                    lastname,
                    gender,
                    dob,
                    type,
                    title,
                } = passenger;
                this.passengersInPNR.push(
                    new Passenger(firstname, lastname, gender, title, type, dob)
                );
            });
            this.passengersAdded.next(this.passengersInPNR);
        } else {
            // console.log({ errror: "Invalid Passenger Data" });
        }

        // console.log({ passengersInBAT: this.passengersInPNR });
    }

    addContactToPNR(data: any){
        // console.log(data)
        // this.contactsInPNR.push()
    }

    updatePassengersInPNR(data: { valid: any; value: { passengers: any[]; }; }) {
        if (data.valid) {
            this.passengersInPNR.splice(0, this.passengersInPNR.length);
            data.value.passengers.forEach((passenger: { firstname: any; lastname: any; gender: any; dob: any; type: any; title: any; }) => {
                const {
                    firstname,
                    lastname,
                    gender,
                    dob,
                    type,
                    title,
                } = passenger;
                this.passengersInPNR.push(
                    new Passenger(firstname, lastname, gender, title, type, dob)
                );
            });
            this.passengersAdded.next(this.passengersInPNR);
        } else {
            // console.log({ error: "Invalid Passenger Data" });
        }
    }

    getPassengersInPNR() {
        return this.passengersInPNR.slice();
    }
    getPaymentsInPNR() {
        return this.paymentsInPNR.slice();
    }

    getPNR() {
        return this.PNRToUpdate;
    }


    getPNRFromSearch2(pnr: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`${environment.serverURL}/api/bookings?record_locator=${pnr}`)
                .subscribe((response: any) => {
                    // console.log(response);
                    const _booking = response["hydra:member"][0];
                    let booking = new Booking(_booking);
                    // console.log({ booking });
                    // console.log(booking.recordLocator);
                    resolve(booking)
                });
        });
    }

    getPassengerFromPNRData(pnr: string): Observable<any>{
         const url = `${environment.serverURL}/api/bookings?record_locator=${pnr}`;
         return this._httpClient.get(url);
    }

    getPassengerFromPNR(pnr:string): Promise<any>{
            return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.serverURL}/api/bookings?record_locator=${pnr}`)
            .subscribe((resp: any)=> {
                console.log(resp);
                console.log(resp["hydra:member"][0]);
            });
        });
    }
    getPNRFromSearch(pnr: string) {
        // console.log({ pnr });
        this.PNRToUpdate = pnr;
        this.isEditingMode = true;
        this._httpClient
            .get(`${environment.serverURL}/api/bookings?record_locator=${pnr}`)
            .subscribe((response: any) => {
                const booking = response["hydra:member"][0];
                this.bookingInEditing = booking;
                this.bookingInEditingChanged.next(this.bookingInEditing);
                // console.log({ booking });
                this.passengersInPNR.splice(0, this.passengersInPNR.length);

                booking.passengers.forEach((passenger: { gender: any; first_name: any; last_name: any; title: any; passenger_type: any; date_of_birth: any; address: any; phone: any; email: any; id: any; }) => {
                    const {
                        gender,
                        first_name,
                        last_name,
                        title,
                        passenger_type,
                        date_of_birth,
                        address,
                        phone,
                        email,
                        id,
                    } = passenger;
                    const passengerType = this.passengerTypes[passenger_type];
                    const hasExtraDetails =
                        address || email || phone ? "expanded" : "collapsed";
                    const passengerToCreate = new Passenger(
                        first_name,
                        last_name,
                        gender,
                        title,
                        passengerType,
                        date_of_birth,
                        phone,
                        email,
                        id,
                        address,
                        hasExtraDetails
                    );
                    // console.log(passengerToCreate);

                    this.passengersInPNR.push(passengerToCreate);
                });
                this.passengersAdded.next(this.passengersInPNR);
                this.flightsInPNR = booking.booking_legs.map((bookingLeg: { flight: any; }) => {
                    return bookingLeg.flight;
                });
                this.flightsAdded.next(this.flightsInPNR);
                this.paymentsInPNR = booking.payments;
                this.paymentsAdded.next(this.paymentsInPNR);
            });
    }

    goToNextMatStep(): void {
        // this.toNextStep = true;
        this.continueToPassengerInformation.pipe().subscribe(res => this.toNextStep = res);
        // console.log('To Next step:', this.toNextStep );
        // stepperId.next();
    }


}
