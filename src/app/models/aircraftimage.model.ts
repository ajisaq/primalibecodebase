import { AircraftType } from './aircraft-type.model';

export class AircraftImage
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    aircraftType: AircraftType;
    image: string;

    /**
     * Constructor
     *
     * @param aircraftImage
     */
    constructor(aircraftImage?:any)
    {
        aircraftImage           = aircraftImage || {};
        let iri = typeof aircraftImage ==='string' ? aircraftImage : null;
        let id = typeof aircraftImage ==='number' ? aircraftImage : null;
        
        this.iri            = aircraftImage["@id"] || iri;
        this.iriType        = aircraftImage["@type"] || null;
        this.id             = aircraftImage.id || id;
        this.name           = aircraftImage.name || null;
        this.image          = aircraftImage.image || '';
        this.aircraftType   = new AircraftType(aircraftImage.aircraft_type || {});
    }

}
