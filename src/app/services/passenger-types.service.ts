import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PassengerType } from 'src/app/models/fare.model';
import { Dropdown } from 'src/app/models/dropdown.model';

// @Injectable()
// export class PassengerTypesService implements Resolve<any>
// {
//     passengerTypes: any[];
//     onPassengerTypesChanged: BehaviorSubject<any>;

//     /**
//      * Constructor
//      *
//      * @param {HttpClient} _httpClient
//      */
//     constructor(
//         private _httpClient: HttpClient
//     ) {
//         // Set the defaults
//         this.onPassengerTypesChanged = new BehaviorSubject({});
//     }

//     /**
//      * Resolver
//      *
//      * @param {ActivatedRouteSnapshot} route
//      * @param {RouterStateSnapshot} state
//      * @returns {Observable<any> | Promise<any> | any}
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
//         return new Promise((resolve, reject) => {

//             Promise.all([
//                 this.getPassengerTypes()
//             ]).then(
//                 () => {
//                     resolve(null);
//                 },
//                 reject
//             );
//         });
//     }

//     /**
//      * Get PassengerTypes
//      *
//      * @returns {Promise<any>}
//      */
//     getPassengerTypes(): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this._httpClient.get(environment.serverURL + '/api/passenger_types')
//                 .subscribe((response: any) => {
//                     console.log(response);
//                     this.passengerTypes = response['hydra:member'];
//                     this.passengerTypes = this.passengerTypes.map(passengerType => {
//                         return new PassengerType(passengerType);
//                     });
//                     this.onPassengerTypesChanged.next(this.passengerTypes);
//                     resolve(response);
//                 }, reject);
//         });
//     }
// }




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

