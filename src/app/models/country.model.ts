import { Currency } from './currency.model';
import { isString, isObject, isObjectLike } from 'lodash';

export class Country
{
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    code?: string;
    unCode?: string;
    currency?: Currency;

    /**
     * Constructor
     *
     * @param country
     */
    constructor(country?:any)
    {
        country = country || {};
        //if string, pass to iri only 
        if (isString(country)){
            this.iri = country;
        }
        if (isObjectLike(country)){
            this.iri = country['@id'] || null;
            this.iriType = country['@type'] || null;
            this.id = country.id || null;//FuseUtils.generateGUID();
            this.name = country.name || null;
            this.code = country.code || null;
            this.unCode = country.un_code || null;
            this.currency = new Currency(country.currency || {});
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
    //         input.value = '';
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

    //     if ( index >= 0 )
    //     {
    //         this.categories.splice(index, 1);
    //     }
    // }
}
