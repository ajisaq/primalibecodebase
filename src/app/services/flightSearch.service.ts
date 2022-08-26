import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, forkJoin, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { BatService } from "./bat.service";
import { Cabin } from "../models/cabin.model";
import { Seat } from "../models/seat.model";
import * as moment from 'moment';
import { FuseUtils } from '../../@fuse/utils';

@Injectable({ providedIn: "root" })
export class FlightSearchService {
    flightSearchResult: BehaviorSubject<any>;
    onSeatsOnImageChanged: BehaviorSubject<any>;
    onCabinChanged: BehaviorSubject<any>;
    cabin: any = {};
    seats: any[] = [];
    flightSearchResultData: BehaviorSubject<any>;
    onFlightsChanged: BehaviorSubject<any>;
    onFlightSearchFormChanged: BehaviorSubject<any>;
    noOfPassengersObj: Subject<any>;
    noOfPassengers: BehaviorSubject<any>;
    isLoadingFlights: BehaviorSubject<any>;
    flights: any[] = [];
    passengerNumber: number = 0;
    searchText: string;
    filterBy: string;
    flightDate: any;
    flightNumber: string;
    departureCity: string;
    legs: string[];


    constructor(
        private _httpClient: HttpClient,
        private batService: BatService
    ) {
        this.onCabinChanged = new BehaviorSubject([]);
        this.onSeatsOnImageChanged = new BehaviorSubject([]);
        this.flightSearchResult = new BehaviorSubject([]);
        this.flightSearchResultData = new BehaviorSubject({data:[],connecting:[]});
        this.onFlightsChanged = new BehaviorSubject([]);
        this.onFlightSearchFormChanged = new BehaviorSubject({});
        this.noOfPassengersObj = new Subject();
        this.noOfPassengers = new BehaviorSubject(0);
        this.isLoadingFlights = new BehaviorSubject(false);
        this.batService.flightsAdded.subscribe((flightIRIs) => {
            // console.log(flightIRIs);
            const searchUrls: any[] = [];
            flightIRIs.forEach((flightIRI) => {
                searchUrls.push(
                    this._httpClient.get(`${environment.serverURL}${flightIRI}`)
                );
            });

            forkJoin(searchUrls).subscribe((results) => {
                // console.log({ results });
                this.flights = results;
                this.onFlightsChanged.next(this.flights);
            });
        });
    }

    getDepartures(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.serverURL + "/api/flights")
                .subscribe((response: any) => {
                    // console.log({ getDeparturesHTTPResponse: response });
                    this.flights = response["hydra:member"];
                    this.onFlightsChanged.next({ flights: this.flights });
                    resolve(this.flights);
                }, reject);
        });
    }

    // getSeatsOnFlight(flightId: number): Promise<any>{
    //     console.log(flightId);
    //     return new Promise<any>((resolve, reject) => {
    //         this._httpClient.get(`${environment.serverURL}/api/flights/${flightId}/seats`)
    //         .subscribe((resp: any) => {
    //             console.log(resp);
    //             this.cabin = new Cabin(resp.schedule.aircraft.cabin);
    //             let seats = resp.schedule.aircraft.cabin.seats;
    //             this.seats = seats.map(seat=> {
    //                 return new Seat(seat);
    //             });
    //             this.onCabinChanged.next(this.cabin);
    //             console.log(this.onCabinChanged.next(this.cabin));
    //             this.onSeatsOnImageChanged.next(this.seats);
    //             resolve(this.cabin);
    //             // console.log(this.onCabinChanged)
    //         }, reject)
    //     })
        
    
    // }


    getSeatsOnFlight(flightId: number): Promise<any>
    {
        // console.log('pax flight', flightId);
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL+'/api/flights/'+flightId+'/seats')
                    .subscribe((response: any) => {
                        this.cabin = new Cabin(response.schedule.aircraft.cabin);
                        this.seats = response.schedule.aircraft.cabin.seats;
                        console.log('Flight Information',response);       
                        this.onCabinChanged.next(this.cabin);
                        this.onSeatsOnImageChanged.next(this.seats);
                        resolve(this.cabin);
                        // console.log(this.seats);
                    }, reject);
            }
        );
    }


    urlFilterParams() {
        //if choose to use booking legs manifest endpoint. serealise all params
        let filterParam = '?';
        // console.log(filterParam);
        // console.log('c', this.departureCity, this.flightNumber, this.flightDate);
        this.legs.forEach(element => {
            filterParam += 'schedule_leg[]='+encodeURIComponent(element)+'&';
        });
        // if(this.departureCity){
        //     filterParam += 'flight.depart_airport='+encodeURIComponent(this.departureCity)+'&';
        // }
        if(this.flightNumber && this.flightNumber != ''){
            filterParam += 'flight.flight_number='+encodeURIComponent(this.flightNumber)+'&';
        }if(this.flightDate && this.flightDate != ''){
            let newDateObj = moment(this.flightDate).add(1, 'd').format('YYYY-MM-DD\THH:mm:ss+01:00');
            // console.log('new date', newDateObj);
            filterParam += encodeURIComponent('flight.depart_day[before]')+'='+encodeURIComponent(newDateObj)+'&';
            filterParam += encodeURIComponent('flight.depart_day[after]')+'='+encodeURIComponent(this.flightDate);
        }
        
        let scheduleLeg = '';
        // this.legs.forEach(element => {
        //     scheduleLeg += 'schedule_leg[]='+element+'&';
        // });
        // this.legs.map(x=>{
        //     filterParam += x;
        // });
        filterParam += scheduleLeg;
        // console.log(filterParam);
        
        return filterParam;
    }



    segmentSearch(
        originAirportId: number,
        destinationAirportId: number,
        date: string,
        AD: number,
        CH: number,
        IN: number,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            // ${environment.serverURL}/flight-search?depart=${arrive_airport}&arrive=${depart_airport}&depart_date=${return_date}&CH=${passengers.noOfChildren}&AD=${passengers.noOfAdults}&IN=${passengers.noOfInfants}`
            this._httpClient
                .get(
                    // `${environment.serverURL}/flight-search?depart=${originAirportId}&arrive=${destinationAirportId}&depart_date=${date}`
                    `${environment.serverURL}/flightsearchdbr?depart=${originAirportId}&arrive=${destinationAirportId}&depart_date=${date}&AD=${AD}&CH=${CH}&IN=${IN}`
                )
                .subscribe((response: any) => {
                    // console.log({ segmentSearchHTTPResponse: response });
                    // const data = response;
                    this.flights = response.data;
                    this.passengerNumber = this.flights[0]?.no_of_passengers;
                    this.flightSearchResult.next(this.flights);
                    this.flightSearchResultData.next(response);
                    this.noOfPassengersObj.next({adult: AD, child: CH, infant: IN});
                    // console.log('Flight search noPax',this.noOfPassengersObj);
                    this.noOfPassengers.next(AD + CH + IN);
                    resolve(response);
                }, reject);
        });
    }
}
