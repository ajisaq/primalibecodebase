import { MatChipInputEvent } from '@angular/material/chips';

import { CarrierType } from './carrier-type.model';
import { isString, isObjectLike } from 'lodash';

export class Airline {
    iri: string;
    iriType: string;
    id: number;
    legalName: string;
    tradingName: string;
    iataCode: string;
    icaoCode: string;
    designatorCode: string;
    address: string;
    description: string;
    status: string;
    use3DigitCode: Boolean;
    carrierType: CarrierType;
    email: string;
    phone: string;
    pnrPrefix: string;
    rbds: any[];

    /**
     * Constructor
     *
     * @param airline
     */
    constructor(airline?:any) {
        let iri = typeof airline === 'string' ? airline : null;
        let id = typeof airline === 'number' ? airline : null;
        airline = airline || {};
        this.iri = airline["@id"] || iri;
        this.iriType = airline["@type"] || null;
        this.id = airline.id || id;
        this.icaoCode = airline.icao_code || null;
        this.iataCode = airline.iata_code || null;
        this.designatorCode = airline.designator_code || null;
        this.legalName = airline.legal_name || null;
        this.tradingName = airline.trading_name || null;
        this.use3DigitCode = airline.use3_digit_code || false;
        this.address = airline.address || null;
        this.status = airline.status || "Active";
        this.carrierType = new CarrierType(airline.carrier_type || {});
        this.description = airline.description || null;
        this.email = airline.email || null;
        this.phone = airline.phone || null;
        this.pnrPrefix = airline.pnr_prefix || null;
        this.rbds = airline.rbds || [];
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

export class Rbd {
    iri?: string;
    iriType?: string;
    id?: number;
    
    code?: string;

    /**
     * Constructor
     *
     * @param rbd
     */
    constructor(rbd?:any) {
        rbd = rbd || {};
        //if string, pass to iri only 
        if (isString(rbd)) {
            this.iri = rbd;
        }
        if (isObjectLike(rbd)) {
            this.iri = rbd instanceof Rbd ? rbd.iri : rbd['@id'] ? rbd['@id'] : '';
            this.iriType = rbd['@type'] || null;
            this.id = rbd.id || null;//Math.random(); // FuseUtils.generateGUID();
           
            this.code = rbd.code || null;
            
        }
    }

}