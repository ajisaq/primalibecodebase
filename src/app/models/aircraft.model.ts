import { AircraftType } from './aircraft-type.model';
import { Cabin } from './cabin.model';

export class Aircraft
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    tailNo: string;
    aircraftType: AircraftType;
    cabin: Cabin;
    description: string;

    /**
     * Constructor
     *
     * @param aircraft
     */
    constructor(aircraft?:any)
    {
        let iri = typeof aircraft ==='string' ? aircraft : null;
        let id = typeof aircraft ==='number' ? aircraft : null;
        aircraft = aircraft || {};
        this.iri = aircraft["@id"] || iri;
        this.iriType = aircraft["@type"] || null;
        this.id = aircraft.id || id;
        this.name = aircraft.name || null;
        this.tailNo = aircraft.tail_no || null;
        this.aircraftType = new AircraftType(aircraft.aircraft_type || {});
        this.cabin = new Cabin(aircraft.cabin || {});
        this.description = aircraft.description || null;
    }

}
