import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// import { FuseUtils } from '@fuse/utils';

import { AircraftImage } from '../models/aircraftimage.model';
import { Dropdown } from '../models/dropdown.model';
import { environment } from '../../environments/environment';
// import { Paginator } from 'app/main/shared/pagination/paginator.model';

@Injectable()
export class AircraftImagesService implements Resolve<any>
{
    onAircraftImagesChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedAircraftImagesChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    aircraftImages: AircraftImage[] = [];
    // user: any;
    selectedAircraftImages: number[] = [];

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
        this.onAircraftImagesChanged = new BehaviorSubject([]);
        this.onSelectedAircraftImagesChanged = new BehaviorSubject([]);
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
                this.getAircraftImages(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getAircraftImages();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getAircraftImages();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get aircraftImages
     *
     * @returns {Promise<any>}
     */
    getAircraftImages(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(`${environment.serverURL}/api/aircraft_images${search}`)
                    .subscribe((response: any) => {

                        const  aircraftImages = response["hydra:member"];
                        // this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getAircraftImages'));
                        
                        // console.log('aircraftImages',aircraftImages);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.aircraftImages = FuseUtils.filterArrayByString(this.aircraftImages, this.searchText);
                        // }

                        // cabin.aircraftImage.image = `${environment.aircraftImagesPath}${cabin.aircraftImage.image}`;
                        this.aircraftImages = aircraftImages.map((aircraftImage: any) => {
                            return new AircraftImage(aircraftImage);
                        });

                        this.onAircraftImagesChanged.next(this.aircraftImages);
                        resolve(this.aircraftImages);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected aircraftImage by id
     *
     * @param id
     */
    toggleSelectedAircraftImage(id: any): void
    {
        // First, check if we already have that aircraftImage as selected...
        if ( this.selectedAircraftImages.length > 0 )
        {
            const index = this.selectedAircraftImages.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedAircraftImages.splice(index, 1);

                // Trigger the next event
                this.onSelectedAircraftImagesChanged.next(this.selectedAircraftImages);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedAircraftImages.push(id);

        // Trigger the next event
        this.onSelectedAircraftImagesChanged.next(this.selectedAircraftImages);
    }

    /**
     * Toggle select all
     */
    // toggleSelectAll(): void
    // {
    //     if ( this.selectedAircraftImages.length > 0 )
    //     {
    //         this.deselectAircraftImages();
    //     }
    //     else
    //     {
    //         this.selectAircraftImages();
    //     }
    // }

    /**
     * Select aircraftImages
     *
     * @param filterParameter
     * @param filterValue
     */
    selectAircraftImages(filterParameter: any, filterValue: any): void
    {
        this.selectedAircraftImages = [];

        // If there is no filter, select all aircraftImages
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedAircraftImages = [];
            this.aircraftImages.map(aircraftImage => {
                this.selectedAircraftImages.push(aircraftImage.id);
            });
        }

        // Trigger the next event
        this.onSelectedAircraftImagesChanged.next(this.selectedAircraftImages);
    }

    /**
     * Update aircraftImage
     *
     * @param aircraftImage
     * @returns {Promise<any>}
     */
    updateAircraftImage(aircraftImage: any): Promise<any>
    {
        console.log('updating aircraft image');
        return new Promise((resolve, reject) => {

            this._httpClient.patch(`${environment.serverURL}/api/aircraft_images/${aircraftImage.id}`, {...aircraftImage})
                .subscribe(response => {
                    this.getAircraftImages();
                    resolve(response);
                });
        });
    }

    /**
     * Create aircraftImage
     *
     * @param aircraftImage
     * @returns {Promise<any>}
     */
    createAircraftImage(aircraftImage: any): Promise<any>
    {
        console.log('creating aircraft images');
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.serverURL}/api/aircraft_images`, {...aircraftImage})
                .subscribe(response => {
                    this.getAircraftImages();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect aircraftImages
     */
    deselectAircraftImages(): void
    {
        this.selectedAircraftImages = [];

        // Trigger the next event
        this.onSelectedAircraftImagesChanged.next(this.selectedAircraftImages);
    }

    /**
     * Delete aircraftImage
     *
     * @param aircraftImage
     * @returns {Promise<any>}
     */
    deleteAircraftImage(aircraftImage: any): Promise<any>
    {
        // const aircraftImageIndex = this.aircraftImages.indexOf(aircraftImage);
        // this.aircraftImages.splice(aircraftImageIndex, 1);

        let aircraftImageId = aircraftImage;
        if ( typeof aircraftImage === 'object' && aircraftImage.id){
            aircraftImageId = aircraftImage.id;
        }
        //////
        return new Promise((resolve, reject) => {
            console.log(aircraftImage);

            this._httpClient.delete(`${environment.serverURL}/api/aircraft_images/${aircraftImageId}` )
                .subscribe(response => {
                    this.getAircraftImages();

                    // this.onAircraftImagesChanged.next(this.aircraftImages);
                    resolve(response);
                });
        });
                //////
        // this.onAircraftImagesChanged.next(this.aircraftImages);
    }

    /**
     * Delete selected aircraftImages
     */
    deleteSelectedAircraftImages(): void
    {
        for ( const aircraftImageId of this.selectedAircraftImages )
        {
            // const aircraftImage = this.aircraftImages.find(_aircraftImage => {
            //     return _aircraftImage.id === aircraftImageId;
            // });
            // const aircraftImageIndex = this.aircraftImages.indexOf(aircraftImage);
            // this.aircraftImages.splice(aircraftImageIndex, 1);

            this.deleteAircraftImage(aircraftImageId);
        }
        // this.onAircraftImagesChanged.next(this.aircraftImages);
        this.deselectAircraftImages();
    }

}



@Injectable()
export class AircraftImagesDropdownService implements Resolve<any>
{
    onAircraftImagesDropdownChanged: BehaviorSubject<any>;

    aircraftImagesDropdown: Dropdown[] = [];

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
        this.onAircraftImagesDropdownChanged = new BehaviorSubject([]);
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
                this.getAircraftImagesDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event aircraft-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getAircrafts();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get aircraftImages
     *
     * @returns {Promise<any>}
     */
    getAircraftImagesDropdown(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get( `${environment.serverURL}/api/aircraft_images/dropdown` )
                    .subscribe((response: any) => {

                        const  aircraftImagesDropdown = response["hydra:member"];

                        this.aircraftImagesDropdown = aircraftImagesDropdown.map((aircraftImage:any) => {
                            return new Dropdown(aircraftImage["@id"],aircraftImage.name,aircraftImage);
                        });

                        this.onAircraftImagesDropdownChanged.next(this.aircraftImagesDropdown);
                        resolve(this.aircraftImagesDropdown);
                    }, reject);
            }
        );
    }
}

