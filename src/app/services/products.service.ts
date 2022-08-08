import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


import { Product } from 'src/app/models/products.model';
import { environment } from 'src/environments/environment';
import { Dropdown } from 'src/app/models/dropdown.model';

@Injectable()
export class ProductsService implements Resolve<any>
{
    onProductsChanged: BehaviorSubject<any>;
    onPaginatorChanged: BehaviorSubject<any>=new BehaviorSubject(null);
    onSelectedProductsChanged: BehaviorSubject<any>;
    // onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    products: Product[] = [];
    // user: any;
    selectedProducts: number[] = [];

    searchText: string = '';
    filterBy: string = '';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onProductsChanged = new BehaviorSubject([]);
        this.onSelectedProductsChanged = new BehaviorSubject([]);
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
                this.getProducts(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getProducts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getProducts();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(search=''): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/products'+search)
                    .subscribe((response: any) => {

                        this.products = response['hydra:member'];
                        // this.onPaginatorChanged.next(new Paginator(response["hydra:view"], this, response["hydra:totalItems"],'getProducts'));
                        // this.products = this.products.map(product => {
                        //     return new Product(product);
                        // });

                        // console.log('products',this.products);
                        // .. search
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.products = FuseUtils.filterArrayByString(this.products, this.searchText);
                        // }

                    this.products = this.products.map(product => {
                        return new Product(product);
                    });

                    this.onProductsChanged.next(this.products);
                    resolve(this.products);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected product by id
     *
     * @param id
     */
    toggleSelectedProduct(id: any): void {
        // First, check if we already have that product as selected...
        if (this.selectedProducts.length > 0) {
            const index = this.selectedProducts.indexOf(id);

            if (index !== -1) {
                this.selectedProducts.splice(index, 1);

                // Trigger the next event
                this.onSelectedProductsChanged.next(this.selectedProducts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedProducts.push(id);

        // Trigger the next event
        this.onSelectedProductsChanged.next(this.selectedProducts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedProducts.length > 0) {
            this.deselectProducts();
        }
        else {
            this.selectProducts();
        }
    }

    /**
     * Select products
     *
     * @param filterParameter
     * @param filterValue
     */
    selectProducts(filterParameter?: any, filterValue?: any): void {
        this.selectedProducts = [];

        // If there is no filter, select all products
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedProducts = [];
            this.products.map((product: any) => {
                this.selectedProducts?.push(product.id);
            });
        }

        // Trigger the next event
        this.onSelectedProductsChanged.next(this.selectedProducts);
    }

    /**
     * create product
     *
     * @param product
     * @returns {Promise<any>}
     */
    createProduct(product: any): Promise<any> {
        // console.log('creating product', product);
        // console.log({ ...product });
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.serverURL + '/api/products', product)
                .subscribe(response => {
                    this.getProducts();
                    resolve(response);
                });
        });
    }

    /**
     * Update product
     *
     * @param product
     * @returns {Promise<any>}
     */
    updateProduct(product: any): Promise<any> {
        // console.log('updating product', product);
        return new Promise((resolve, reject) => {

            this._httpClient.patch(environment.serverURL + '/api/products/' + product.id, { ...product })
                .subscribe(response => {
                    this.getProducts();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect products
     */
    deselectProducts(): void {
        this.selectedProducts = [];

        // Trigger the next event
        this.onSelectedProductsChanged.next(this.selectedProducts);
    }

    /**
     * Delete product
     *
     * @param product
     * @returns {Promise<any>}
     */
    deleteProduct(product: any): Promise<any> {
        // const productIndex = this.products.indexOf(product);
        // this.products.splice(productIndex, 1);

        let productId = product;
        if (typeof product === 'object' && product.id) {
            productId = product.id;
        }
        //////
        return new Promise((resolve, reject) => {
            // console.log(product);

            this._httpClient.delete(environment.serverURL + '/api/products/' + productId)
                .subscribe(response => {
                    this.getProducts();

                    // this.onProductsChanged.next(this.products);
                    resolve(response);
                });
        });
        //////
        // this.onProductsChanged.next(this.products);
    }

    /**
     * Delete selected products
     */
    deleteSelectedProducts(): void {
        for (const productId of this.selectedProducts) {
            // const product = this.products.find(_product => {
            //     return _product.id === productId;
            // });
            // const productIndex = this.products.indexOf(product);
            // this.products.splice(productIndex, 1);

            this.deleteProduct(productId);
        }
        // this.onProductsChanged.next(this.products);
        this.deselectProducts();
    }

}




@Injectable()
export class ProductsDropdownService implements Resolve<any>
{
    onProductsDropdownChanged: BehaviorSubject<any>;

    productsDropdown: Dropdown[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onProductsDropdownChanged = new BehaviorSubject([]);
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
                this.getProductsDropdown(),
            ]).then(
                ([files]) => {

                    // TODO: try to check if Server sent Event cabin-class-updated socket
                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getProductsDropdown();
                    // });


                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProductsDropdown(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(environment.serverURL + '/api/products/dropdown')
                .subscribe((response: any) => {

                    const productsDropdown = response["hydra:member"];

                    this.productsDropdown = productsDropdown.map((product: any) => {
                        return new Dropdown(product["@id"], product.name, product);
                    });

                    this.onProductsDropdownChanged.next(this.productsDropdown);
                    resolve(this.productsDropdown);
                }, reject);
        }
        );
    }
}

