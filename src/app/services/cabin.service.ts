import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Cabin } from '../models/cabin.model';
import { Dropdown } from '../models/dropdown.model';
import { environment } from '../../environments/environment';

@Injectable()
export class CabinsService implements Resolve<any>
{
    onCabinsChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedCabinsChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    cabins: Cabin[] = [];
    // user: any;
    selectedCabins: number[] = [];

    searchText: string | undefined;
    filterBy: string | undefined;

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
        this.onCabinsChanged = new BehaviorSubject([]);
        this.onSelectedCabinsChanged = new BehaviorSubject([]);
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
                this.getCabins(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getCabins();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getCabins();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get cabins
     *
     * @returns {Promise<any>}
     */
    getCabins(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/cabins'+search)
                    .subscribe((response: any) => {

                        const cabins = response["hydra:member"];
                        // this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getCabins'));


                        this.cabins = cabins.map((cabin: any) => {
                            // return new Cabin(cabin);
                            //TODO: Server should return full image uri
                            //adding image source path + image name
                            let cabinObj = new Cabin(cabin);
                            // cabinObj.aircraftImage.image = `${environment.aircraftImagesPath}${cabinObj.aircraftImage.image}`;

                            return cabinObj;
                        });

                        this.onCabinsChanged.next(this.cabins);
                        resolve(this.cabins);
                    }, reject);
            }
        );
    }

    /**
     * Get cabin
     *
     * @returns {Promise<any>}
     */
    getCabin(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/cabins/' + id)
                    .subscribe((response: any) => {

                        // this.cabin = response;
                        const cabin = response;

                        console.log('cabin', cabin);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.cabins = FuseUtils.filterArrayByString(this.cabins, this.searchText);
                        // }

                        // this.cabins = this.cabins.map(cabin => {
                        //     return new Cabin(cabin);
                        // });

                        // this.onCabinsChanged.next(this.cabins);
                        resolve(cabin);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected cabin by id
     *
     * @param id
     */
    toggleSelectedCabin(id: any): void
    {
        // First, check if we already have that cabin as selected...
        if ( this.selectedCabins.length > 0 )
        {
            const index = this.selectedCabins.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedCabins.splice(index, 1);

                // Trigger the next event
                this.onSelectedCabinsChanged.next(this.selectedCabins);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedCabins.push(id);

        // Trigger the next event
        this.onSelectedCabinsChanged.next(this.selectedCabins);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedCabins.length > 0 )
        {
            this.deselectCabins();
        }
        else
        {
            this.selectCabins();
        }
    }

    /**
     * Select cabins
     *
     * @param filterParameter
     * @param filterValue
     */
    selectCabins(filterParameter?: undefined, filterValue?: undefined): void
    {
        this.selectedCabins = [];

        // If there is no filter, select all cabins
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedCabins = [];
            this.cabins.map(cabin => {
                this.selectedCabins.push(cabin.id);
            });
        }

        // Trigger the next event
        this.onSelectedCabinsChanged.next(this.selectedCabins);
    }

    /**
     * Update cabin
     *
     * @param cabin
     * @returns {Promise<any>}
     */
    updateCabin(cabin: any): Promise<any>
    {
        console.log('updating cabin');
        return new Promise((resolve, reject) => {

            this._httpClient.patch(environment.serverURL+'/api/cabins/' + cabin.id, {...cabin})
                .subscribe(response => {
                    this.getCabins();
                    resolve(response);
                });
        });
    }

    /**
     * Create cabin
     *
     * @param cabin
     * @returns {Promise<any>}
     */
    createCabin(cabin: any): Promise<any>
    {
        console.log('creating cabin');
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.serverURL+'/api/cabins', {...cabin})
                .subscribe(response => {
                    this.getCabins();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect cabins
     */
    deselectCabins(): void
    {
        this.selectedCabins = [];

        // Trigger the next event
        this.onSelectedCabinsChanged.next(this.selectedCabins);
    }

    /**
     * Delete cabin
     *
     * @param cabin
     * @returns {Promise<any>}
     */
    deleteCabin(cabin: any): Promise<any>
    {
        // const cabinIndex = this.cabins.indexOf(cabin);
        // this.cabins.splice(cabinIndex, 1);

        let cabinId = cabin;
        if ( typeof cabin === 'object' && cabin.id){
            cabinId = cabin.id;
        }
        //////
        return new Promise((resolve, reject) => {
            console.log(cabin);

            this._httpClient.delete(environment.serverURL+'/api/cabins/' + cabinId )
                .subscribe(response => {
                    this.getCabins();

                    // this.onCabinsChanged.next(this.cabins);
                    resolve(response);
                });
        });
                //////
        // this.onCabinsChanged.next(this.cabins);
    }

    /**
     * Delete selected cabins
     */
    deleteSelectedCabins(): void
    {
        for ( const cabinId of this.selectedCabins )
        {
            // const cabin = this.cabins.find(_cabin => {
            //     return _cabin.id === cabinId;
            // });
            // const cabinIndex = this.cabins.indexOf(cabin);
            // this.cabins.splice(cabinIndex, 1);

            this.deleteCabin(cabinId);
        }
        // this.onCabinsChanged.next(this.cabins);
        this.deselectCabins();
    }


}


@Injectable()
export class CabinsDropdownService implements Resolve<any>
{
    onCabinsDropdownChanged: BehaviorSubject<any>;

    cabinsDropdown: Dropdown[] = [];

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
        this.onCabinsDropdownChanged = new BehaviorSubject([]);
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
                this.getCabinsDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getCabinsDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get cabins
     *
     * @returns {Promise<any>}
     */
    getCabinsDropdown(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // const data = [
            //     {
            //       "@id": "/api/cabins/1",
            //       "@type": "http://schema.org/Thing",
            //       "id": 1,
            //       "name": "Boeing-737-cabin"
            //     },
            //     {
            //       "@id": "/api/cabins/2",
            //       "@type": "http://schema.org/Thing",
            //       "id": 2,
            //       "name": "Boeing-737-cabin"
            //     },
            //     {
            //       "@id": "/api/cabins/3",
            //       "@type": "http://schema.org/Thing",
            //       "id": 3,
            //       "name": "Boeing-737-cabin"
            //     }
            //   ];

            // this.cabinsDropdown = data.map(cabin => {
            //     return new Dropdown(cabin["@id"],cabin.name);
            // });

            // console.log('this.cabinsDropdown ', this.cabinsDropdown );
            // this.onCabinsDropdownChanged.next(this.cabinsDropdown);
            // resolve(this.cabinsDropdown);

                this._httpClient.get( environment.serverURL+'/api/cabins/dropdown')
                    .subscribe((response: any) => {

                        const cabinsDropdown = response["hydra:member"];

                        this.cabinsDropdown = cabinsDropdown.map((cabin: any) => {
                            console.log({cabin});
                            return new Dropdown(cabin["@id"],cabin.name,cabin);
                        });

                        this.onCabinsDropdownChanged.next(this.cabinsDropdown);
                        resolve(this.cabinsDropdown);
                    }, reject);
            }
        );
    }
}

