import { isString, isObjectLike } from 'lodash';

export class CarrierType
{
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    //description?: string;

    /**
     * Constructor
     *
     * @param carrierType
     */
    constructor(carrierType?:any)
    {
        
        //if string, pass to iri only 
        // if (isString(carrierType)){
            this.iri = carrierType;
            // console.log(carrierType, this.iri);
        // }
        if (isObjectLike(carrierType)){
            carrierType     = carrierType || {};
            this.iri        = carrierType["@id"] || null;
            this.iriType    = carrierType["@type"] || null;
            this.id         = carrierType.id || null;
            this.name       = carrierType.name || null;
            //this.description = carrierType.description || '';
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
