import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dropdown } from '../../../models/dropdown.model';
import { Flight } from '../../../models/flight.model';
import * as moment from 'moment';
import { AirportsDropdownService } from '../../../services/dropdowns.service';
import { CabinClassesDropdownService } from "../../../services/cabin-classes.service";
import { FlightSearchService } from "../../../services/flightSearch.service";
import { Router } from '@angular/router';
import { Fare } from "../../../models/fare.model";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BatService } from "../../../services/bat.service";
import { fuseAnimations } from 'src/@fuse/animations';

@Component({
    selector: 'app-new-flight-change',
  templateUrl: './new-flight-change.component.html',
  styleUrls: ['./new-flight-change.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fuseAnimations
],
    encapsulation: ViewEncapsulation.None
})

export class NewFlightChangeComponent implements OnInit, OnDestroy {
    action: string;
    dialogTitle: string = 'Change Flight';
    bookingForm: FormGroup;
    bookingLeg: any;
    newBookingLeg: any;
    airports: Dropdown[];
    countriesDropdown: Dropdown[];
    timezonesDropdown: Dropdown[];
    newSearchParams: any = {};
    flightSearchResults: Subscription;
    availableFlights = {};
    // filteredOptions: Observable<string[]>;
    flights: {} = {};
    tabIndex = 0;
    selectedSegment = 0;
    flightsDateRange = {};
    selectedDate = {};
    panelOpenState = false;
    // airports: Dropdown[];
    indexedAirports = {};
    cabinClassesDropdown: Dropdown[];
    passengerTypesDropdown: Dropdown[];
    indexedCabinClassesDropdown = {};
    indexedPassengerTypesDropdown = {};
    indexedPassengerTypesDropdownByCode = {};


    defaultColumnHeaders = ['route','time','date','flight','stop'];
    typeBColumnHeaders = ['route'];
    columnHeadersIndexed = {};

    flightSearchForm: FormGroup;

