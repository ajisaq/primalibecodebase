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
        "/api/passenger_types/1": "Adult",
        "/api/passenger_types/2": "Child",
        "/api/passenger_types/3": "Infant",
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
        // console.log('adding booking');
        return new Promise((resolve, reject) => {

            // this._httpClient.post(environment.serverURL+'/api/bookings', booking)
            this._httpClient.post(environment.serverURL+'/api/create-booking', booking)
                .subscribe(_booking => {
                    // this.getBookings();
                    // let booking = new Booking(_booking);
                    resolve(_booking);
                });
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
                    console.log(response);
                    const _booking = response["hydra:member"][0];
                    let booking = new Booking(_booking);
                    console.log({ booking });
                    console.log(booking.recordLocator);
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
