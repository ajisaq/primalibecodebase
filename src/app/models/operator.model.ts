 import { MatChipInputEvent } from '@angular/material/chips';

import { isString, isObjectLike } from 'lodash';

export class Operator
{
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    sign?: string;
    description?: string;

    /**
     * Constructor
     *
     * @param operator
     */
    constructor(operator?:any)
    {
        operator = operator || {};
        //if string, pass to iri only 
        if (isString(operator)){
            this.iri = operator;
        }
        if (isObjectLike(operator)){
            this.iri = operator['@id'] || null;
            this.iriType = operator['@type'] || null;
            this.id = operator.id || null;//FuseUtils.generateGUID();
            this.name = operator.name || null;
            this.sign = operator.sign || null;
            this.description = operator.description || null;
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
