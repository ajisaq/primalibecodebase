import { Component,  OnInit,  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {FlightSearchService} from '../../services/flightSearch.service'
import { SeatSelectionService } from '../../services/seat-selection.service';
import { DataSource } from '@angular/cdk/table';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Seat } from '../../models/seat.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cabin } from 'src/app/models/cabin.model';
import { ManageBookingService } from 'src/app/services/manage-booking.service';
import { BatService } from 'src/app/services/bat.service';
import { split } from 'lodash';

@Component({
    selector     : 'app-seat-selection',
    templateUrl  : './seat-selection.component.html',
    styleUrls    : ['./seat-selection.component.css']
})

export class SeatSelectionComponent implements OnInit{
    public PNR: any;
    objectKeys = Object.keys;
    cabin: any = new Cabin({});
    cabinForm: FormGroup;
    seatSelectionForm: FormGroup;
    indexedCabinSeats: any;
    allSeats: any[]=[];
    reservedSeats: any[]=[];
    blockedSeats: any[]=[];

    flight: any;
    // allSeats : any[];
    bs: any[] = [];
    es : any[] = [];
    // seats: Seat[]

    pnr: any;
    selectedSeat: any;
    selectedBookingLeg: any;

    bookingForm: FormGroup = new FormGroup({});
    booking: any;
    cabinByBookingLegs: any = {};

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flightSearchService: FlightSearchService,
        private _formBuilder: FormBuilder,
        private _manageBookingService: ManageBookingService,
        private batService: BatService
    ){
        this.seatSelectionForm = this.createSeatSelection();
        this.cabinForm = this.createCabinForm(this.cabin);
        
        this.batService.onBookingFormChanged.pipe().subscribe((bookingForm: FormGroup)=> {
            this.bookingForm = bookingForm;
            console.log('The booking form', bookingForm);
            this.booking = bookingForm.getRawValue();
            if(this.booking.bookingLegs.length > 0){
                this.generateCabinsByBookingLegs(this.booking);
            }
        });

        this.seatSelectionForm.valueChanges.subscribe(val => {
            console.log( 'new seat selected change',val );
            this.selectedSeat = val.seat;
            if (val.submit === true) {
                //submit seat selection
                this.onSave();

                this.seatSelectionForm.controls['submit'].patchValue(false, {emitEvent: true});
            }

        });

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void{
        console.log(this.route.snapshot.queryParams);
        this.route.paramMap.subscribe((params: any) => {
            this.PNR = params.params.pnr;
            this.flight = params.params.flightId;
            console.log(this.flight,this.PNR);
            if(this.PNR){this.batService.onResetOpenPNR.next(this.PNR);}
            //   this.seats = [];
            this.seatsOnFlight();
        
        })
        
        // this.flightSearchService.onCabinChanged
        // .pipe(takeUntil(this._unsubscribeAll))
        // .subscribe(cabin => {
        //     this.cabin = cabin;
        //     console.log('updated cabin:', this.cabin);
        //     this.cabinForm = this.createCabinForm(this.cabin ? this.cabin : new Cabin());
        
        //     });
        
        // this.flightSearchService.onSeatsOnImageChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((seatsOnImage: any[]) => {
        //         this.allSeats = seatsOnImage || [];
        //         console.log('all seats', this.allSeats);
        //         // this.getAvailableSeats();
        //     });
    }

    generateCabinsByBookingLegs(booking: any){
        let bookingLegs = booking.bookingLegs;
        bookingLegs.forEach((bookingLeg: any) => {
            this.cabinByBookingLegs[bookingLeg.id] = bookingLeg;
            let flightIri = (bookingLeg.flight.iri) ? bookingLeg.flight.iri : bookingLeg.flight;
            let flightIriSubs = flightIri.split('/');
            let flightId = flightIriSubs[flightIriSubs.length-1];
            this.flightSearchService.getSeatsOnFlight(flightId)
            .then((response: any)=>{
                // this.isLoading = false;
                console.log(response);
                this.cabin = response;
                this.cabinForm = this.createCabinForm(this.cabin);
                let allSeats = this.cabin.seats;
                this.cabinByBookingLegs[bookingLeg.id]['cabinForm'] = this.cabinForm;
                console.log(this.cabinByBookingLegs);
            })
            .catch(err=>{
                console.log(err)
            })
        });
    }

    seatsOnFlight(){
        this.flightSearchService.getSeatsOnFlight(this.flight)
            .then((resp: any)=>{
                // this.isLoading = false;
                console.log(resp);
    // CabinClass1 = economy
    // cabinclass2 = business
                // let bs = [];
                this.bs = resp.seats.map((seat: any) => {
                    // console.log(seat);
                    if(seat.cabinClass = '/api/cabin_classes/1'){
                        return seat;
                    }
                
            });
                            
            
            // console.log(this.allSeats);
        })
        .catch(err=>{
            console.log(err)
            // this.isLoading = false;
            //notify errs
        })

    }

    selectSeat(name: any){
        console.log('clicked! ', name)
    }

    onSave(): void {
        console.log('saving...');
        this._manageBookingService.createReservedSeats(this.selectedBookingLeg, this.seatSelectionForm.getRawValue());
    
    }

    /**
     * Create departure form
     *
     * @returns {FormGroup}
     */
     createSeatSelection(): FormGroup
     {
         return this._formBuilder.group({
             selectedPassenger: [],
             coupon      : [],
             seat        : [(this.pnr ? this.pnr.seat.seatIri : null)],
             submit      : [false],
         });
     }


    /**
     * Create cabin form
     *
     * @returns {FormGroup}
     */
     createCabinForm(cabin: Cabin): FormGroup
     {
         // return this._formBuilder.group(this.cabin);
         return this._formBuilder.group({
             id              : [cabin.id],
             name            : [cabin.name, [Validators.required]],
             capacity        : [cabin.capacity, [Validators.required]],
             ailes           : [cabin.ailes, [Validators.required]],
             ailesFormat     : [cabin.ailesFormat, [Validators.required]],
             exits           : [cabin.exits, [Validators.required]],
             has_display     : [cabin.hasDisplay],
             has_wifi        : [cabin.hasWifi],
             aircraft_image  : [cabin.aircraftImage, [Validators.required]],
             seats           : this.getSeatsFormArray(this.cabin.seats)
         });
     }
     
     getSeatsFormArray(seats:Seat[]){
         let resultArray = this._formBuilder.array([]) as FormArray;
         seats.forEach((seat) => {
             resultArray.push(
                 this._formBuilder.group({
                     id                  : [seat.id],
                     iri                  : [seat.iri],
                     name                : [seat.name, [Validators.required]],
                     seatRow             : [seat.seatRow, [Validators.required]],
                     seatColumn          : [seat.seatColumn, [Validators.required]],
                     isWindow            : [seat.isWindow],
                     hasExtraLegRoom     : [seat.hasExtraLegRoom],
                     isExitRow           : [seat.isExitRow],
                     isRearFacing        : [seat.isRearFacing],
                     isBlocked           : [seat.isBlocked],
                     isReserved          : [false], //shall be updated continuously as reservedSeats change
                     isWheelchair        : [seat.isWheelchair],
                     isPreferredSeating  : [seat.isPreferredSeating],
                     isSeatPaxToken      : [seat.isSeatPaxToken],
                     notes               : [seat.notes],
                     // cabin               : [seat.cabin.iri],
                     cabinClass          : [seat.cabinClass.iri, [Validators.required]],
                 })
             )
         });
         return resultArray;
     }
 

     selectPassenger(coupon: any, bookingLeg?: any){
        this.selectedBookingLeg = bookingLeg;
        let paxIri = `/api/passengers/${coupon.passenger.id}`;
        let couponIri = `/api/coupons/${coupon.id}`;
        this.seatSelectionForm.controls['selectedPassenger'].patchValue(paxIri, {emitEvent: false});
        this.seatSelectionForm.controls['coupon'].patchValue(couponIri, {emitEvent: false});
        console.log(paxIri, this.seatSelectionForm, this.cabinByBookingLegs);
     }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(false);
        this._unsubscribeAll.complete();
    }
}