    flightSearchState = {};
    flightSearchStates = {
        0: "Search Flights",
        1: "Searching",
        2: "Flight Search Results",
    };

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<NewFlightChangeComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder,
     */
    constructor(
        public matDialogRef: MatDialogRef<NewFlightChangeComponent>,
        private cabinClassesDropdownService: CabinClassesDropdownService,
        private airportsDropdownService: AirportsDropdownService,
        private flightSearchService: FlightSearchService,
        private batService: BatService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private fb: FormBuilder,
        private router: Router,
    ) {
        // Set the defaults
        this.action = _data.action;

        this.bookingForm = _data.bookingForm;
        this.bookingLeg = _data.bookingLeg;
        // this.newBookingLeg = _data.bookingLeg.clone();
        // this.newBookingLeg.reset();


        this.flightSearchForm = this.fb.group({
            AD: [1,[Validators.required]],
            CH: [0,[]],
            IN: [0,[]],
            // currency: [""],
            segments: this.getSegmentSearchArray(),
        });
        
console.log(this.flightSearchForm.getRawValue());
        // this.scheduleForm = this.createAirportForm();

        this.newSearchParams.origin = this.flightSearchForm.getRawValue().segments[0].origin,
        this.newSearchParams.destination = this.flightSearchForm.getRawValue().segments[0].destination,
        this.newSearchParams.departureDate = this.flightSearchForm.getRawValue().segments[0].date.format('YYYY-MM-DD'),
        this.newSearchParams.adult = this.flightSearchForm.controls['AD'].value,
        this.newSearchParams.child = this.flightSearchForm.controls['CH'].value,
        this.newSearchParams.infant = this.flightSearchForm.controls['IN'].value
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.airportsDropdownService.onAirportsDropdownChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(airportsDropdown => {
                this.airports = airportsDropdown;
                this.airports.forEach(airport=>{
                    console.log(airport);
                    this.indexedAirports[airport.value]=airport;
                });
            });

        this.cabinClassesDropdownService.onCabinClassesDropdownChanged.subscribe((cabinClassesDropdown) => {
            this.cabinClassesDropdown = cabinClassesDropdown;
            this.cabinClassesDropdown.forEach(cabinClassDropdown=>{
                this.indexedCabinClassesDropdown[cabinClassDropdown.value]=cabinClassDropdown;
                console.log(444,this.indexedCabinClassesDropdown)
            });
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    getSegmentSearchArray(){
        let resultArray = this.fb.array([]);
        // debugger;
        // (<FormArray>this.bookingForm.get("bookingLegs")).controls.forEach((bookingLegForm: FormGroup) => {
            // let _flight: Flight = bookingLegForm.controls.flight.value;
            console.log(this.bookingLeg.flight);
            let _flight: Flight = this.bookingLeg.flight;
            // let _flight: Flight = this.bookingLeg.controls.flight.value;
            let _segment = new FormGroup({
                id: new FormControl(this.bookingLeg.id),
                origin: new FormControl({value:this.bookingLeg.flight.arrive_airport.id,disabled:true}),
                destination: new FormControl({value:this.bookingLeg.flight.depart_airport.id,disabled:true}),
                date: new FormControl(this.bookingLeg.flight.depart_date?moment(this.bookingLeg.flight.depart_date, 'YYYY-MM-DD\THH:mm:ssP'):moment()),
                // status: new FormControl(null),//???
                _chosenCC: new FormControl(null),
            });
            _segment.disable();
            _segment.controls['date'].enable();
            resultArray.push(_segment);
        // });
        return resultArray;
    }




    indexedClustersBySegByCCByCL = {};
    onSegmentSearch(segment: FormGroup, i: number) {
        // this.flightSearchState[i] = 1;
        console.log(segment);
        this.newSearchParams.origin = segment.controls['origin'].value,
        this.newSearchParams.destination = segment.controls['destination'].value,
        this.newSearchParams.departureDate = moment(segment.controls['date'].value).format('YYYY-MM-DD'),
        this.newSearchParams = {...this.newSearchParams}; // makes object pass property changes to input https://stackoverflow.com/questions/34796901/angular2-change-detection-ngonchanges-not-firing-for-nested-object
console.log(this.indexedAirports);
        // this.flightSearchService
        //     .segmentSearch(
        //         this.newSearchParams.origin = segment.controls['origin'].value,
        //         this.newSearchParams.destination = segment.controls['destination'].value,
        //         this.newSearchParams.departureDate = moment(segment.controls['date'].value).format('DD-MM-YY'),
        //         this.newSearchParams.adult = this.flightSearchForm.controls['AD'].value,
        //         this.newSearchParams.child = this.flightSearchForm.controls['CH'].value,
        //         this.newSearchParams.infant = this.flightSearchForm.controls['IN'].value
        //     )
        //     .then((response) => {
        //         this.flightSearchState[i] = 2;
        //         const data = response.data;
        //         const keys = response.keys;
        //         this.flights[i] = data;
        //         console.log(response);
        //         this.selectedDate[i] = segment.controls['date'].value.format('YYYY-MM-DD');
        //         this.availableFlights[i] = response.data;
        //         this.columnHeadersIndexed[i]=this.defaultColumnHeaders;
        //         this.columnHeadersIndexed[i]=this.typeBColumnHeaders;

        //         // data.forEach((datum)=>{
        //         //     this.availableSeats = datum.available_seats;
        //         //     this.fare = datum.cabin_prices;
        //         // })

        //         //exist
        //         Object.keys(keys.bookingClusters).forEach(code=>{
        //             let cluster = keys.bookingClusters[code];
        //             if(!this.indexedClustersBySegByCCByCL[i]){
        //                 this.indexedClustersBySegByCCByCL[i] = {};
        //             }
        //             if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class]){
        //                 if(!this.columnHeadersIndexed[i].includes(cluster.cabin_class)){
        //                     this.columnHeadersIndexed[i] .push(cluster.cabin_class);
        //                 }
        //                 this.indexedClustersBySegByCCByCL[i][cluster.cabin_class] = {};
        //             }
        //             if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]){
        //                 // this.columnHeadersIndexed[i].push(code);
        //                 this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code] = {};
        //             }
        //             this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]=cluster;
        //             console.log(this.flights,{data},this.indexedClustersBySegByCCByCL,this.columnHeadersIndexed);
        //             // console.log(cluster);
        //         })
        //         // console.log(this.flights,{data},this.indexedClustersBySegByCCByCL,this.columnHeadersIndexed);
        //         // this.bookingClasses = {data};

        //         console.log({data});
        //         console.log(this.flights);

        //         // if(!this.flightsDateRange[i]){
        //             this.flightsDateRange[i]={};
        //         // }

        //         let _mn = segment.controls['date'].value.clone();
        //         let _mx = segment.controls['date'].value.clone();
        //         let minDate = _mn.subtract(4, 'd').format('YYYY-MM-DD');;//moment(flight.depart_date).subtract(4, 'd').format('DD-MM-YYYY');
        //         let maxDate = _mx.add(2, 'd').format('YYYY-MM-DD');;//moment(flight.depart_date).add(2, 'd').format('DD-MM-YYYY');
                
        //         let thisDay = minDate;
        //         debugger;
        //         while (thisDay<=maxDate) {
        //             thisDay = moment(thisDay,'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD');
        //             if(!this.flightsDateRange[i][thisDay]){
        //                 this.flightsDateRange[i][thisDay]=[];
        //             }
        //         }
        //         debugger;

        //         data.map((flight)=>{
        //             let flightDate = moment(flight.depart_date).format('YYYY-MM-DD');
        //             this.flightsDateRange[i][flightDate].push(flight);
        //             console.log(this.flightsDateRange);
        //         });
        //         console.log(this.flightsDateRange,this.selectedDate,3333);
        //         debugger;
        //         console.log(this.indexedClustersBySegByCCByCL);
                
        //     })
        //     .catch((err) => {
        //         this.flightSearchState[i] = 0;
        //     });
    }
    chooseDay(day,i){
        this.selectedDate[i] = day;
        console.log(this.selectedDate[i]);
    }
    getDay(date){
        return moment(date,'YYYY-MM-DD').format('DD');
    }
    getMonth(date){
        return moment(date,'YYYY-MM-DD').format('MMM');
    }
    getCheapestFlight(arr){
        if(arr.length > 0) {
            return Math.min.apply(null, arr.map(item => item.adult_cost));
        }
    }

    countKeys(obj){
        return Object.keys(obj).length;
    }
    chooseFlight(segmentIndex,flight,flightCabin?,flightCluster?){
        console.log({segmentIndex,flight,flightCabin,flightCluster});

        this.newBookingLeg = this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0];
        this.tabIndex+=1;

        return;
        // debugger
        let bookingLegs = (<FormArray>this.bookingForm.get("bookingLegs"))
        
        console.log(bookingLegs);
        console.log(bookingLegs.controls[segmentIndex]);
        if(bookingLegs.controls[segmentIndex]){
            bookingLegs.controls[segmentIndex].patchValue(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0].value);
            // this.router.navigate(['/bat/passengers']);
        }else{
            bookingLegs.controls.push(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0]);
        }

        if((segmentIndex+1) < this.SegmentsFormArray.controls.length){
            this.selectedSegment+=1;
        }else{
            // this.router.navigate(['/bat/passengers']);
            this.tabIndex+=1;
        }
        // debugger

        // NEW DATA
        // {
        //     "flight": "/api/flights/2269",
        //     "fareDbrLeg": null,
        //     "cabinClass": "/api/cabin_classes/2",
        //     "bookingLegStops": [
        //         {
        //             "scheduleLeg": "/api/schedule_legs/44",
        //             "fareDbrLeg": "/api/fare_dbr_legs/415"
        //         }
        //     ]
        // }
    }

