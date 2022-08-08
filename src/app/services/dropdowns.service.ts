import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Airport } from 'src/app/models/airports.model';
import { environment } from 'src/environments/environment';
import { Dropdown } from 'src/app/models/dropdown.model';


@Injectable()
export class AirportsDropdownService implements Resolve<any>
{
  private _url: string = "/assets/fake_db.json";

    onAirportsDropdownChanged: BehaviorSubject<any>;

    airportsDropdown: Dropdown[] = [];

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



@Injectable()
export class AgentTypesDropdownService implements Resolve<any>
{
    onAgentTypesDropdownChanged: BehaviorSubject<any>;

    agentTypesDropdown: Dropdown[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onAgentTypesDropdownChanged = new BehaviorSubject([]);
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
                this.getAgentTypesDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getAgentTypesDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get agentTypes
     *
     * @returns {Promise<any>}
     */
    getAgentTypesDropdown(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(environment.serverURL + '/api/agent_types/dropdown')
                .subscribe((response: any) => {

                    const agentTypesDropdown = response["hydra:member"];

                    this.agentTypesDropdown = agentTypesDropdown.map((agentType: any) => {
                        return new Dropdown(agentType["@id"], agentType.name, agentType);
                    });

                    this.onAgentTypesDropdownChanged.next(this.agentTypesDropdown);
                    resolve(this.agentTypesDropdown);
                }, reject);
        }
        );
    }
}


@Injectable()
export class PassengerTypesDropdownService implements Resolve<any>
{
    onPassengerTypesDropdownChanged: BehaviorSubject<any>;

    passengerTypesDropdown: Dropdown[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onPassengerTypesDropdownChanged = new BehaviorSubject([]);
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
                this.getPassengerTypesDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getPassengerTypesDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get passengerTypes
     *
     * @returns {Promise<any>}
     */
    getPassengerTypesDropdown(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(environment.serverURL + '/api/passenger_types/dropdown')
                .subscribe((response: any) => {

                    const passengerTypesDropdown = response["hydra:member"];

                    this.passengerTypesDropdown = passengerTypesDropdown.map((passengerType: any) => {
                        return new Dropdown(passengerType["@id"], passengerType.name, passengerType);
                    });

                    this.onPassengerTypesDropdownChanged.next(this.passengerTypesDropdown);
                    resolve(this.passengerTypesDropdown);
                }, reject);
        }
        );
    }
}

