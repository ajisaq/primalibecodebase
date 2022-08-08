import { Cabin } from './cabin.model';
import { CabinClass } from './cabin-class.model';

export class Seat
{
    iri: string;
    iriType: string;
    id: number;
    seatRow: number;
    seatColumn: string;
    name: string;
    // features
    hasExtraLegRoom: boolean;
    isWindow: boolean;
    isExitRow: boolean;
    isRearFacing: boolean;
    isBlocked: boolean;
    isPreferredSeating: boolean;
    isWheelchair: boolean;
    isSeatPaxToken: boolean;
    notes: string;
    // relations
    cabin: Cabin;
    cabinClass: any;

    /**
     * Constructor
     *
     * @param seat
     */
    constructor(seat?:any)
    {
        seat                    = seat || {};

        let iri = typeof seat ==='string' ? seat : null;
        let id = typeof seat ==='number' ? seat : null;
        this.iri                = seat["@id"] || iri;
        this.iriType            = seat["@type"] || null;
        this.id                 = seat.id || id;
        this.name               = seat.seat_row+seat.seat_column || null;
        this.seatRow            = seat.seat_row || null;
        this.seatColumn         = seat.seat_column || null;
        // features
        this.hasExtraLegRoom    = seat.has_extra_leg_room || false;
        this.isWindow           = seat.is_window || false;
        this.isExitRow          = seat.is_exit_row || false;
        this.isRearFacing       = seat.is_rear_facing || false;
        this.isBlocked          = seat.is_blocked || false;
        this.isPreferredSeating = seat.is_preferred_seating || false;
        this.isWheelchair       = seat.is_wheelchair || false;
        this.isSeatPaxToken     = seat.is_seat_pax_token || false;
        this.notes              = seat.notes || null;
        //relationships
        this.cabin              = new Cabin(seat.cabin || {});
        this.cabinClass         = new CabinClass(seat.cabin_class || {});



    }

    public getRowColumnName(): string {
        return this.seatRow + this.seatColumn;
    }

}