    chooseCabin(cIri,j){
        let foundForm = this.SegmentsFormArray.controls[j] as FormGroup;
        console.log(foundForm);
        foundForm.patchValue({_chosenCC: cIri},{emitEvent: true});
        foundForm.markAsDirty()
    }
    onChangeFlightClicked(){
        this.bookingLeg;
        debugger;
        this.batService.changeFlight(this.bookingLeg.id, this.newBookingLeg.getRawValue())
            .then(data=>{
                console.log(data);
            })
    }
    get SegmentsFormArray(): FormArray{
        return this.flightSearchForm.get('segments') as FormArray;
    }

    get BookingLegsFormArray(): FormArray{
        return this.bookingForm.get('bookingLegs') as FormArray;
    }

    getBookingLegsFormArray(flight?,flightCabin?,flightCluster?){
        // let bookingLegs = booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
        let resultArray = this.fb.array([]);
        // let bookingLeg = new BookingLeg(flight);
        // bookingLegs.forEach((bookingLeg: BookingLeg) => {
            let DA = this.indexedAirports[flight.depart_airport].extra.code;
            let AA = this.indexedAirports[flight.arrive_airport].extra.code;
            let pKey = `${DA}-${AA}`;
            let calc = flightCabin.calculated;
            let clusterCode = flightCluster;
            flight;flightCabin;flightCluster;
            // debugger;
            let rbdIndex = flightCabin.price_list[clusterCode].selectedIndex;
            let temp1 =    flightCabin.price_list[clusterCode].rbdList[rbdIndex]
            let isStopFare = temp1[pKey]?true:false;
            let fareStopSum={
                adultCost   : 0,
                totalPrice  : 0,
                totalTax    : 0,
                totalDiscount: 0,
                surcharge   : 0,
                totalCost   : 0,
            }

            if(!isStopFare){
                // todo: loop through and sum
                // let bookingLegStops = this.getBookingLegStopsFormArray(flight,flightCabin);
                Object.keys(temp1).forEach((stopIri: any)=>{
                  fareStopSum.adultCost += temp1[stopIri].adultCost; 
                  fareStopSum.totalPrice += temp1[stopIri].fareLegTotalPrice; 
                  fareStopSum.totalTax += temp1[stopIri].fareLegTotalTax; 
                  fareStopSum.totalDiscount += temp1[stopIri].fareLegTotalDiscount; 
                  //fareStopSum.surcharge += temp1[stopIri].adultSurcharge; 
                  fareStopSum.totalCost += temp1[stopIri].fareLegTotalCost; 
                })
            }

            // let fareTotals = this.getFareTotals();
            
            let fareDbrLeg = isStopFare?`/api/fare_dbr_legs/${temp1[pKey].legFareId}`: null;
            debugger
            resultArray.push(
                this.fb.group({
                    id:         [null],
                    // booking:  [bookingLeg.booking],
                    // flight  : [`/api/flights/${flight.id}`],//[new Flight(bookingLeg.flight).iri],
                    flight  : [new Flight(flight)], //TODO: to be changed to IRI before posting
                    fare    : [new Fare(flight.fare)],//[new Fare(bookingLeg.fare).iri],
                    fareDbrLeg  : [fareDbrLeg], //[new FareDbrLeg(bookingLeg.fareDbrLeg).iri],
                    bookingLegStops : this.getBookingLegStopsFormArray(flight,flightCabin,flightCluster), //[flight.stop_legs.map(bStop=>new BookingLeg(bStop).iri)],
                    bookingLegFare  : this.fb.group({
                        id:         [null],
                        // bookingLeg:  [bookingLegFare.bookingLeg],
                        // fareDbrLeg  : [isStopFare?`/api/fare_dbr_legs/${fareDbrLeg}`:null],
                        // adultCost   : [isStopFare?flightCabin.price_list[clusterCode][pKey].adult_cost:flightCabin.adult_cost], //?? flightCabin.adult_cost both conditions
                        // amount      : [isStopFare?flightCabin.price_list[clusterCode][pKey].price:flightCabin.price],
                        // tax         : [isStopFare?flightCabin.price_list[clusterCode][pKey].tax:flightCabin.tax],
                        bookingClass  : [isStopFare?clusterCode:null],
                        fareDbrLeg  : [fareDbrLeg],
                        // adultCost   : [isStopFare? flightCabin.adult_cost: Object.keys(temp1).reduce((a,b)=>temp1[a].adultCost+temp1[b].adultCost)], //?? flightCabin.adult_cost both conditions
                        // amount      : [isStopFare? flightCabin.price: Object.keys(temp1).reduce((a,b)=>temp1[a].adultPrice+temp1[b].adultPrice)],
                        // tax         : [isStopFare? flightCabin.tax: Object.keys(temp1).reduce((a,b)=>temp1[a].adultTax+temp1[b].adultTax)],
                        adultCost      : isStopFare? temp1[pKey].adultCost:fareStopSum.adultCost,
                        price          : isStopFare? temp1[pKey].fareLegTotalPrice:fareStopSum.totalPrice,
                        tax            : isStopFare? temp1[pKey].fareLegTotalTax:fareStopSum.totalTax,
                        discount       : isStopFare? temp1[pKey].fareLegTotalDiscount:fareStopSum.totalDiscount,
                        cost           : isStopFare? temp1[pKey].fareLegTotalCost:fareStopSum.totalCost,
                        // surcharge          : 0,
                    }),
                    //products:[],
                    // bookingLegProducts: this.fb.array([]),
                    charges : [[]], //[bookingLeg.charges],
                    isCheckedIn : [false], //[bookingLeg.isCheckedIn],
                    isBoarded   : [false], //[bookingLeg.isBoarded],
                    isNoShow    : [false], //[bookingLeg.isNoShow],
                    isDeleted   : [false], //[bookingLeg.isDeleted],
                    checkInX : [null], //[bookingLeg.checkIn],
                    isCancelled : [false], //[bookingLeg.isCancelled],
                    isOpen  : [true], //[bookingLeg.isOpen],
                    isWaitlisted    : [false], //[bookingLeg.isWaitlisted],
                    isTicketed  : [false], //[bookingLeg.isTicketed],
                    isStopFare  : [isStopFare],
                    cabinClass  : [`/api/cabin_classes/${flightCabin.id}`], //[new CabinClass(bookingLeg.cabinClass).iri],
                    ssrs    : [[]], //[bookingLeg.ssrs],
                    expireAt: [moment().add(24,'hours')],
                })
            )
            // debugger
        // });
        return resultArray;
    }

