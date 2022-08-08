import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { CabinClass } from 'src/app/models/cabin-class.model';
import { Dropdown } from 'src/app/models/dropdown.model';
import { environment } from 'src/environments/environment';

// @Injectable()
// export class CabinClassesService implements Resolve<any>
// {
//     onCabinClassesChanged: BehaviorSubject<any>;
//     onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
//     onSelectedCabinClassesChanged: BehaviorSubject<any>;
//     // onUserDataChanged: BehaviorSubject<any>;
//     onSearchTextChanged: Subject<any>;
//     onFilterChanged: Subject<any>;

//     cabinClasses: CabinClass[] = [];
//     // user: any;
//     selectedCabinClasses: number[] = [];

//     searchText: string = '';
//     filterBy: string = '';

//     /**
//      * Constructor
//      *
//      * @param {HttpClient} _httpClient
//      */
//     constructor(
//         private _httpClient: HttpClient
//     )
//     {
//         // Set the defaults
//         this.onCabinClassesChanged = new BehaviorSubject([]);
//         this.onSelectedCabinClassesChanged = new BehaviorSubject([]);
//         // this.onUserDataChanged = new BehaviorSubject([]);
//         this.onSearchTextChanged = new Subject();
//         this.onFilterChanged = new Subject();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param {ActivatedRouteSnapshot} route
//      * @param {RouterStateSnapshot} state
//      * @returns {Observable<any> | Promise<any> | any}
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
//     {
//         return new Promise((resolve, reject) => {

//             Promise.all([
//                 this.getCabinClasses(),
//                 // this.getUserData()
//             ]).then(
//                 ([files]) => {

//                     this.onSearchTextChanged.subscribe(searchText => {
//                         this.searchText = searchText;
//                         this.getCabinClasses();
//                     });

//                     this.onFilterChanged.subscribe(filter => {
//                         this.filterBy = filter;
//                         this.getCabinClasses();
//                     });

//                     resolve(null);

//                 },
//                 reject
//             );
//         });
//     }

//     /**
//      * Get cabinClasses
//      *
//      * @returns {Promise<any>}
//      */
//     getCabinClasses(search=''): Promise<any>
//     {
//         return new Promise((resolve, reject) => {
//                 this._httpClient.get(`${environment.serverURL}/api/cabin_classes${search}`)
//                     .subscribe((response: any) => {

//                         const cabinClasses = response["hydra:member"];
//                         this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getCabinClasses'));

//                         this.cabinClasses = cabinClasses.map(cabinClass => {
//                             return new CabinClass(cabinClass);
//                         });

//                         this.onCabinClassesChanged.next(this.cabinClasses);
//                         resolve(this.cabinClasses);
//                     }, reject);
//             }
//         );
//     }

//     /**
//      * Get cabinClass
//      *
//      * @returns {Promise<any>}
//      */
//     getCabinClass(id: number): Promise<any>
//     {
//         return new Promise((resolve, reject) => {
//                 this._httpClient.get(`${environment.serverURL}/api/cabin_classes/${id}`)
//                     .subscribe((response: any) => {

//                         // this.cabinClass = response;
//                         const cabinClass = response["hydra:member"];
                 
//                         // this.onCabinClassesChanged.next(this.cabinClasses);
//                         resolve(new CabinClass(cabinClass));
//                     }, reject);
//             }
//         );
//     }

//     /**
//      * Toggle selected cabinClass by id
//      *
//      * @param id
//      */
//     toggleSelectedCabinClass(id): void
//     {
//         // First, check if we already have that cabinClass as selected...
//         if ( this.selectedCabinClasses.length > 0 )
//         {
//             const index = this.selectedCabinClasses.indexOf(id);

//             if ( index !== -1 )
//             {
//                 this.selectedCabinClasses.splice(index, 1);

//                 // Trigger the next event
//                 this.onSelectedCabinClassesChanged.next(this.selectedCabinClasses);

//                 // Return
//                 return;
//             }
//         }

//         // If we don't have it, push as selected
//         this.selectedCabinClasses.push(id);

//         // Trigger the next event
//         this.onSelectedCabinClassesChanged.next(this.selectedCabinClasses);
//     }

//     /**
//      * Toggle select all
//      */
//     toggleSelectAll(): void
//     {
//         if ( this.selectedCabinClasses.length > 0 )
//         {
//             this.deselectCabinClasses();
//         }
//         else
//         {
//             this.selectCabinClasses();
//         }
//     }

//     /**
//      * Select cabinClasses
//      *
//      * @param filterParameter
//      * @param filterValue
//      */
//     selectCabinClasses(filterParameter?, filterValue?): void
//     {
//         this.selectedCabinClasses = [];

