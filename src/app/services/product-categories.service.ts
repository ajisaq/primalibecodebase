import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dropdown } from 'src/app/models/dropdown.model';
import { ProductCategory } from '../models/product-category.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductCategoriesService implements Resolve<any>
{
    productCategories: any[] = [];
    onProductCategoriesChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onProductCategoriesChanged = new BehaviorSubject({});
    }

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
                this.getProductCategories()
            ]).then(
                () => {
                    resolve(null);
                },
                reject
            );
        });
    }

    /**
     * Get ProductCategories
     *
     * @returns {Promise<any>}
     */
    getProductCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.serverURL + '/api/product_categories')
                .subscribe((response: any) => {
                    // console.log(response);
                    this.productCategories = response['hydra:member'];
                    this.productCategories = this.productCategories.map(productCategory => {
                        return new ProductCategory(productCategory);
                    });
                    this.onProductCategoriesChanged.next(this.productCategories);
                    resolve(response['hydra:member']);
                }, reject);
        });
    }

    /**
     * Delete productCategory
     *
     * @param productCategory
     * @returns {Promise<any>}
     */
     deleteProductCategory(productCategory: any): Promise<any> {


        let productCategoryId = productCategory;
        if (typeof productCategory === "object" && productCategory.id) {
            productCategoryId = productCategory.id;
        }
        return new Promise((resolve, reject) => {
            // console.log(productCategory);
            this._httpClient
                .delete(environment.serverURL + "/api/product_categories/" + productCategoryId)
                .subscribe((response) => {
                    this.getProductCategories();
                    resolve(response);
                });
        });
    }
}





@Injectable()
export class ProductCategoriesDropdownService implements Resolve<any>
{
    onProductCategoriesDropdownChanged: BehaviorSubject<any>;

    productCategoriesDropdown?: Dropdown[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onProductCategoriesDropdownChanged = new BehaviorSubject([]);
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
                this.getProductCategoriesDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getProductCategoriesDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get productCategories
     *
     * @returns {Promise<any>}
     */
    getProductCategoriesDropdown(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(environment.serverURL + '/api/product_categories/dropdown')
                .subscribe((response: any) => {

                    const productCategoriesDropdown = response["hydra:member"];

                    this.productCategoriesDropdown = productCategoriesDropdown.map((productCategory: any) => {
                        return new Dropdown(productCategory["@id"], productCategory.name, productCategory);
                    });

                    this.onProductCategoriesDropdownChanged.next(this.productCategoriesDropdown);
                    resolve(this.productCategoriesDropdown);
                }, reject);
        }
        );
    }
}

