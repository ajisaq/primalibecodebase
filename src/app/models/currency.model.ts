import { MatChipInputEvent } from '@angular/material/chips';

import { isString, isObjectLike } from 'lodash';

export class Currency {
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string; //string(45)
    code?: string; //3 digits
    symbol?: string; //eg. $,£
    rate?: string; //double IATA Rate
    bsr?: number; //double Bank Selling Rate (in relation USD)
    isBaseCurrency?: boolean;
    // roundingMin: number;
    convertible?: boolean;
    // startDate: string;
    // endDate: string;
    // roundExcept: number;
    // roundFareTo: number;
    // roundTaxTo: number;
    decimals?: number;


    /**
     * Constructor
     *
     * @param currency
     */
    constructor(currency?:any) {
        currency = currency || {};
        if (isString(currency)) {
            this.iri = currency;
        }
        if (isObjectLike(currency)) {
            this.iri = currency['@id'] || null;
            this.iriType = currency['@type'] || null;
            this.id = currency.id || null;//FuseUtils.generateGUID();
            this.name = currency.name || null;
            this.code = currency.code || null;
            this.symbol = currency.symbol || null;
            this.rate = currency.rate || 0;
            this.bsr = currency.bsr || 0;
            this.isBaseCurrency = currency.is_base_currency || false;
            // this.roundingMin = currency.rounding_min || null;
            this.convertible = currency.convertible || false;
            // this.startDate = currency.start_date || null;
            // this.endDate = currency.end_date || null;
            // this.roundExcept = currency.round_except || null;
            // this.roundFareTo = currency.round_fare_to || null;
            // this.roundTaxTo = currency.round_tax_to || null;
            this.decimals = currency.decimals || 0;
        }
    }

    // /**
    //  * Add category
    //  *
    //  * @param {MatChipInputEvent} event
    //  */
    // addCategory(event: MatChipInputEvent): void
    // {
    //     const input = event.input;
    //     const value = event.value;

    //     // Add category
    //     if ( value )
    //     {
    //         this.categories.push(value);
    //     }

    //     // Reset the input value
    //     if ( input )
    //     {
    //         input.value = null;
    //     }
    // }

    // /**
    //  * Remove category
    //  *
    //  * @param category
    //  */
    // removeCategory(category): void
    // {
    //     const index = this.categories.indexOf(category);

    //     if ( index >= null )
    //     {
    //         this.categories.splice(index, 1);
    //     }
    // }
}
