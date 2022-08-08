import { AircraftImage } from './aircraftimage.model';
import { Seat } from './seat.model';

export class Cabin
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    capacity: string;
    ailes: number;
    ailesFormat: string;
    exits: number;
    hasDisplay: boolean;
    hasWifi: boolean;
    aircraftImage: AircraftImage;
    seats: Seat[];

    /**
     * Constructor
     *
     * @param cabin
     */
    constructor(cabin?:any)
    {
        let iri = typeof cabin ==='string' ? cabin : null;
        let id = typeof cabin ==='number' ? cabin : null;
        cabin           = cabin || {};
        this.iri        = cabin["@id"] || iri;
        this.iriType    = cabin["@type"] || null;
        this.id         = cabin.id || id;
        this.name       = cabin.name || null;
        this.capacity   = cabin.capacity || null;
        this.ailes      = cabin.ailes || 1;
        this.ailesFormat= cabin.ailes_format || null;
        this.exits      = cabin.exits || 1;
        this.hasDisplay = cabin.has_display || false;
        this.hasWifi    = cabin.has_wifi || false;
        this.aircraftImage = new AircraftImage(cabin.aircraft_image || {});
        this.seats    = cabin.seats ? cabin.seats.map((seat:any)=>new Seat(seat || {})) : [];
    }
}