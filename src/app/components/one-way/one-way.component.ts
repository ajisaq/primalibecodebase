import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { FlightSearchService } from 'src/app/services/flightSearch.service';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Dropdown } from 'src/app/models/dropdown.model';
import { Fare } from 'src/app/models/fare.model';
import { Flight } from 'src/app/models/flight.model';
import { BatService } from 'src/app/services/bat.service';
import { FlightSearchComponent } from '../flight-search/flight-search.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.component.html',
  styleUrls: ['./one-way.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OneWayComponent implements OnInit {
    isLoading: boolean = false;
    flights: any[] = [];
  // flights: Observable<any[]> = new Observable();
  // flights: Subject<any[]> = new Subject();
  // flights: any = {};

  flightSearchResults?: Subscription;
  availableFlights: any = {};
  indexedFlightsByDate: any = {};
  indexedConnectingFlightsByDate: any = {};
  selectedDateFlightsBySeg: any = {};
  flightSearchResultData: any = {data: [], connecting: []};
  flightSearchResultDataBySeg: any = {};
  flightsResultBySegByDate: any = {};

  flightsearchParams: any;

  panelOpenState = false;
  indexedAirports: any = {};
  airport: any;

  indexedCabinClasses: any = {};
  indexedBookingClusters: any = {};
  indexedPassengerTypes: any = {};
//   indexedPassengerTypesByCode: any = {};

  pnr: string = "";
  // fare: any;
  
  selectedSegment = 0;
  segments: any[] = [];
  flightSearchStates: any = {
      0: "Search Flights",
      1: "Searching",
      2: "Flight Search Results",
  };
  flightSearchState: any = {};
  segmentSearchParams: any = {};
//   {
//       index?: number;
//       originCityName?: string;
//       destinationCityName?: string;
//       date?: string;
//   } = {};

  flightSearchForm: FormGroup = new FormGroup({});

  fsForm?: FormGroup;
  currencies: any[] = [];
  
  bookingForm: FormGroup = new FormGroup({});
  bookingClasses: any;
  selectedDate: string = '';
  selectedDates: any = {};

  @Input() set flightSearchFormParams(searchParams: any){
    // if(searchParams.origin && searchParams.destination && searchParams.departureDate){
        this.flightsearchParams = searchParams;
        // this.flightsearchParams = {
        //     adult: 1,
        //     child: 0,
        //     departureDate: "2022-05-28",
        //     destination: 2,
        //     infant: 0,
        //     origin: 1
        // };
        if(moment() > moment(searchParams.departureDate, 'YYYY-MM-DD')){
            this.flightsearchParams.departureDate = moment().format('YYYY-MM-DD');
        }
        this.flightSearchForm = this.fb.group({
            AD: [this.flightsearchParams.adult,[Validators.required]],
            CH: [this.flightsearchParams.child,[]],
            IN: [this.flightsearchParams.infant,[]],
            // currency: [""],
            segments: new FormArray([]),
        });
        
        this.searchFlight();
        // let fArr = <FormArray> new FormArray([]);
        // const segment = new FormGroup({
        //     id: new FormControl(),
        //     origin: new FormControl(this.flightsearchParams.origin),
        //     destination: new FormControl(this.flightsearchParams.destination),
        //     date: new FormControl(this.flightsearchParams.departureDate || moment()),
        //     // status: new FormControl(null),
        //     _chosenCC: new FormControl(null),
        //     _chosenDay: new FormControl(null),
        //     _chosenFlight: new FormControl(null),
        //     _flightResult: new FormControl(null),
        //     _columnHeaders: new FormControl(null),
        //     _clustersBySegByCCByCL: new FormControl(null),
        //     _indexedFlightsByDate: new FormControl({}),
        //     _indexedConnectingFlightsByDate: new FormControl({}),
        // });
        // fArr.controls.push(segment); 
        // this.flightSearchForm.setControl('segments', fArr);
        console.log(searchParams);
        // console.log('search from input', this.flightSearchForm, this.flightsearchParams, searchParams);
        // this.onFlightSearch();
    // }
    // console.log('gotten',searchParams, this.flightsearchParams);
  };

  constructor(
    private flightSearchService: FlightSearchService, 
    private router: Router,
    private route: ActivatedRoute,
      private batService: BatService,
      private fb: FormBuilder,
      private cd: ChangeDetectorRef,
      public dialog: MatDialog
    ) {
        this.flightSearchService.isLoadingFlights.pipe().subscribe(resp => this.isLoading = resp);
        
    
    this.batService.onBookingFormChanged.pipe().subscribe((bookingForm: FormGroup)=> {
        this.bookingForm = bookingForm;
        // this.flightSearchForm = this.fb.group({
        //     AD: [this.flightsearchParams.adult,[Validators.required]],
        //     CH: [this.flightsearchParams.child,[]],
        //     IN: [this.flightsearchParams.infant,[]],
        //     // currency: [""],
        //     segments: this.getSegmentSearchArray(),
        // });
    });
    this.batService.onIndexedAirportsChanged.subscribe((indexedAirports: any) => this.indexedAirports = indexedAirports);
    this.batService.onIndexedCabinClassesChanged.subscribe((indexedCabinClasses: any) => this.indexedCabinClasses = indexedCabinClasses);
    this.batService.onIndexedBookingClustersChanged.subscribe((indexedBookingClusters: any) => this.indexedBookingClusters = indexedBookingClusters);
    this.batService.onIndexedPassengerTypesChanged.subscribe((indexedPassengerTypes: any) => this.indexedPassengerTypes = indexedPassengerTypes);
    
  }

  ngOnInit(): void {
    //   this.isLoading = true;

      // this._currenciesDropdownService.onCurrenciesDropdownChanged.subscribe(
      //     (currencies) => {
      //         this.currencies = currencies;
      //     }
      // );

    // this.flightSearchService.flightSearchResult.pipe().subscribe(flights => {
    //   this.flights = flights;
    //   console.log(this.flights);      
    // })

    // this.flightSearchService.flightSearchResultData.pipe().subscribe(data => {
    //   this.flightSearchResultData = data;
    //   console.log(this.flightSearchResultData);
    //   this.prepareDirectandConnectingFlights();
    // });

    this.batService.onSelectFlightClicked.pipe().subscribe((data: any) => {
        this.chooseFlight(data.segmentIndex,data.flight,data.flight.cabin_prices[data.cabinIndex],data.bookingClusterIndex);
    });
    if(this.route.snapshot.queryParams['origin'] && this.route.snapshot.queryParams['destination']){
        this.flightsearchParams = this.route.snapshot.queryParams;
        // console.log('route params',this.route.snapshot.queryParams);
        if(this.flightsearchParams.origin){
            this.flightSearchForm = this.fb.group({
                AD: [this.flightsearchParams.adult,[Validators.required]],
                CH: [this.flightsearchParams.child,[]],
                IN: [this.flightsearchParams.infant,[]],
                // currency: [""],
                segments: new FormArray([]),
            });
            this.searchFlight(); 
        }
    }
    // console.log('input',this.flightSearchFormParams, this.flightsearchParams);
    // console.log('lowest prices flight by day',this.getSelectedDateRangeLowestPricesByDate());
  }

  openDialog() {
    this.router.navigate(['/home']);
    // this.dialog.open(FlightSearchComponent);
  }

  getSelectedDateRangeLowestPricesByDate(segmentIndex?:number): any[] {
    let segment =  this.flightSearchForm.getRawValue().segments[segmentIndex || 0];
    let carouselIndexedFlightByDate: any = {};
    let dateLowestPriceRange: any[] = [];
    let segmentFlightsByDate = segmentIndex ? segment._indexedFlightsByDate : this.indexedFlightsByDate;
    let segmentConnectingFlightsByDate = segmentIndex ? segment._indexedConnectingFlightsByDate : this.indexedConnectingFlightsByDate;
    // console.log('got segmentflightbydate',segmentFlightsByDate, segment);
    // Object.keys(this.indexedFlightsByDate).forEach((i: string) => {
    //   let rangeLowestPrice = this.indexedFlightsByDate[i].reduce(function (lowest: any, flight: any) {
    //     return (lowest.adult_cost || flight.adult_cost) < flight.adult_cost ? lowest : flight;
    //   }, {});
    //   carouselIndexedFlightByDate[i] = rangeLowestPrice;
    // });
    Object.keys(segmentFlightsByDate).forEach((i: string) => {
      let rangeLowestConnectingPrice = segmentConnectingFlightsByDate[i]?.reduce(function (lowest: any, connectingFlight: any) {
        return (lowest.adult_cost || connectingFlight.adult_cost) < connectingFlight.adult_cost ? lowest : connectingFlight;
      }, {});
    //   let rangeLowestConnectingPrice: any = {}; 
    //   segmentConnectingFlightsByDate[i].forEach((connectingFlight: any) => {
    //     rangeLowestConnectingPrice = (this.sumConnectingFlightSegments(rangeLowestConnectingPrice).adult_cost || this.sumConnectingFlightSegments(connectingFlight).adult_cost) < this.sumConnectingFlightSegments(connectingFlight).adult_cost ? this.sumConnectingFlightSegments(rangeLowestConnectingPrice) : this.sumConnectingFlightSegments(connectingFlight);
    //   });

      let rangeLowestPrice = segmentFlightsByDate[i]?.reduce(function (lowest: any, flight: any) {
        return (lowest.adult_cost || flight.adult_cost) < flight.adult_cost ? lowest : flight;
      }, {});

      carouselIndexedFlightByDate[i] = (rangeLowestPrice.adult_cost || 999999999) < (rangeLowestConnectingPrice.adult_cost || 999999999) ? rangeLowestPrice : rangeLowestConnectingPrice;
      const flight: any = {
        displayDate: i, 
        flight: carouselIndexedFlightByDate[i]
      };
      dateLowestPriceRange.push(flight);
    });

    
    
    // console.log('carousel data',carouselIndexedFlightByDate);
    // this.flights = flightsForSearchPeriod;
    // return carouselIndexedFlightByDate;
    return dateLowestPriceRange;
  }

  sumConnectingFlightSegments(connectingFlight: any): any {
    // let sumConnectingPrice = Object.values(connectingFlight).reduce(function (sumConnecting: any, connectingFlight: any) {
    //     return this.sumObjectsByKey(sumConnecting, connectingFlight);
    //   }, {});
    let sumConnecting: any = {};
    Object.values(connectingFlight).forEach(segment => {
        sumConnecting = this.sumObjectsByKey(sumConnecting, segment);
    });
    return sumConnecting;
  }

  sumObjectsByKey: any = (...objs: any[]) => {
    const res = objs.reduce((a,b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k)){
          if(isNaN(+b[k])){
            a[k] = this.sumObjectsByKey({},b[k]);
          }else{
            a[k] = (a[k] || 0) + b[k];
          }
        }
        
      }
      return a;
    }, {});
    return res;
  }

  getSelectedDateFlights(segmentIndex?:number): any[] {
    
    let segment =  this.flightSearchForm.getRawValue().segments[segmentIndex || 0];
    const flightsForSearchPeriod:any[] = (segmentIndex ? segment._indexedFlightsByDate[this.selectedDate] : this.indexedFlightsByDate[this.selectedDate]);
    
    // console.log(flightsForSearchPeriod);
    this.flights = flightsForSearchPeriod;
    // console.log('selected date flights', this.flights);
    return flightsForSearchPeriod;
  }

  getSelectedDateConnectingFlights(segmentIndex?:number): any[] {
    
    let segment =  this.flightSearchForm.getRawValue().segments[segmentIndex || 0];
    const connectingFlightsForSearchPeriod:any[] = (segmentIndex ? segment._indexedConnectingFlightsByDate[this.selectedDate] : this.indexedConnectingFlightsByDate[this.selectedDate]);
    
    // console.log(connectingFlightsForSearchPeriod);
    this.flights = connectingFlightsForSearchPeriod;
    // console.log('selected date flights', this.flights);
    return connectingFlightsForSearchPeriod;
  }

  setSelectedDate(eventDate: string, segmentIndex?:number) {
    this.selectedDate = eventDate;
    this.getSelectedDateFlights(segmentIndex?segmentIndex:undefined);
    this.getSelectedDateConnectingFlights(segmentIndex?segmentIndex:undefined);
    // console.log(this.selectedDate);
  }

  searchFlight() {

    let fArr = <FormArray> new FormArray([]);
    const segment = new FormGroup({
        id: new FormControl(),
        origin: new FormControl(this.flightsearchParams.origin || '/api/airports/1'),
        destination: new FormControl(this.flightsearchParams.destination || '/api/airports/2'),
        date: new FormControl(this.flightsearchParams.departureDate || moment()),
        // status: new FormControl(null),
        _chosenCC: new FormControl(null),
        _chosenDay: new FormControl(null),
        _chosenFlight: new FormControl(null),
        _flightResult: new FormControl(null),
        _columnHeaders: new FormControl(null),
        _clustersBySegByCCByCL: new FormControl(null),
        _indexedFlightsByDate: new FormControl({}),
        _indexedConnectingFlightsByDate: new FormControl({}),
    });
    fArr.controls.push(segment);
    // (<FormArray>this.flightSearchForm.get("segments")).controls.push(segment);

    // let segForm =segmentsArray.controls[seg] as FormGroup;

    if(this.flightsearchParams.returnDate){
        const segment2 = new FormGroup({
            id: new FormControl(),
            origin: new FormControl(this.flightsearchParams.destination || '/api/airports/2'),
            destination: new FormControl(this.flightsearchParams.origin || '/api/airports/1'),
            date: new FormControl(this.flightsearchParams.returnDate || moment()),
            // status: new FormControl(null),
            _chosenCC: new FormControl(null),
            _chosenDay: new FormControl(null),
            _chosenFlight: new FormControl(null),
            _flightResult: new FormControl(null),
            _columnHeaders: new FormControl(null),
            _clustersBySegByCCByCL: new FormControl(null),
            _indexedFlightsByDate: new FormControl({}),
            _indexedConnectingFlightsByDate: new FormControl({}),
        });
        
        fArr.controls.push(segment2);
        // (<FormArray>this.flightSearchForm.get("segments")).controls.push(segment);
        // (<FormArray>this.flightSearchForm.get("segments")).push(segment2);
    }
    this.flightSearchForm.setControl('segments', fArr);
    // console.log('search test form arr', this.flightSearchForm, this.flightsearchParams);
    this.onFlightSearch();
    this.flightSearchService.segmentSearch(
      this.flightsearchParams.origin, 
      this.flightsearchParams.destination, 
      this.flightsearchParams.departureDate, 
      this.flightsearchParams.adult,
      this.flightsearchParams.child,
      this.flightsearchParams.infant)
        .then((response: any) => {
            this.flights = response.data;
            this.isLoading = false;
            this.flightSearchService.isLoadingFlights.next(this.isLoading )
          // console.log(response);
          // console.log("Flight search is successful", this.flights);
          this.flightSearchResultData = response;
          this.prepareDirectandConnectingFlights();
        //   this.flightSearchService.isLoadingFlights.next(this.isLoading);
        })
        .catch(error => console.log(error)
        );
  }  
  onFlightSearch(){
    let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
    segmentsArray.controls.forEach((segment,i)=>{
        let _first;
        let sgmt = (<FormGroup>this.flightSearchForm.get(`segments.${i}`));
        if(!sgmt.controls['id'].value){
            if(!_first){
                _first = i;
                this.selectedSegment = i;
            }
            // console.log('before network request', sgmt, segment);
            this.onSegmentSearch(sgmt,i);
        }
    });
  }

  prepareDirectandConnectingFlights(segmentIndex?:number){
    let segment =  this.flightSearchForm.getRawValue().segments[segmentIndex || 0];
    // console.log('prepare called',this.flightSearchResultData, this.flightSearchForm.getRawValue(), segment);
    let selDate = moment(segment.date || this.flightsearchParams.departureDate);
    let _mn = selDate.clone();
    let _mx = selDate.clone();
    let minDate = _mn.subtract(3, 'd');//moment(flight.depart_date).subtract(4, 'd').format('DD-MM-YYYY');
    let maxDate = _mx.add(3, 'd');//moment(flight.depart_date).add(2, 'd').format('DD-MM-YYYY');
    // if(minDate < moment()){
    //     minDate = moment();
    //     maxDate =  maxDate.add(3, 'd');
    // }
    let thisDay: any = minDate;
    let indexedFlightsByDate: any = {};
    let indexedConnectingFlightsByDate: any = {};
    while (thisDay<=maxDate) {
        let thisDayString = thisDay.format('DD-MM-YYYY');
        if(!indexedFlightsByDate[thisDayString]){
            indexedFlightsByDate[thisDayString]=[];
        }
        if(!indexedConnectingFlightsByDate[thisDayString]){
            indexedConnectingFlightsByDate[thisDayString]=[];
        }
        thisDay = thisDay.add(1, 'd');
    }
    let flightSearchResultResponse: any;
    if(segmentIndex){
        flightSearchResultResponse = segment._flightResult;
    }else{
        flightSearchResultResponse = this.flightSearchResultData;
    }
    let segForm =this.getFlightSearchFormSegments().controls[segmentIndex||0] as FormGroup;
    // console.log('before indexed direct and connecting', thisDay, minDate, maxDate, indexedFlightsByDate, indexedFlightsByDate, indexedConnectingFlightsByDate);
    flightSearchResultResponse.data.map((flight: any)=>{
        let flightDate = moment(flight.depart_date).format('DD-MM-YYYY');
        if(indexedFlightsByDate[flightDate]){
            indexedFlightsByDate[flightDate].push(flight);
        }
    });
    // this.flightsResultBySegByDate[i]['directFlights']=this.indexedFlightsByDate;

    flightSearchResultResponse.connecting.map((flight: any)=>{
        let flightDate = moment(flight.depart_date).format('DD-MM-YYYY');
        if(indexedConnectingFlightsByDate[flightDate]){
            indexedConnectingFlightsByDate[flightDate].push(flight);
        }
    });
    // this.flightsResultBySegByDate[i]['directFlights']=this.indexedFlightsByDate;
    if(!segmentIndex){
        this.indexedConnectingFlightsByDate = indexedConnectingFlightsByDate;
        this.indexedFlightsByDate = indexedFlightsByDate;
    }else{
        segForm.controls['_indexedConnectingFlightsByDate'].setValue(indexedConnectingFlightsByDate);
        segForm.controls['_indexedFlightsByDate'].setValue(indexedFlightsByDate);
    }
    // console.log('indexed direct and connecting', this.indexedFlightsByDate, this.indexedConnectingFlightsByDate, segForm);

    this.selectedDate = selDate.format('DD-MM-YYYY');
    // this.selectedDates[segmentIndex||0] = selDate.format('DD-MM-YYYY');
    this.getSelectedDateRangeLowestPricesByDate(segmentIndex);
    // this.flights.next(this.getSelectedDateFlights(selDate.format('DD-MM-YYYY')));
    // this.getSelectedDateFlights(selDate.format('DD-MM-YYYY'));
  }

