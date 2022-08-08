 import { MatChipInputEvent } from '@angular/material/chips';

import { isString, isObjectLike } from 'lodash';

export class PassengerType
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
     * @param passengerType
     */
    constructor(passengerType?:any)
    {
        passengerType = passengerType || {};
        //if string, pass to iri only 
        if (isString(passengerType)){
            this.iri = passengerType;
        }
        if (isObjectLike(passengerType)){
            this.iri = passengerType['@id'] || null;
            this.iriType = passengerType['@type'] || null;
            this.id = passengerType.id || null;//FuseUtils.generateGUID();
            this.name = passengerType.name || null;
            this.code = passengerType.code || null;
            this.description = passengerType.description || null;
        }
    }

}