    getBookingLegStopsFormArray(flight,flightCabin,flightCluster){
        const stops = flight.stop_legs;
        const noOfPassengers = flight.no_of_passengers;

        flight
        flightCabin
        console.log(stops);
        // debugger;
        
        // let bookingLegs = booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
        let calc = flightCabin.calculated;
        let resultArray = this.fb.array([]);

        //singule
        let DA = this.indexedAirports[flight.depart_airport].extra.code;
        let AA = this.indexedAirports[flight.arrive_airport].extra.code;
        let pKey0 = `${DA}-${AA}`;


        let clusterCode = flightCluster;
        flight;flightCabin;flightCluster;
        // debugger;
        let rbdIndex = flightCabin.price_list[clusterCode].selectedIndex;
        let temp2 =    flightCabin.price_list[clusterCode].rbdList[rbdIndex]


        //stopFare
        if(temp2[pKey0]){
            let fdbrleg = temp2[pKey0].legFareId;

            // fareLegCost: 22900
            // fareLegTotalDiscount: 0
            // fareLegTotalPrice:
            resultArray.push(
                this.fb.group({
                    id:         [null],
                    // bookingLeg     : [], //BookingLeg;
                    scheduleLeg: [null],//stopIri], //ScheduleLeg;??flightLeg
                    noOfPassengers: [noOfPassengers],
                    fareDbrLeg  : [fdbrleg?`/api/fare_dbr_legs/${fdbrleg}`:null], //[new FareDbrLeg(bookingLeg.fareDbrLeg).iri],
                    bookingLegStopFare: this.fb.group({
                        id:         [null],
                        // bookingLegStop:  [bookingLegFare.bookingLegStop],
                        bookingClass  : [calc],//isNoneStopFare?calc:null],
                        fareDbrLeg  : [fdbrleg?`/api/fare_dbr_legs/${fdbrleg}`:null],//isNoneStopFare? `/api/fare_dbr_legs/${fareDbrLeg}`: null],
                        // adultCost   : [isNoneStopFare? flightCabin.price_list[calc][pKey].adultCost: ],
                        adultCost   : [temp2[pKey0].adultCost],
                        price       : [temp2[pKey0].fareLegTotalPrice],
                        tax         : [temp2[pKey0].fareLegTotalTax],
                        discount    : [temp2[pKey0].fareLegTotalDiscount],
                        cost        : [temp2[pKey0].fareLegTotalCost],
                        // surcharge      : [temp2[pKey0].surcharge],
                    }),
                })
            )

            return resultArray;
        }


        //endsingle



        //NonStop fare
        // let bookingLeg = new BookingLegStop();
        stops.forEach((stopIri: any) => {
            // let pKey = `${DA}-${AA}`;
            let pKey = stopIri;
            // debugger
            let isNoneStopFare = temp2[stopIri]?true:false;
            console.log('priceList',flightCabin.price_list,temp2[stopIri])
            // debugger
            let fareDbrLeg = isNoneStopFare?temp2[stopIri].legFareId: null;
            // let fareDbrLeg = null;
            resultArray.push(
                this.fb.group({
                    id:         [null],
                    // bookingLeg     : [], //BookingLeg;
                    scheduleLeg: [stopIri], //ScheduleLeg;??flightLeg
                    noOfPassengers: [noOfPassengers],
                    fareDbrLeg  : [isNoneStopFare? `/api/fare_dbr_legs/${fareDbrLeg}`:null], //[new FareDbrLeg(bookingLeg.fareDbrLeg).iri],
                    bookingLegStopFare: this.fb.group({
                        id:         [null],
                        // bookingLegStop:  [bookingLegFare.bookingLegStop],
                        bookingClass  : [isNoneStopFare?calc:null],
                        fareDbrLeg  : [isNoneStopFare? `/api/fare_dbr_legs/${fareDbrLeg}`: null],
                        // adultCost   : [isNoneStopFare? temp2.adultCost: ],
                        adultCost   : [temp2[stopIri].adultCost],
                        price       : [temp2[stopIri].fareLegTotalPrice],
                        tax         : [temp2[stopIri].fareLegTotalTax],
                        discount    : [temp2[stopIri].fareLegTotalDiscount],
                        cost        : [temp2[stopIri].fareLegTotalCost],
                        // surcharge   : [temp2[stopIri].surcharge],
                    }),
                })
            )
        });
        return resultArray;
    }

