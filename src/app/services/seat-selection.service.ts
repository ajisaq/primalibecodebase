import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// import { FuseUtils } from '@fuse/utils';

import { environment } from '../../environments/environment';
import * as moment from 'moment';

import { Seat } from '../models/seat.model';
import { Cabin } from '../models/cabin.model';
// import { ReservedSeat } from '../dcs.model';

@Injectable()
export class SeatSelectionService implements Resolve<any>
{
    onSeatsOnImageChanged: BehaviorSubject<any>;
    onCabinChanged: BehaviorSubject<any>;
    onSelectedSeatsChanged: BehaviorSubject<any>;
    onReservedSeatsChanged: BehaviorSubject<any>;
    onBlockedSeatsChanged: BehaviorSubject<any>;
    onAvailableSeatsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    seats: Seat[] = [];
    cabin!: Cabin ;
    reservedSeats!: any[];
    blockedSeats!: any[];
    selectedSeats: number[] = [];

    flightId!:number;

    searchText!: string;
    filterBy!: string;

    flightDate: any;
    flightNumber!: string;
    departureCity!: string;
    legs!: string[];
    flight: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onCabinChanged = new BehaviorSubject(new Cabin());
        this.onSeatsOnImageChanged = new BehaviorSubject([]);
        this.onSelectedSeatsChanged = new BehaviorSubject([]);
        this.onAvailableSeatsChanged = new BehaviorSubject([]);
        this.onReservedSeatsChanged = new BehaviorSubject([]);
        this.onBlockedSeatsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                
                // this.flightId ? this.getSeats(this.flightId) : console.log('no flight selected'),
                
