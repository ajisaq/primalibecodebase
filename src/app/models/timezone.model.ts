import { isString, isObjectLike, toInteger } from 'lodash';

export class Timezone {
    iri?: string;
    iriType?: string;
    id?: number;
    abbr?: string;
    offsetValue?: number;
    name?: string;
    isdst?: boolean;
    description?: string;
    utc?: any[];
    // description?: string;


    /**
     * Constructor
     *
     * @param timezone
     */
    constructor(timezone?:any) {
        timezone = timezone || {};
        //if string, pass to iri only 
        if (isString(timezone)) {
            this.iri = timezone;
        }
        if (isObjectLike(timezone)) {
            this.iri = timezone['@id'] || null;
            this.iriType = timezone['@type'] || null;
            this.id = timezone.id || null;//FuseUtils.generateGUID();
            this.abbr = timezone.abbr || null;
            this.offsetValue = timezone.offset_value;
            this.name = timezone.name || null;
            this.isdst = timezone.isdst || false;
            this.description = timezone.description || null;
            this.utc = timezone.utc || [];

            // this.description = timezone.description || null;
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