//         // If there is no filter, select all cabinClasses
//         if ( filterParameter === undefined || filterValue === undefined )
//         {
//             this.selectedCabinClasses = [];
//             this.cabinClasses.map(cabinClass => {
//                 this.selectedCabinClasses.push(cabinClass.id);
//             });
//         }

//         // Trigger the next event
//         this.onSelectedCabinClassesChanged.next(this.selectedCabinClasses);
//     }

//     /**
//      * Update cabinClass
//      *
//      * @param cabinClass
//      * @returns {Promise<any>}
//      */
//     updateCabinClass(cabinClass): Promise<any>
//     {
//         console.log('updating cabinClass');
//         return new Promise((resolve, reject) => {

//             this._httpClient.patch(`${environment.serverURL}/api/cabin_classes/${cabinClass.id}`, {...cabinClass})
//                 .subscribe(response => {
//                     this.getCabinClasses();
//                     resolve(response);
//                 });
//         });
//     }

//     /**
//      * Create cabinClass
//      *
//      * @param cabinClass
//      * @returns {Promise<any>}
//      */
//     createCabinClass(cabinClass): Promise<any>
//     {
//         console.log('creating cabinClass');
//         return new Promise((resolve, reject) => {

//             this._httpClient.post(`${environment.serverURL}/api/cabin_classes`, {...cabinClass})
//                 .subscribe(response => {
//                     this.getCabinClasses();
//                     resolve(response);
//                 });
//         });
//     }

//     /**
//      * Deselect cabinClasses
//      */
//     deselectCabinClasses(): void
//     {
//         this.selectedCabinClasses = [];

//         // Trigger the next event
//         this.onSelectedCabinClassesChanged.next(this.selectedCabinClasses);
//     }

//     /**
//      * Delete cabinClass
//      *
//      * @param cabinClass
//      * @returns {Promise<any>}
//      */
//     deleteCabinClass(cabinClass): Promise<any>
//     {
//         // const cabinClassIndex = this.cabinClasses.indexOf(cabinClass);
//         // this.cabinClasses.splice(cabinClassIndex, 1);

//         let cabinClassId = cabinClass;
//         if ( typeof cabinClass === 'object' && cabinClass.id){
//             cabinClassId = cabinClass.id;
//         }
//         //////
//         return new Promise((resolve, reject) => {
//             console.log(cabinClass);

//             this._httpClient.delete(`${environment.serverURL}/api/cabin_classes/${cabinClassId}` )
//                 .subscribe(response => {
//                     this.getCabinClasses();

//                     // this.onCabinClassesChanged.next(this.cabinClasses);
//                     resolve(response);
//                 });
//         });
//                 //////
//         // this.onCabinClassesChanged.next(this.cabinClasses);
//     }

//     /**
//      * Delete selected cabinClasses
//      */
//     deleteSelectedCabinClasses(): void
//     {
//         for ( const cabinClassId of this.selectedCabinClasses )
//         {
//             // const cabinClass = this.cabinClasses.find(_cabinClass => {
//             //     return _cabinClass.id === cabinClassId;
//             // });
//             // const cabinClassIndex = this.cabinClasses.indexOf(cabinClass);
//             // this.cabinClasses.splice(cabinClassIndex, 1);

//             this.deleteCabinClass(cabinClassId);
//         }
//         // this.onCabinClassesChanged.next(this.cabinClasses);
//         this.deselectCabinClasses();
//     }

// }



@Injectable()
export class CabinClassesDropdownService implements Resolve<any>
{
    onCabinClassesDropdownChanged: BehaviorSubject<any>;

    cabinClassesDropdown: Dropdown[] = [];

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
        this.onCabinClassesDropdownChanged = new BehaviorSubject([]);
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
                this.getCabinClassesDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getCabinClassesDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get cabinClasses
     *
     * @returns {Promise<any>}
     */
    getCabinClassesDropdown(): Promise<any>
    {
        return new Promise((resolve, reject) => {

                this._httpClient.get( `${environment.serverURL}/api/cabin_classes/dropdown`)
                    .subscribe((response: any) => {

                        const cabinClassesDropdown = response["hydra:member"];

                        this.cabinClassesDropdown = cabinClassesDropdown.map((cabinClass:any) => {
                            return new Dropdown(cabinClass["@id"],cabinClass.name,cabinClass);
                        });

                        this.onCabinClassesDropdownChanged.next(this.cabinClassesDropdown);
                        resolve(this.cabinClassesDropdown);
                    }, reject);
            }
        );
    }
}