                // this.getReservedSeatsByLeg()
            ]).then(
                ([files]) => {


                    resolve(this.seats);

                },
                reject
            );
        });
    }


    /**
     * Get seats from a flight aircraft cabin
     *
     * @returns {Promise<any>}
     */
    getSeats(flightId: any): Promise<any>
    {
        console.log('pax flight', flightId);
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/flights/'+flightId+'/seats')
                    .subscribe((response: any) => {

                        this.cabin = new Cabin(response.schedule.aircraft.cabin);
                        let seats = response.schedule.aircraft.cabin.seats;

                        console.log('cabin',this.cabin);
                        console.log('seats',this.seats);
                        // this.urlFilterParams();
                        // .. search
                        if ( this.searchText && this.searchText !== '' )
                        {
                            // seats = FuseUtils.filterArrayByString(seats, this.searchText);
                        }

                        this.seats = seats.map((seat: any) => {
                            return new Seat(seat);
                        });

                        this.onCabinChanged.next(this.cabin);
                        this.onSeatsOnImageChanged.next(this.seats);
                        resolve(this.cabin);
                    }, reject);
            }
        );
    }

    //
        // /**
        //  * Get seats
        //  *
        //  * @returns {Promise<any>}
        //  */
        // getAllSeatsFromDB(): Promise<any>
        // {
        //     return new Promise((resolve, reject) => {
        //             this._httpClient.get(environment.serverURL+'/api/seats')
        //                 .subscribe((response: any) => {

        //                     this.seats = response['hydra:member'];

        //                     console.log('seats',this.seats);
        //                     // .. search
        //                     if ( this.searchText && this.searchText !== '' )
        //                     {
        //                         this.seats = FuseUtils.filterArrayByString(this.seats, this.searchText);
        //                     }

        //                     this.seats = this.seats.map(seat => {
        //                         return new Seat(seat);
        //                     });

        //                     this.onSeatsOnImageChanged.next(this.seats);
        //                     resolve(this.seats);
        //                 }, reject);
        //         }
        //     );
        // }

        
        // /**
        //  * Get seats
        //  *
        //  * @returns {Promise<any>}
        //  */
        // getReservedSeats(): Promise<any>
        // {
        //     return new Promise((resolve, reject) => {
        //             this._httpClient.get(environment.serverURL+'/api/reserved_seats')
        //                 .subscribe((response: any) => {

        //                     this.reservedSeats = response['hydra:member'];
        //                     // this.reservedSeats = [];

        //                     console.log('reserved seats',this.reservedSeats);
        //                     // .. search
        //                     // if ( this.searchText && this.searchText !== '' )
        //                     // {
        //                     //     this.seats = FuseUtils.filterArrayByString(this.seats, this.searchText);
        //                     // }

        //                     // this.reservedSeats = this.reservedSeats.map(seat => {
        //                     //     return new ReservedSeat(seat);
        //                     // });

        //                     // console.log('reserved seats',this.reservedSeats);

        //                     this.onReservedSeatsChanged.next(this.reservedSeats);
        //                     resolve(this.reservedSeats);
        //                 }, reject);
        //         }
        //     );
        // }

        // urlFilterParams() {
        //     //if choose to use booking legs manifest endpoint. serealise all params
        //     let filterParam = '?';
        //     console.log(filterParam);
        //     console.log('c', this.departureCity, this.flightNumber, this.flightDate);
        //     if(this.legs && this.legs!==[]){
        //         this.legs.forEach(element => {
        //             filterParam += 'schedule_leg[]='+encodeURIComponent(element)+'&';
        //         });
        //     }
        //     // if(this.departureCity){
        //     //     filterParam += 'flight.depart_airport='+encodeURIComponent(this.departureCity)+'&';
        //     // }
        //     if(this.flightNumber && this.flightNumber != ''){
        //         filterParam += 'flight.flight_number='+encodeURIComponent(this.flightNumber)+'&';
        //     }if(this.flightDate && this.flightDate != ''){
        //         let newDateObj = moment(this.flightDate).add(1, 'd').format('YYYY-MM-DD\THH:mm:ss+01:00');
        //         // console.log('new date', newDateObj);
        //         filterParam += encodeURIComponent('flight.depart_day[before]')+'='+encodeURIComponent(newDateObj)+'&';
        //         filterParam += encodeURIComponent('flight.depart_day[after]')+'='+encodeURIComponent(this.flightDate);
        //     }
            
        //     let scheduleLeg = '';
        //     // this.legs.forEach(element => {
        //     //     scheduleLeg += 'schedule_leg[]='+element+'&';
        //     // });
        //     // this.legs.map(x=>{
        //     //     filterParam += x;
        //     // });
        //     filterParam += scheduleLeg;
        //     console.log(filterParam);
            
        //     return filterParam;
        // }
    
    /**
     * Get reserved seats by flight and leg
     * returns and array of flight_legs
     *
     * @returns {Promise<any>}
     */
    getReservedSeatsByLeg(urlFilterParams?: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/flight_legs'+urlFilterParams)
                    .subscribe((response: any) => {

                        let flightLegs = response['hydra:member'];
                        console.log('response',flightLegs);
                        
                        this.reservedSeats = [];
                        this.blockedSeats = [];

                        // option 3
                        let joinedReserved = [];
                        let joinedBlocked = [];
                        flightLegs.forEach((element: any) => {
                            
                            const rs = element.reserved_seats;
                            const bs = element.blocked_seats;
                            joinedReserved = joinedReserved.concat(rs);
                            joinedBlocked = joinedBlocked.concat(bs);
                            console.log('joined',joinedReserved, joinedBlocked);
                        });
                        // removing duplicates
                        var obj = {};
                        for (var i=0, len=joinedReserved.length; i < len; i++ )
                            obj[joinedReserved[i]['seat']] = joinedReserved[i];
                        this.reservedSeats = new Array();
                        for ( var key in obj )
                            this.reservedSeats.push(obj[key]);
                        
                        var blockedObj = {};
                        for (var i=0, len=joinedBlocked.length; i < len; i++ )
                            blockedObj[joinedBlocked[i]['seat_name']] = joinedBlocked[i];
                        this.blockedSeats = new Array();
                        for ( var key in blockedObj )
                            this.blockedSeats.push(blockedObj[key]);
                        
                        console.log('reserved seats',this.reservedSeats, this.blockedSeats);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.seats = FuseUtils.filterArrayByString(this.seats, this.searchText);
                        // }

                        this.reservedSeats = this.reservedSeats.map(seat => {
                            // return new ReservedSeat(seat);
                        });
                        this.blockedSeats = this.blockedSeats.map(seat => {
                            return new Seat(seat);
                        });

                        // console.log('reserved seats',this.reservedSeats);

                        this.onReservedSeatsChanged.next(this.reservedSeats);
                        this.onBlockedSeatsChanged.next(this.blockedSeats);
                        resolve(this.reservedSeats);
                    }, reject);
            }
        );
    }

    //     
        // /**
        //  * Get reserved seats by flightLeg
        //  * filter on flight entity endpoint using flightLeg.scheduleLeg
        //  * returns array of flights
        //  *
        //  * @returns {Promise<any>}
        //  */
        // getReservedSeatsByFlightLeg(flightDate, flightNumber, scheduleLegId): Promise<any>
        // {
        //     return new Promise((resolve, reject) => {
        //             this._httpClient.get(environment.serverURL+'/api/flights?'+'flight_leg_schedule_leg='+scheduleLegId+'&flight_number='+flightNumber+'&depart_date'+flightDate)
        //                 .subscribe((response: any) => {

        //                     let flightLegs = response['hydra:member'];
                            
        //                     this.reservedSeats = [];

        //                     flightLegs.map(flightLeg => {
        //                         let rs = flightLeg.reserved_seats;
        //                         console.log('rs',rs, 'fleg', flightLeg);
        //                         rs.map(reservedSeat => {
        //                             console.log(reservedSeat, 'exist?',this.reservedSeats.some(reservedSeat));
        //                             if(!this.reservedSeats.some(reservedSeat)){
        //                                 this.reservedSeats.push(reservedSeat);
        //                             }
        //                         })
        //                     })

        //                     console.log('reserved seats',this.reservedSeats);
        //                     // .. search
        //                     // if ( this.searchText && this.searchText !== '' )
        //                     // {
        //                     //     this.seats = FuseUtils.filterArrayByString(this.seats, this.searchText);
        //                     // }

        //                     // this.reservedSeats = this.reservedSeats.map(seat => {
        //                     //     return new ReservedSeat(seat);
        //                     // });

        //                     // console.log('reserved seats',this.reservedSeats);

        //                     this.onReservedSeatsChanged.next(this.reservedSeats);
        //                     resolve(this.reservedSeats);
        //                 }, reject);
        //         }
        //     );
        // }


    /**
     * Toggle selected seat by id
     *
     * @param id
     */
    toggleSelectedSeat(id: any): void
    {
        // First, check if we already have that seat as selected...
        if ( this.selectedSeats.length > 0 )
        {
            const index = this.selectedSeats.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSeats.splice(index, 1);

                // Trigger the next event
                this.onSelectedSeatsChanged.next(this.selectedSeats);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSeats.push(id);

        // Trigger the next event
        this.onSelectedSeatsChanged.next(this.selectedSeats);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSeats.length > 0 )
        {
            this.deselectSeats();
        }
        else
        {
            this.selectSeats();
        }
    }

    /**
     * Select seats
     *
     * @param filterParameter
     * @param filterValue
     */
    selectSeats(filterParameter?: any, filterValue?: any): void
    {
        this.selectedSeats = [];

        // If there is no filter, select all seats
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSeats = [];
            this.seats.map(seat => {
                this.selectedSeats.push(seat.id);
            });
        }

        // Trigger the next event
        this.onSelectedSeatsChanged.next(this.selectedSeats);
    }

    /**
     * Update seat
     *
     * @param seat
     * @returns {Promise<any>}
     */
    updateSeat(reservedSeat: any): Promise<any>
    {
        console.log('updating seat');
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.serverURL+'/api/reserved_seats/' + reservedSeat.id, {...reservedSeat})
                .subscribe(response => {
                    this.getSeats(this.flightId);
                    resolve(response);
                });
        });
    }

    /**
     * Deselect seats
     */
    deselectSeats(): void
    {
        this.selectedSeats = [];

        // Trigger the next event
        this.onSelectedSeatsChanged.next(this.selectedSeats);
    }

    /**
     * Delete seat
     *
     * @param seat
     * @returns {Promise<any>}
     */
    deleteSeat(reservedSeat: any): Promise<any>
    {
        // const seatIndex = this.seats.indexOf(seat);
        // this.seats.splice(seatIndex, 1);

        let reservedSeatId = reservedSeat;
        if ( typeof reservedSeat === 'object' && reservedSeat.id){
            reservedSeatId = reservedSeat.id;
        }
        //////
        return new Promise((resolve, reject) => {
            console.log(reservedSeat);

            this._httpClient.delete(environment.serverURL+'/api/reserved_seats/' + reservedSeatId )
                .subscribe(response => {
                    this.getSeats(this.flightId);

                    // this.onSeatsOnImageChanged.next(this.seats);
                    resolve(response);
                });
        });
                //////
        // this.onSeatsOnImageChanged.next(this.seats);
    }

    /**
     * Delete selected seats
     */
    deleteSelectedSeats(): void
    {
        for ( const seatId of this.selectedSeats )
        {
            // const seat = this.seats.find(_seat => {
            //     return _seat.id === seatId;
            // });
            // const seatIndex = this.seats.indexOf(seat);
            // this.seats.splice(seatIndex, 1);

            this.deleteSeat(seatId);
        }
        // this.onSeatsOnImageChanged.next(this.seats);
        this.deselectSeats();
    }

}


