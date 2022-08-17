import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AirportsDropdownService } from "src/app/services/dropdowns.service";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';
import { FlightSearchService } from "src/app/services/flightSearch.service";
import { ActivatedRoute } from '@angular/router';
import { Flight } from "src/app/models/flight.model";
import { Fare } from "src/app/models/fare.model";
import { CabinClassesDropdownService } from "src/app/services/cabin-classes.service";
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as moment from 'moment';
import { PassengerTypesDropdownService } from "src/app/services/passenger-types.service";
import { Dropdown } from "src/app/models/dropdown.model";
import { BatService } from "src/app/services/bat.service";


@Component({
    selector: "app-flights",
    templateUrl: "./flights.component.html",
    styleUrls: ["./flights.component.scss"],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class FlightsComponent implements OnInit {

    @Output() onIgnorePNRClicked = new EventEmitter();
    flightSearchResults?: Subscription;
    // filteredOptions: Observable<string[]>;
    flights: any = {};
    panelOpenState = false;
    airports: Dropdown[] = [];
    availableFlights: any = {};
    indexedAirports: any = {};
    cabinClassesDropdown: Dropdown[] = [];
    passengerTypesDropdown: Dropdown[] = [];
    indexedCabinClassesDropdown: any = {};
    indexedPassengerTypesDropdown: any = {};
    indexedPassengerTypesDropdownByCode: any = {};
    airport: any;
    pnr: string = "";
    // fare: any;
    flightSearchState: any = {};
    segments: any[] = [];
    flightSearchStates: any = {
        0: "Search Flights",
        1: "Searching",
        2: "Flight Search Results",
    };
    segmentSearchParams: {
        index?: number;
        originCityName?: string;
        destinationCityName?: string;
        date?: string;
    } = {};

    flightSearchForm: FormGroup = new FormGroup({});

    fsForm?: FormGroup;
    currencies: any[] = [];

    // statuses: FsStatus[] = [
    //     { value: "confirmed", viewValue: "Confirmed" },
    //     { value: "overbooked", viewValue: "Overbooked" },
    //     { value: "waitlist", viewValue: "Waitlist" },
    //     { value: "open", viewValue: "Open" },
    //     { value: "passive", viewValue: "Passive" },
    // ];

    defaultColumnHeaders: string[] = ['route','time','date','flight','stop'];
    typeBColumnHeaders: string[] = ['route'];
    columnHeadersIndexed: any[] = [];

    bookingForm: FormGroup  = new FormGroup({});
    bookingClasses: any;

    
    // constructor(private formControl: FormControl) {
    //     // this.flightSearchForm = this.fsForm;
    // }
    constructor(
        private _airportsDropdownService: AirportsDropdownService,
        private cabinClassesDropdownService: CabinClassesDropdownService,
        private passengerTypesDropdownService: PassengerTypesDropdownService,
        // private _currenciesDropdownService: CurrenciesDropdownService,
        private flightSearchService: FlightSearchService,
        private batService: BatService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        // // this.activatedRoute.paramMap
        // //     .pipe(map(() =>window.history.state))
        // //     .subscribe((state:any)=>{
        // //         this.bookingForm = state.bookingForm || {};
        // //         console.log(99,state,this.bookingForm);
        // //     })
        // this.batService.onBookingFormChanged
        //     .subscribe((bookingForm:FormGroup)=>{
        //         this.bookingForm = bookingForm;
        //         // this.bookingForm.
        //         // console.log('got bookingForm',{bookingForm});
        //         // debugger;
        //         this.prepareUI();
        //     });

        // this.flightSearchResults =
        // this._currenciesDropdownService.onCurrenciesDropdownChanged.subscribe(
        //     (currencies) => {
        //         this.currencies = currencies;
        //     }
        // );
        this._airportsDropdownService.onAirportsDropdownChanged.subscribe((airportsDropdown) => {
            // console.log(airportsDropdown);
            this.airports = airportsDropdown;
            // console.log(this.airports)
            this.airports.forEach(airport=>{
                this.indexedAirports[airport.value]=airport;
            });
        });
        this.cabinClassesDropdownService.onCabinClassesDropdownChanged.subscribe((cabinClassesDropdown) => {
            this.cabinClassesDropdown = cabinClassesDropdown;
            this.cabinClassesDropdown.forEach(cabinClassDropdown=>{
                this.indexedCabinClassesDropdown[cabinClassDropdown.value]=cabinClassDropdown;
            });
        });
        this.passengerTypesDropdownService.onPassengerTypesDropdownChanged.subscribe((passengerTypesDropdown) => {
            this.passengerTypesDropdown = passengerTypesDropdown;
            this.passengerTypesDropdown.forEach(passengerTypeDropdown=>{
                this.indexedPassengerTypesDropdown[passengerTypeDropdown.value]=passengerTypeDropdown;
                this.indexedPassengerTypesDropdownByCode[passengerTypeDropdown.extra.code]=passengerTypeDropdown;
            });
        });
        // this.flightSearchForm = new FormGroup({
        //     paxNo: new FormControl(""),
        //     currency: new FormControl(""),
        //     segments: new FormArray([]),
        // });
        this.flightSearchForm = this.fb.group({
            AD: [1,[Validators.required]],
            CH: [0,[]],
            IN: [0,[]],
            // currency: [""],
            // segments: this.getSegmentSearchArray(),
            origin: [null],
            destination: [null],
            date: [moment()],
            // status: new FormControl(null),//???
            _chosenCC: new FormControl(null),
        });

    }


    // onCancelFlight(){
    //     this.batService.openTickets(this.bookingForm.controls['id'].value)
    //         .then(result=>{
    //             this.batService.onResetOpenPNR.next(result.PNR);
    //         })
    // }


    indexedClustersBySegByCCByCL: any[] = [];
    onSegmentSearch(segment: FormGroup, i: number) {
        this.segmentSearchParams.index = i;
        this.flightSearchState[i] = 1;
        const { date, destination, origin } = segment.value;
        // debugger;
        this.segmentSearchParams.originCityName = this.indexedAirports[origin].extra.city.name;
        this.segmentSearchParams.destinationCityName = this.indexedAirports[destination].extra.city.name;
        // console.log({ ddate, dmonth, dyear });

        let AD = this.flightSearchForm.value.AD;
        let CH = this.flightSearchForm.value.CH;
        let IN = this.flightSearchForm.value.IN;

        this.segmentSearchParams.date = date.format('DD-MM-YYYY')
        this.flightSearchService
            .segmentSearch(
                this.indexedAirports[origin].extra.id,
                this.indexedAirports[destination].extra.id,
                date.format('DD-MM-YYYY'),
                AD,
                CH,
                IN,
                
            )
            .then((response) => {
                this.flightSearchState[i] = 2;
                const data = response.data;
                const keys = response.keys;
                this.flights[i] = data;
                // console.log(response);
                this.availableFlights[i] = response.data;
                this.columnHeadersIndexed[i]=this.defaultColumnHeaders;
                this.columnHeadersIndexed[i]=this.typeBColumnHeaders;

                // data.forEach((datum)=>{
                //     this.availableSeats = datum.available_seats;
                //     this.fare = datum.cabin_prices;
                // })

                //exist
                Object.keys(keys.bookingClusters).forEach(code=>{
                    let cluster = keys.bookingClusters[code];
                    if(!this.indexedClustersBySegByCCByCL[i]){
                        this.indexedClustersBySegByCCByCL[i] = {};
                    }
                    if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class]){
                        this.columnHeadersIndexed[i].push(cluster.cabin_class);
                        this.indexedClustersBySegByCCByCL[i][cluster.cabin_class] = {};
                    }
                    if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]){
                        // this.columnHeadersIndexed[i].push(code);
                        this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code] = {};
                    }
                    this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]=cluster;
                    // console.log(this.flights,{data},this.indexedClustersBySegByCCByCL,this.columnHeadersIndexed);
                    // console.log(cluster);
                })
                // console.log(this.flights,{data},this.indexedClustersBySegByCCByCL,this.columnHeadersIndexed);
                // this.bookingClasses = {data};

                
                // console.log({data});
                // console.log(this.flights);
                // console.log(this.indexedClustersBySegByCCByCL);
                
            })
            .catch((err) => {
                this.flightSearchState[i] = 0;
            });
    }
    countKeys(obj: any){
        return Object.keys(obj).length;
    }
    chooseFlight(segmentIndex: any,flight: any,flightCabin?: any,flightCluster?: any){
        // console.log({segmentIndex,flight,flightCabin,flightCluster});
        // debugger
        let bookingLegs = this.bookingForm.get('bookingLegs') as FormArray;
        if(bookingLegs.controls[segmentIndex]){
            bookingLegs.controls[segmentIndex].patchValue(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0].value);
        }else{
            bookingLegs.controls.push(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0]);
            // this.router.navigate(['/bat/passengers']);
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

    chooseCabin(cIri: any,j: any){
        let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
        let foundForm = segmentsArray.controls[j] as FormGroup;
        // console.log(foundForm);
        foundForm.patchValue({_chosenCC: cIri},{emitEvent: true});
        foundForm.markAsDirty()
        // console.log({segmentsArray});
    }


    get BookingLegsFormArray(): FormArray{
        return this.bookingForm.get('bookingLegs') as FormArray;
    }

    getBookingLegsFormArray(flight?: any,flightCabin?: any,flightCluster?: any){
        // let bookingLegs = booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
        let resultArray = this.fb.array([]) as FormArray;
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
            // debugger
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
                })
            )
            // debugger
        // });
        return resultArray;
    }

    getBookingLegStopsFormArray(flight: any,flightCabin: any,flightCluster: any){
        const stops = flight.stop_legs;
        const noOfPassengers = flight.no_of_passengers;

        flight
        flightCabin
        // console.log(stops);
        // debugger;
        
        // let bookingLegs = booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
        let calc = flightCabin.calculated;
        let resultArray = this.fb.array([]) as FormArray;

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
            // console.log('priceList',flightCabin.price_list,temp2[stopIri])
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

    getDbrLeftSeats(dbr: any,seg: any){

        let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
        let segForm =segmentsArray.controls[seg] as FormGroup;
        let depart = this.indexedAirports[segForm.controls['origin'].value].extra.code;
        let arrive = this.indexedAirports[segForm.controls['destination'].value].extra.code;
        if(dbr[`${depart}-${arrive}`]){
            return dbr[`${depart}-${arrive}`].seatsLeft;
        }

        //a non-stop fareDbrLeg
        let seatsLeft: any;
        Object.keys(dbr).forEach(key=>{
            seatsLeft = seatsLeft? dbr[key].seatsLeft<seatsLeft?dbr[key].seatsLeft:seatsLeft:dbr[key].seatsLeft;
        })
        return seatsLeft;
        // console.log({dbr});
        return 'xx';
        dbr.value['ABV-KAN'].seatsLeft
    }
    getDbrListLeftSeats(dbr: any){
        
        // console.log(dbr);
        // debugger;
    }

    getDbrAdultCost(dbr: any,seg: any){
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
        // console.log({dbr});
        return '00';
        dbr.value['ABV-KAN'].adultCost
    }

    expireIn(expireAt: Date){
        let now = new Date();
        // expireAt;
        // debugger;
        // let exp = Math.abs(now-expireAt);
        // console.log(exp);
        // return Math.abs(now-expireAt);

        if(expireAt < now){
            return 'Expired';// now - expireAt;
        }else{
            return 'Not Expired';
        }
    }

    isExpired(expireAt: Date){
        let now = new Date();
        return expireAt < now;
    }


}
