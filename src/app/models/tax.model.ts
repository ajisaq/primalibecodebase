import { Operator } from "./fare.model";
import { Currency } from "./currency.model";
import { City } from "./city.model";
import { isObjectLike, isString } from 'lodash';

export class Tax {
    iri?: string;
    iriType?: string;
    id?: number;
    city?: City;
    currency?: Currency;
    name ?: string;
    code?: string;
    rate?: number;
    operator?: Operator;
    isFareTax?: boolean;
    isCityRestricted?: boolean;
    isProductTax?: boolean;
    isGlobalTax?: boolean;
    description?: string;

    /**
     * Constructor
     *
     * @param tax
     */
    constructor(tax?:any) {
        tax = tax || {};
        if (isString(tax)) {
            this.iri = tax;
        }
        if (isObjectLike(tax)) {
            this.iri = tax["@id"] || null;
            this.iriType = tax['@type'] || null;
            this.id = tax.id || null;
            this.city = new City(tax.city || {});
            this.currency = new Currency(tax.currency || {});
            this.name = tax.name || null;
            this.code = tax.code || null;
            this.rate = tax.rate || 0;
            this.operator = new Operator(tax.operator || {});
            this.isFareTax = tax.is_fare_tax || false;
            this.isProductTax = tax.is_product_tax || false;
            this.isCityRestricted = tax.is_city_restricted || false;
            this.isGlobalTax = tax.is_global_tax || false;
            this.description = tax.description || null;
        }
    }
}
