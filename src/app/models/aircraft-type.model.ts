import { MatChipInputEvent } from '@angular/material/chips';

import { isString, isObjectLike } from 'lodash';

export class AircraftType
{
    iri?: string;
    iriType?: string;
    id?: string;
    brand?: string;
    model?: string;
    series?: string;

    /**
     * Constructor
     *
     * @param aircraftType
     */
    constructor(aircraftType?:any)
    {
        aircraftType = aircraftType || {};
        //if string, pass to iri only 
        if (isString(aircraftType)){
            this.iri = aircraftType;
        }
        if (isObjectLike(aircraftType)){
            this.iri = aircraftType["@id"] || null;
            this.iriType = aircraftType["@type"] || null;
            this.id = aircraftType.id || null;
            this.brand = aircraftType.brand || null;
            this.model = aircraftType.model || null;
            this.series = aircraftType.series || null;
        }
    }

    getLabel(): string {
        return `${this.brand} - ${this.model} - ${this.series}`
    }
}
