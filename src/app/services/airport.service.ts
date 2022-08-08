import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Airport } from '../models/airports.model';
import { environment } from '../../environments/environment';
import { Dropdown } from '../models/dropdown.model';
import { Paginator } from '../models/paginator.model';

@Injectable()
export class AirportsService implements Resolve<any>
{
    onAirportsChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedAirportsChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    airports: Airport[];
    // user: any;
    selectedAirports: number[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onAirportsChanged = new BehaviorSubject([]);
        this.onSelectedAirportsChanged = new BehaviorSubject([]);
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getAirports(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getAirports();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getAirports();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get airports
     *
     * @returns {Promise<any>}
     */
    getAirports(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(`${environment.serverURL}/api/airports${search}`)
                    .subscribe((response: any) => {

                        this.airports = response['hydra:member'];
                        this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getAirports'));
                        
                        // this.airports = this.airports.map(airport => {
                        //     return new Airport(airport);
                        // });

                        console.log('airports',this.airports);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.airports = FuseUtils.filterArrayByString(this.airports, this.searchText);
                        // }

                    this.airports = this.airports.map(airport => {
                        return new Airport(airport);
                    });

                    this.onAirportsChanged.next(this.airports);
                    resolve(this.airports);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected airport by id
     *
     * @param id
     */
    toggleSelectedAirport(id): void {
        // First, check if we already have that airport as selected...
        if (this.selectedAirports.length > 0) {
            const index = this.selectedAirports.indexOf(id);

            if (index !== -1) {
                this.selectedAirports.splice(index, 1);

                // Trigger the next event
                this.onSelectedAirportsChanged.next(this.selectedAirports);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedAirports.push(id);

        // Trigger the next event
        this.onSelectedAirportsChanged.next(this.selectedAirports);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedAirports.length > 0) {
            this.deselectAirports();
        }
        else {
            this.selectAirports();
        }
    }

    /**
     * Select airports
     *
     * @param filterParameter
     * @param filterValue
     */
    selectAirports(filterParameter?, filterValue?): void {
        this.selectedAirports = [];

        // If there is no filter, select all airports
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedAirports = [];
            this.airports.map(airport => {
                this.selectedAirports.push(airport.id);
            });
        }

        // Trigger the next event
        this.onSelectedAirportsChanged.next(this.selectedAirports);
    }

    /**
     * create airport
     *
     * @param airport
     * @returns {Promise<any>}
     */
    createAirport(airport): Promise<any> {
        console.log('creating airport', airport);
        console.log({ ...airport });
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.serverURL}/api/airports`, airport)
                .subscribe(response => {
                    this.getAirports();
                    resolve(response);
                });
        });
    }

    /**
     * Update airport
     *
     * @param airport
     * @returns {Promise<any>}
     */
    updateAirport(airport): Promise<any> {
        console.log('updating airport', airport);
        return new Promise((resolve, reject) => {

            this._httpClient.patch(`${environment.serverURL}/api/airports/${airport.id}`, { ...airport })
                .subscribe(response => {
                    this.getAirports();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect airports
     */
    deselectAirports(): void {
        this.selectedAirports = [];

        // Trigger the next event
        this.onSelectedAirportsChanged.next(this.selectedAirports);
    }

    /**
     * Delete airport
     *
     * @param airport
     * @returns {Promise<any>}
     */
    deleteAirport(airport): Promise<any> {
        // const airportIndex = this.airports.indexOf(airport);
        // this.airports.splice(airportIndex, 1);

        let airportId = airport;
        if (typeof airport === 'object' && airport.id) {
            airportId = airport.id;
        }
        //////
        return new Promise((resolve, reject) => {
            console.log(airport);

            this._httpClient.delete(`${environment.serverURL}/api/airports/${airportId}`)
                .subscribe(response => {
                    this.getAirports();

                    // this.onAirportsChanged.next(this.airports);
                    resolve(response);
                });
        });
        //////
        // this.onAirportsChanged.next(this.airports);
    }

    /**
     * Delete selected airports
     */
    deleteSelectedAirports(): void {
        for (const airportId of this.selectedAirports) {
            // const airport = this.airports.find(_airport => {
            //     return _airport.id === airportId;
            // });
            // const airportIndex = this.airports.indexOf(airport);
            // this.airports.splice(airportIndex, 1);

            this.deleteAirport(airportId);
        }
        // this.onAirportsChanged.next(this.airports);
        this.deselectAirports();
    }

}




@Injectable()
export class AirportsDropdownService implements Resolve<any>
{
    onAirportsDropdownChanged: BehaviorSubject<any>;

    airportsDropdown: Dropdown[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onAirportsDropdownChanged = new BehaviorSubject([]);
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
                this.getAirportsDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getAirportsDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get airports
     *
     * @returns {Promise<any>}
     */
    getAirportsDropdown(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(`${environment.serverURL}/api/airports/dropdown`)
                .subscribe((response: any) => {

                    const  airportsDropdown = response["hydra:member"];
                    
                    this.airportsDropdown = airportsDropdown.map((airport: any) => {
                        return new Dropdown(airport["@id"], airport.name, airport);
                    });

                    this.onAirportsDropdownChanged.next(this.airportsDropdown);
                    resolve(this.airportsDropdown);
                }, reject);
        }
        );
    }
}

