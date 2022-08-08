import { ProductCategory } from './product-category.model';
import { Currency } from './currency.model';
import { Tax } from './tax.model';
import { isString, isObjectLike } from 'lodash';

export class Product {
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    code?: string; //4-letter product code
    // city?: string; //to delete
    productCategory?: ProductCategory;
    currency?: Currency;
    price?: number; //double
    taxes?: [];//double
    description?: string;
    isSelected?: boolean = false;

    /**
     * Constructor
     *
     * @param product
     */
    constructor(product?:any) {
        product = product || {};
        //if string, pass to iri only 
        if (isString(product)) {
            this.iri = product;
        }
        if (isObjectLike(product)) {
            this.iri = product instanceof Product ? product.iri : product['@id'] ? product['@id'] : '';
            this.iriType = product['@type'] || null;
            this.id = product.id || null;//Math.random(); // FuseUtils.generateGUID();
            this.name = product.name || null;
            this.code = product.code || null;
            // this.city = product.city || '';
            this.productCategory = new ProductCategory(product.product_category || {});
            this.currency = new Currency(product.currency || {});
            this.price = product.price || 0;
            this.taxes = product.taxes || [];
            this.description = product.description || null;
        }
    }

}
