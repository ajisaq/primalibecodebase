// import { Injectable } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { BehaviorSubject, forkJoin } from "rxjs";
// import { environment } from "environments/environment";
// import { BatService } from "../bat.service";

// @Injectable({ providedIn: "root" })
// export class FlightSearchService {
//     onFlightsChanged: BehaviorSubject<any>;
//     flights: any[] = [];
//     passengerNumber: number;

//     constructor(
//         private _httpClient: HttpClient,
//         private batService: BatService
//     ) {
//         this.onFlightsChanged = new BehaviorSubject([]);
//         this.batService.flightsAdded.subscribe((flightIRIs) => {
//             console.log(flightIRIs);
//             const searchUrls = [];
//             flightIRIs.forEach((flightIRI) => {
//                 searchUrls.push(
//                     this._httpClient.get(`${environment.serverURL}${flightIRI}`)
//                 );
//             });

//             forkJoin(searchUrls).subscribe((results) => {
//                 // console.log({ results });
//                 this.flights = results;
//                 this.onFlightsChanged.next(this.flights);
//             });
//         });
//     }

//     getDepartures(): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this._httpClient
//                 .get(environment.serverURL + "/api/flights")
//                 .subscribe((response: any) => {
//                     console.log({ getDeparturesHTTPResponse: response });
//                     this.flights = response["hydra:member"];
//                     this.onFlightsChanged.next({ flights: this.flights });
//                     resolve(this.flights);
//                 }, reject);
//         });
//     }

//     segmentSearch(
//         originAirportId: number,
//         destinationAirportId: number,
//         date: string,
//         AD: number,
//         CH: number,
//         IN: number,
//     ): Promise<any> {
//         return new Promise((resolve, reject) => {
//             // ${environment.serverURL}/flight-search?depart=${arrive_airport}&arrive=${depart_airport}&depart_date=${return_date}&CH=${passengers.noOfChildren}&AD=${passengers.noOfAdults}&IN=${passengers.noOfInfants}`
//             this._httpClient
//                 .get(
//                     // `${environment.serverURL}/flight-search?depart=${originAirportId}&arrive=${destinationAirportId}&depart_date=${date}`
//                     `${environment.serverURL}/flightsearchdbr?depart=${originAirportId}&arrive=${destinationAirportId}&depart_date=${date}&AD=${AD}&CH=${CH}&IN=${IN}`
//                 )
//                 .subscribe((response: any) => {
//                     console.log({ segmentSearchHTTPResponse: response });
//                     // const data = response;
//                     this.flights = response.data;
//                     this.passengerNumber = this.flights[0].no_of_passengers;
//                     // console.log({ response });
//                     resolve(response);
//                 }, reject);
//         });
//     }
// }



// searchFlight() {}