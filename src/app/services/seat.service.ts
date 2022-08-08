import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// import { FuseUtils } from '@fuse/utils';

import { Seat } from '../models/seat.model';
import { environment } from '../../environments/environment';
import { Dropdown } from '../models/dropdown.model';
// import { Paginator } from 'app/main/shared/pagination/paginator.model';

@Injectable()
export class SeatsService implements Resolve<any>
{
    onSeatsChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedSeatsChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    seats: Seat[]= [];
    // user: any;
    selectedSeats: number[] = [];

    searchText: string = '';
    filterBy: string = '';

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
        this.onSeatsChanged = new BehaviorSubject([]);
        this.onSelectedSeatsChanged = new BehaviorSubject([]);
        // this.onUserDataChanged = new BehaviorSubject([]);
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
                this.getSeats(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSeats();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSeats();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get seats
     *
     * @returns {Promise<any>}
     */
    getSeats(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(`${environment.serverURL}/api/seats${search}`)
                    .subscribe((response: any) => {

                        this.seats = response["hydra:member"];
                        // this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getSeats'));

                        console.log('seats',this.seats);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.seats = FuseUtils.filterArrayByString(this.seats, this.searchText);
                        // }

                        this.seats = this.seats.map(seat => {
                            return new Seat(seat);
                        });

                        this.onSeatsChanged.next(this.seats);
                        resolve(this.seats);
                    }, reject);
            }
        );
    }

    syncMercureUpdate(data: any){
        // console.log({data})
        let newSeat = new Seat(data);
        // console.log({newSeat});
        let foundIndex: any; 
        for (let i = 0; i < this.seats.length; i++) {
            const seat = this.seats[i];
            // console.log(seat.id,newSeat.id);
            if(seat.iri===newSeat.iri){
                foundIndex=i;
                // console.log(i,{seat});
                //
                console.log('updated', newSeat.iri);
                this.seats[i] = newSeat;
                this.onSeatsChanged.next(this.seats);
            }
            
        }

        // // console.log({foundIndex});
        // if(foundIndex){
        //     console.log('updated', newSeat.iri);
        //     this.seats[foundIndex] = newSeat;
        //     this.onSeatsChanged.next(this.seats);
        // }else{
        //     console.log('added New', newSeat.iri)
        //     this.seats.push(newSeat);
        //     this.onSeatsChanged.next(this.seats);
        // }
    }

    /**
     * Get seats
     *
     * @returns {Promise<any>}
     */
    

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
     * Select seats
     *
     * @param filterParameter
     * @param filterValue
     */
  

    /**
     * Update seat
     *
     * @param seat
     * @returns {Promise<any>}
     */
    updateSeat(seat: any): Promise<any>
    {
        console.log('updating seat');
        return new Promise((resolve, reject) => {

            this._httpClient.patch(environment.serverURL+'/api/seats/' + seat.id, {...seat})
                .subscribe(response => {
                    this.getSeats();
                    resolve(response);
                });
        });
    }

    /**
     * Create seat
     *
     * @param seat
     * @returns {Promise<any>}
     */
    createSeat(seat: any): Promise<any>
    {
        console.log('creating seat');
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.serverURL+'/api/seats', {...seat})
                .subscribe(response => {
                    this.getSeats();
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


  

}


@Injectable()
export class SeatsDropdownService implements Resolve<any>
{
    onSeatsDropdownChanged: BehaviorSubject<any>;

    seatsDropdown: Dropdown[] = [];

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
        this.onSeatsDropdownChanged = new BehaviorSubject([]);
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
                this.getSeatsDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event seat-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getSeatsDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get seats
     *
     * @returns {Promise<any>}
     */
    getSeatsDropdown(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get( environment.serverURL+'/api/seats/dropdown')
                    .subscribe((response: any) => {

                        const seatsDropdown = response["hydra:member"];

                        this.seatsDropdown = seatsDropdown.map((seat: any) => {
                            return new Dropdown(seat["@id"],new Seat(seat).getRowColumnName(), seat);
                        });

                        this.onSeatsDropdownChanged.next(this.seatsDropdown);
                        resolve(this.seatsDropdown);
                    }, reject);
            }
        );
    }
}
