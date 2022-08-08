import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { BookingCluster } from './../models/booking-cluster.model';
import { Dropdown } from './../models/dropdown.model';
import { environment } from '../../environments/environment';

@Injectable()
export class BookingClustersService implements Resolve<any>
{
    onBookingClustersChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedBookingClustersChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    bookingClusters: BookingCluster[] = [];
    // user: any;
    selectedBookingClusters: number[] = [];

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
        this.onBookingClustersChanged = new BehaviorSubject([]);
        this.onSelectedBookingClustersChanged = new BehaviorSubject([]);
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
                this.getBookingClusters(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getBookingClusters();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getBookingClusters();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get bookingClusters
     *
     * @returns {Promise<any>}
     */
    getBookingClusters(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(`${environment.serverURL}/api/booking_clusters${search}`)
                    .subscribe((response: any) => {

                        const bookingClusters = response["hydra:member"];
                        // this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getBookingClusters'));

                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.bookingClusters = FuseUtils.filterArrayByString(this.bookingClusters, this.searchText);
                        // }

                        this.bookingClusters = bookingClusters.map((bookingCluster: any) => {
                            return new BookingCluster(bookingCluster);
                        });

                        this.onBookingClustersChanged.next(this.bookingClusters);
                        resolve(this.bookingClusters);
                    }, reject);
            }
        );
    }

    /**
     * Get bookingCluster
     *
     * @returns {Promise<any>}
     */
    getBookingCluster(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(`${environment.serverURL}/api/booking_clusters/${id}`)
                    .subscribe((response: any) => {

                        // this.bookingCluster = response;
                        const bookingCluster = response["hydra:member"];

                        resolve(new BookingCluster(bookingCluster));
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected bookingCluster by id
     *
     * @param id
     */
    toggleSelectedBookingCluster(id: number): void
    {
        // First, check if we already have that bookingCluster as selected...
        if ( this.selectedBookingClusters.length > 0 )
        {
            const index = this.selectedBookingClusters.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedBookingClusters.splice(index, 1);

                // Trigger the next event
                this.onSelectedBookingClustersChanged.next(this.selectedBookingClusters);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedBookingClusters.push(id);

        // Trigger the next event
        this.onSelectedBookingClustersChanged.next(this.selectedBookingClusters);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedBookingClusters.length > 0 )
        {
            this.deselectBookingClusters();
        }
        else
        {
            this.selectBookingClusters();
        }
    }

    /**
     * Select bookingClusters
     *
     * @param filterParameter
     * @param filterValue
     */
    selectBookingClusters(filterParameter?: any, filterValue?:any): void
    {
        this.selectedBookingClusters = [];

        // If there is no filter, select all bookingClusters
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedBookingClusters = [];
            this.bookingClusters.map(bookingCluster => {
                this.selectedBookingClusters.push(bookingCluster.id);
            });
        }

        // Trigger the next event
        this.onSelectedBookingClustersChanged.next(this.selectedBookingClusters);
    }

    /**
     * Update bookingCluster
     *
     * @param bookingCluster
     * @returns {Promise<any>}
     */
    updateBookingCluster(bookingCluster:any): Promise<any>
    {
        // console.log('updating bookingCluster');
        return new Promise((resolve, reject) => {

            this._httpClient.patch(`${environment.serverURL}/api/booking_clusters/${bookingCluster.id}`, {...bookingCluster})
                .subscribe(response => {
                    this.getBookingClusters();
                    resolve(response);
                });
        });
    }

    /**
     * Create bookingCluster
     *
     * @param bookingCluster
     * @returns {Promise<any>}
     */
    createBookingCluster(bookingCluster:any): Promise<any>
    {
        // console.log('creating bookingCluster');
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.serverURL}/api/booking_clusters`, {...bookingCluster})
                .subscribe(response => {
                    this.getBookingClusters();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect bookingClusters
     */
    deselectBookingClusters(): void
    {
        this.selectedBookingClusters = [];

        // Trigger the next event
        this.onSelectedBookingClustersChanged.next(this.selectedBookingClusters);
    }

    /**
     * Delete bookingCluster
     *
     * @param bookingCluster
     * @returns {Promise<any>}
     */
    deleteBookingCluster(bookingCluster:any): Promise<any>
    {
        // const bookingClusterIndex = this.bookingClusters.indexOf(bookingCluster);
        // this.bookingClusters.splice(bookingClusterIndex, 1);

        let bookingClusterId = bookingCluster;
        if ( typeof bookingCluster === 'object' && bookingCluster.id){
            bookingClusterId = bookingCluster.id;
        }
        //////
        return new Promise((resolve, reject) => {
            // console.log(bookingCluster);

            this._httpClient.delete(`${environment.serverURL}/api/booking_clusters/${bookingClusterId}` )
                .subscribe(response => {
                    this.getBookingClusters();

                    // this.onBookingClustersChanged.next(this.bookingClusters);
                    resolve(response);
                });
        });
                //////
        // this.onBookingClustersChanged.next(this.bookingClusters);
    }

    /**
     * Delete selected bookingClusters
     */
    deleteSelectedBookingClusters(): void
    {
        for ( const bookingClusterId of this.selectedBookingClusters )
        {
            // const bookingCluster = this.bookingClusters.find(_bookingCluster => {
            //     return _bookingCluster.id === bookingClusterId;
            // });
            // const bookingClusterIndex = this.bookingClusters.indexOf(bookingCluster);
            // this.bookingClusters.splice(bookingClusterIndex, 1);

            this.deleteBookingCluster(bookingClusterId);
        }
        // this.onBookingClustersChanged.next(this.bookingClusters);
        this.deselectBookingClusters();
    }

}



@Injectable()
export class BookingClustersDropdownService implements Resolve<any>
{
    onBookingClustersDropdownChanged: BehaviorSubject<any>;

    bookingClustersDropdown: Dropdown[] = [];

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
        this.onBookingClustersDropdownChanged = new BehaviorSubject([]);
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
                this.getBookingClustersDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event booking-cluster-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getBookingClustersDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get bookingClusters
     *
     * @returns {Promise<any>}
     */
    getBookingClustersDropdown(): Promise<any>
    {
        return new Promise((resolve, reject) => {

                this._httpClient.get( `${environment.serverURL}/api/booking_clusters/dropdown`)
                    .subscribe((response: any) => {

                        const bookingClustersDropdown = response["hydra:member"];

                        this.bookingClustersDropdown = bookingClustersDropdown.map((bookingCluster:any) => {
                            return new Dropdown(bookingCluster["@id"],bookingCluster.name,bookingCluster);
                        });

                        this.onBookingClustersDropdownChanged.next(this.bookingClustersDropdown);
                        resolve(this.bookingClustersDropdown);
                    }, reject);
            }
        );
    }
}