    getDbrLeftSeats(dbr,seg){

        let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
        let segForm =segmentsArray.controls[seg] as FormGroup;
        let depart = this.indexedAirports[segForm.controls['origin'].value].extra.code;
        let arrive = this.indexedAirports[segForm.controls['destination'].value].extra.code;
        if(dbr[`${depart}-${arrive}`]){
            return dbr[`${depart}-${arrive}`].seatsLeft;
        }

        //a non-stop fareDbrLeg
        let seatsLeft;
        Object.keys(dbr).forEach(key=>{
            seatsLeft = seatsLeft? dbr[key].seatsLeft<seatsLeft?dbr[key].seatsLeft:seatsLeft:dbr[key].seatsLeft;
        })
        return seatsLeft;
        console.log({dbr});
        return 'xx';
        dbr.value['ABV-KAN'].seatsLeft
    }
    getDbrListLeftSeats(dbr){
        
        console.log(dbr);
        // debugger;
    }

    getDbrAdultCost(dbr,seg){
        let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
        let segForm =segmentsArray.controls[seg] as FormGroup;
        let depart = this.indexedAirports[segForm.controls['origin'].value].extra.code;
        let arrive = this.indexedAirports[segForm.controls['destination'].value].extra.code;
        //stop fareDbrLeg
        if(dbr[`${depart}-${arrive}`]){
            return dbr[`${depart}-${arrive}`].adultCost;
        }

        //a non-stop fareDbrLeg
        let totalAdultCost = 0;
        Object.keys(dbr).forEach(key=>{
            totalAdultCost+= dbr[key].fareLegCost;
        })
        return totalAdultCost;
        console.log({dbr});
        return '00';
        dbr.value['ABV-KAN'].adultCost
    }

    ngOnDestroy(): void {
        // this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}



