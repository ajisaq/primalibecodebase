import { Country } from './country.model';
import { Timezone } from './timezone.model';
import { isString, isObjectLike } from 'lodash';

export class City {
    iri?: string;
    iriType?: string;
    id?: number;
    code?: string;
    name?: string;

    country?: Country; // relation object Country
    // municipal: string; // relation object City
    timezone: Timezone | undefined; // relation object TimeZone
    // additional parameters below:


    /**
     * Constructor
     *
     * @param city
     */
    constructor(city?:any) {
        city = city || {};
        //if string, pass to iri only 
        if (isString(city)) {
            this.iri = city;
        }
        if (isObjectLike(city)) {
            this.iri = city['@id'] || null;
            this.iriType = city['@type'] || null;
            this.id = city.id || null;//FuseUtils.generateGUID();
            this.name = city.name || null;
            this.code = city.code || null;
            this.country = new Country(city.country || {});
            this.timezone = new Timezone(city.timezone || {});
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

    //     if ( index >= 0 )
    //     {
    //         this.categories.splice(index, 1);
    //     }
    // }
}