//   getSegmentSearchArray(){
//     let resultArray = this.fb.array([]);
//     (<FormArray>this.bookingForm.get("bookingLegs")).controls.forEach((bookingLegForm: FormGroup) => {
//         let _flight: Flight = bookingLegForm.controls['flight'].value;
//         // debugger;
//         let _segment = new FormGroup({
//             // id: new FormControl(bookingLegForm.controls['id'].value),
//             origin: new FormControl({value:_flight.departAirport.iri,disabled:true}),
//             destination: new FormControl({value:_flight.arriveAirport.iri,disabled:true}),
//             date: new FormControl(_flight.departDate?moment(_flight.departDate, 'YYYY-MM-DD\THH:mm:ssP'):moment()),
//             // status: new FormControl(null),//???
//             _chosenCC: new FormControl(null),
//             _chosenDay: new FormControl(null),
//             _chosenFlight: new FormControl(null),
//             _flightResult: new FormControl(null),
//             _columnHeaders: new FormControl(null),
//             _clustersBySegByCCByCL: new FormControl(null),
//         });
//         resultArray.push(_segment);
//     });
//     return resultArray;
//   }

    addSegment() {
        // this.segments.push({});
        let segments: FormArray = (<FormArray>this.flightSearchForm.get("segments"));
        let noSegments = segments.controls.length;
        
        let predictOrigin = null;
        let predictDestination = null;
        let predictDate = null;
        if(noSegments>0){
            let index = (noSegments-1);
            let segForm: FormGroup = segments.controls[index] as FormGroup;
            let lastOrigin      = segForm.controls['origin'].value;
            let lastDestination = segForm.controls['destination'].value;
            let lastDate = segForm.controls['date'].value;
            if(noSegments==1){
                predictOrigin      = lastDestination;
                predictDestination = lastOrigin;
                predictDate = lastDate;
            }else{
                //if last is not a return
                let index = (noSegments-2);
                let segForm: FormGroup = segments.controls[index] as FormGroup;
                let beforeLastOrigin      = segForm.controls['origin'].value;
                let beforeLastDestination = segForm.controls['destination'].value;
                if(beforeLastOrigin!==lastDestination && beforeLastDestination !== lastOrigin){
                    predictOrigin      = lastDestination;
                    predictDestination = lastOrigin;
                    predictDate = lastDate;
                }
            }
        }
        const segment = new FormGroup({
            origin: new FormControl(predictOrigin || '/api/airports/1'),
            destination: new FormControl(predictDestination || '/api/airports/2'),
            date: new FormControl(predictDate || moment()),
            // status: new FormControl(null),
            _chosenCC: new FormControl(null)
        });
        
        segment.controls['origin'].valueChanges.subscribe(val=>{
            if(segment.value.destination===val){
                segment.patchValue({destination: null});
            }
        });
        (<FormArray>this.flightSearchForm.get("segments")).push(segment);
    }

    getFlightSearchFormSegments() {
        // console.log('my search form', this.flightSearchForm);
        return <FormArray>this.flightSearchForm.get("segments");
    }


    // indexedClustersBySegByCCByCL: any[] = [];
    // onSegmentSearch(segment: FormGroup, i: number) {
    //     this.segmentSearchParams.index = i;
    //     this.flightSearchState[i] = 1;
    //     const { date, destination, origin } = segment.value;
    //     // debugger;
    //     this.segmentSearchParams.originCityName = this.indexedAirports[origin]?.city.name;
    //     this.segmentSearchParams.destinationCityName = this.indexedAirports[destination]?.city.name;
    //     // console.log({ ddate, dmonth, dyear });

    //     let AD = this.flightSearchForm.value.AD;
    //     let CH = this.flightSearchForm.value.CH;
    //     let IN = this.flightSearchForm.value.IN;

    //     this.segmentSearchParams.date = moment(date).format('DD-MM-YYYY')
    //     this.flightSearchService
    //         .segmentSearch(
    //             // this.indexedAirports[origin].id,
    //             // this.indexedAirports[destination].id,
    //             origin,
    //             destination,
    //             moment(date).format('DD-MM-YYYY'),
    //             AD,
    //             CH,
    //             IN,
                
    //         )
    //         .then((response) => {
    //             this.flightSearchState[i] = 2;
    //             const data = response.data;
    //             const keys = response.keys;
    //             // this.flights[i] = data;
    //             console.log(response);
    //             this.availableFlights[i] = response.data;

    //             // data.forEach((datum)=>{
    //             //     this.availableSeats = datum.available_seats;
    //             //     this.fare = datum.cabin_prices;
    //             // })

    //             //exist
    //             Object.keys(keys.bookingClusters).forEach(code=>{
    //                 let cluster = keys.bookingClusters[code];
    //                 if(!this.indexedClustersBySegByCCByCL[i]){
    //                     this.indexedClustersBySegByCCByCL[i] = {};
    //                 }
    //                 if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class]){
    //                     this.indexedClustersBySegByCCByCL[i][cluster.cabin_class] = {};
    //                 }
    //                 if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]){
    //                     this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code] = {};
    //                 }
    //                 this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]=cluster;
    //                 console.log(this.flights,{data},this.indexedClustersBySegByCCByCL);
    //                 // console.log(cluster);
    //             })
    //             console.log({data});
    //             console.log(this.flights);
    //             console.log(this.indexedClustersBySegByCCByCL);
                
    //         })
    //         .catch((err) => {
    //             this.flightSearchState[i] = 0;
    //         });
    // }
    flightsDateRange: any;
    indexedClustersBySegByCCByCL: any = {};
    onSegmentSearch(segment: FormGroup, i: number) {
        this.flightSearchState[i] = 1;
        
        let date        = segment.controls['date'].value;
        let destination = segment.controls['destination'].value;
        let origin      = segment.controls['origin'].value;

        segment.controls['_chosenDay'].setValue(moment(date).format('DD-MM-YYYY'));

        let AD = this.flightSearchForm.controls['AD'].value;
        let CH = this.flightSearchForm.controls['CH'].value;
        let IN = this.flightSearchForm.controls['IN'].value;



        this.flightSearchService
            .segmentSearch(
                // this.indexedAirports[origin].extra.id,
                // this.indexedAirports[destination].extra.id,
                origin,
                destination,
                moment(date).format('DD-MM-YYYY'),
                AD,
                CH,
                IN,
                // i
            )
            .then((response) => {
                segment.controls['_flightResult'].setValue(response);
                // console.log('added flightResult to segment',segment);
                this.flightSearchState[i] = 2;
                const data = response.data;
                const keys = response.keys;
                // this.flights[i] = data;

                // this.selectedDates[i] = date.format('YYYY-MM-DD');
                // this.availableFlights[i] = response.data;
                // this.flightSearchResultData = response;
                this.prepareDirectandConnectingFlights(i);
                // console.log('after prepare called', segment);
                // // this.columnHeadersIndexed[i]=this.defaultColumnHeaders;
                // // this.columnHeadersIndexed[i]={};//this.typeBColumnHeaders;

                // // data.forEach((datum)=>{
                // //     this.availableSeats = datum.available_seats;
                // //     this.fare = datum.cabin_prices;
                // // })

                // //exist
                // Object.keys(keys.bookingClusters).forEach(code=>{
                //     let cluster = keys.bookingClusters[code];
                //     if(!this.indexedClustersBySegByCCByCL[i]){
                //         this.indexedClustersBySegByCCByCL[i] = {};
                //     }

                //     if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class]){
                //         // this.columnHeadersIndexed[i].push(cluster.cabin_class);
                //         // if(!this.columnHeadersIndexed[i].includes(cluster.cabin_class)){
                //         //     this.columnHeadersIndexed[i].push(cluster.cabin_class);
                //         // }
                //         this.indexedClustersBySegByCCByCL[i][cluster.cabin_class] = {};
                //     }
                //     if(!this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]){
                //         // this.columnHeadersIndexed[i].push(code);
                //         this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code] = {};
                //     }
                //     this.indexedClustersBySegByCCByCL[i][cluster.cabin_class][code]=cluster;

                //     console.log('all flights',this.flights,{data},this.indexedClustersBySegByCCByCL);
                //     // console.log(cluster);
                // })

                // segment.controls['_clustersBySegByCCByCL'].setValue(this.indexedClustersBySegByCCByCL[i]);
                // // console.log(this.flights,{data},this.indexedClustersBySegByCCByCL,this.columnHeadersIndexed);
                // // this.bookingClasses = {data};

                // console.log({data});
                // console.log('flights obj',this.flights);

                // // if(!this.flightsDateRange[i]){
                //     this.flightsDateRange[i]={};
                // // }

                // let _mn = date.clone();
                // let _mx = date.clone();
                // let minDate = _mn.subtract(4, 'd').format('YYYY-MM-DD');;//moment(flight.depart_date).subtract(4, 'd').format('DD-MM-YYYY');
                // let maxDate = _mx.add(2, 'd').format('YYYY-MM-DD');;//moment(flight.depart_date).add(2, 'd').format('DD-MM-YYYY');
                
                // let thisDay = minDate;

                // let indexedClustersBySegByDayByCCByCL: any = {};

                // debugger;
                // while (thisDay<=maxDate) {
                //     thisDay = moment(thisDay,'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD');
                //     if(!this.flightsDateRange[i][thisDay]){
                //         this.flightsDateRange[i][thisDay]=[];
                //     }
                // }

                // data.map((flight: any)=>{
                //     let flightDay = moment(flight.depart_date).format('YYYY-MM-DD');
                //     this.flightsDateRange[i][flightDay].push(flight);
                //     console.log('flightsdaterange',this.flightsDateRange);

                //     //
                //     if(!indexedClustersBySegByDayByCCByCL[i]){
                //         indexedClustersBySegByDayByCCByCL[i] = {};
                //     }
                //     if(!indexedClustersBySegByDayByCCByCL[i][flightDay]){
                //         indexedClustersBySegByDayByCCByCL[i][flightDay] = {};
                //     }
                //     // if(!this.columnHeadersIndexed[i][flightDay]){
                //     //     this.columnHeadersIndexed[i][flightDay]=this.typeBColumnHeaders;
                //     // }

                //     flight.cabin_prices.forEach((cabinPrice:any)=>{
                //         let cabinIri = '/api/cabin_classes/'+cabinPrice.id;
                //         if(!indexedClustersBySegByDayByCCByCL[i][flightDay][cabinIri]){
                //             indexedClustersBySegByDayByCCByCL[i][flightDay][cabinIri] = {};
                //             // if(!this.columnHeadersIndexed[i][flightDay].includes(cabinIri)){
                //             //     this.columnHeadersIndexed[i][flightDay].push(cabinIri);
                //             // }

                //             Object.keys(cabinPrice.price_list).forEach(clusterCode=>{
                //                 let cluster = cabinPrice.price_list[clusterCode];
                //                 if(!indexedClustersBySegByDayByCCByCL[i][flightDay][cabinIri][clusterCode]){
                //                     // this.columnHeadersIndexed[i].push(code);
                //                     indexedClustersBySegByDayByCCByCL[i][flightDay][cabinIri][clusterCode] = {};
                //                 }
                //                 indexedClustersBySegByDayByCCByCL[i][flightDay][cabinIri][clusterCode]=cluster;
                //             })
                //         }
                //     });
                // });

                // // segment.controls['_flightResult'].patchValue(this.flightsDateRange[i]);
                // // segment.controls._columnHeaders.patchValue(this.columnHeadersIndexed[i]);
                // // segment.controls._clustersBySegByCCByCL.patchValue(this.indexedClustersBySegByCCByCL[i]);
                // // segment.controls['_clustersBySegByCCByCL'].setValue(indexedClustersBySegByDayByCCByCL[i]);

                // console.log('seg',segment);
                // console.log(this.flightsDateRange,this.selectedDate,3333);
                // debugger;
                // console.log(this.indexedClustersBySegByCCByCL);
                
            })
            .catch((err) => {
                this.flightSearchState[i] = 0;

                // this.router.navigate(['/home']);
            });
    }

    countKeys(obj: any){
        return Object.keys(obj).length;
    }
    chooseFlight(segmentIndex: number,flight: any,flightCabin?: any,flightCluster?: any){
        // console.log({segmentIndex,flight,flightCabin,flightCluster});
        // debugger
        let bookingLegs = this.bookingForm.get('bookingLegs') as FormArray;
        if(bookingLegs.controls[segmentIndex]){
            // (<FormGroup>bookingLegs.controls[segmentIndex]).reset();
            bookingLegs.at(segmentIndex).patchValue(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0].value);
            // this.goToNextStep();
        }else{
            bookingLegs.insert(segmentIndex, this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0]);
        }

        // if((segmentIndex+1) < this.SegmentsFormArray.controls.length){
        //     this.selectedSegment+=1;
        // }else{
        //     this.goToNextStep();
        // }

            // bookingLegs.controls.push(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0]);
            // bookingLegs.controls[segmentIndex]?.patchValue(this.getBookingLegsFormArray(flight,flightCabin,flightCluster).controls[0].value);
            bookingLegs.markAsDirty();
            // this.router.navigate(['/bat/passengers']);
            this.batService.onBookingFormChanged.next(this.bookingForm);
            console.log('bls and bforms',bookingLegs, this.bookingForm);
        // }
        // debugger
    }

    get BookingLegsFormArray(): FormArray{
        return this.bookingForm.get('bookingLegs') as FormArray;
    }
    get SegmentsFormArray(): FormArray{
        return this.flightSearchForm.get('segments') as FormArray;
    }

    getBookingLegsFormArray(flight?: any,flightCabin?: any,flightCluster?: any){
        // let bookingLegs = booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
        let resultArray = this.fb.array([]) as FormArray;
        // let bookingLeg = new BookingLeg(flight);
        // bookingLegs.forEach((bookingLeg: BookingLeg) => {
            let DA = this.indexedAirports[flight.depart_airport].code;
            let AA = this.indexedAirports[flight.arrive_airport].code;
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
                    cabinClass  : [flightCabin?.code], //[new CabinClass(bookingLeg.cabinClass).iri],
                    ssrs    : [[]], //[bookingLeg.ssrs],
                })
            )
            // debugger
        // });
        // console.log('generated legs',resultArray);
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
        let DA = this.indexedAirports[flight.depart_airport].code;
        let AA = this.indexedAirports[flight.arrive_airport].code;
        let pKey0 = `${DA}-${AA}`;


        let clusterCode = flightCluster;
        flight;flightCabin;flightCluster;
        // debugger;
        let rbdIndex = flightCabin.price_list[clusterCode].selectedIndex;
        let temp2 =    flightCabin.price_list[clusterCode].rbdList[rbdIndex];


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
        let depart = this.indexedAirports[segForm.controls['origin'].value].code;
        let arrive = this.indexedAirports[segForm.controls['destination'].value].code;
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

    getDbrAdultCost(dbr: any,seg: any){
        let segmentsArray = this.flightSearchForm.get('segments') as FormArray;
        let segForm =segmentsArray.controls[seg] as FormGroup;
        let depart = this.indexedAirports[segForm.controls['origin'].value].code;
        let arrive = this.indexedAirports[segForm.controls['destination'].value].code;
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

    goToNextStep(): void {
        // console.log('Go to next mat step', this.batService.goToNextMatStep());
        // this.batService.goToNextMatStep();
        // this.batService.continueToPassengerInformation.next(true);
        // this.batService.goToNextMatStep();
      }
}
