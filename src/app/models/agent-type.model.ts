 import { MatChipInputEvent } from '@angular/material/chips';

import { isString, isObjectLike } from 'lodash';

export class AgentType
{
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    code?: string;
    description?: string;

    /**
     * Constructor
     *
     * @param agentType
     */
    constructor(agentType?:any)
    {
        agentType = agentType || {};
        //if string, pass to iri only 
        if (isString(agentType)){
            this.iri = agentType;
        }
        if (isObjectLike(agentType)){
            this.iri = agentType['@id'] || null;
            this.iriType = agentType['@type'] || null;
            this.id = agentType.id || null;//FuseUtils.generateGUID();
            this.name = agentType.name || null;
            this.code = agentType.code || null;
            this.description = agentType.description || null;
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
