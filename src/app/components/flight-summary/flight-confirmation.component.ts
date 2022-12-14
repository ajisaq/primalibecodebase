import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Dropdown } from 'src/app/models/dropdown.model';
import { BatService } from 'src/app/services/bat.service';
import { BookingClustersService } from 'src/app/services/booking-clusters.service';
import { CabinClassesDropdownService } from 'src/app/services/cabin-classes.service';
import { AirportsDropdownService } from 'src/app/services/dropdowns.service';

@Component({
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrls: ['./flight-confirmation.component.css']
})
export class FlightConfirmationComponent implements OnInit {
  @Input() mode:boolean = false;
  show: boolean = true;
  bookingForm: FormGroup = new FormGroup({});
  flightSummaryDetails: any[] = [];
  pricingDetails: any = {
    ticketCost: 0,
    totalTaxAmount: 0,
    totalSurcharge: 0,
    serviceCharge: 500,
    flightChangeFee: 0,
    totalticketCost: 0
  };
  flightPassengers: any[] = [];
  cabinClassesDropdown: Dropdown[] = [];
  indexedCabinClasses: any = {};
  bookingClusters: Dropdown[] = [];
  indexedBookingClusters: any = {};
  airports: Dropdown[] = [];
  indexedAirports: any = {};
  flightDuration: any = '';
  flightExpiryTime: any = '';

  constructor(
      private batService: BatService, 
      private cabinClassesDropdownService: CabinClassesDropdownService,
      private bookingClustersService: BookingClustersService, 
      private _airportsDropdownService: AirportsDropdownService,
      private router: Router
    ) {
      this.batService.onIndexedAirportsChanged.subscribe((indexedAirports: any) => this.indexedAirports = indexedAirports);
      this.batService.onIndexedCabinClassesChanged.subscribe((indexedCabinClasses: any) => this.indexedCabinClasses = indexedCabinClasses);
      this.batService.onIndexedBookingClustersChanged.subscribe((indexedBookingClusters: any) => this.indexedBookingClusters = indexedBookingClusters);
      // this.batService.onIndexedPassengerTypesChanged.subscribe((indexedPassengerTypes: any) => this.indexedPassengerTypes = indexedPassengerTypes);
      
      this.batService.onBookingFormChanged.subscribe(bookingForm => {
        this.bookingForm = bookingForm;
        // console.log('updated BookingForm',this.bookingForm);
        this.getFlightSummary();
      });
   }

  ngOnInit(): void {
    // this.getFlightSummary();
  
    // console.log( this.indexedCabinClassesDropdown, this.indexedAirports );
  }

  get bookingLegs() {
    return this.bookingForm.get('bookingLegs') as FormArray;
  }
  
  get passengers() {
    return this.bookingForm.value.passengers;
  }

  getFlightSummary(): any[] {
    this.flightSummaryDetails = [];
    this.pricingDetails = {
      ticketCost: 0,
      totalTaxAmount: 0,
      totalSurcharge: 0,
      serviceCharge: 500,
      totalticketCost: 0
    };


    // console.log('paxxx',this.bookingLegs.getRawValue()[0]);
    
    this.bookingLegs.getRawValue().forEach((bookingLeg: any) => {
      // console.log('getting pax name', moment(bookingLeg.expireAt).format('MMMM Do YYYY, h:mm:ss a'));
      let duration = (moment(bookingLeg.flight?.arriveDate, 'YYYY-MM-DD\THH:mm:ss').diff(moment(bookingLeg.flight?.departDate, 'YYYY-MM-DD\THH:mm:ss')));
      let flightSummaryDetail = {
        flightNumber: bookingLeg.flight?.flightNumber,
         dapartAirportCode: this.indexedAirports[bookingLeg.flight?.departAirport.iri]?.code,
         arriveAirportCode: this.indexedAirports[bookingLeg.flight?.arriveAirport.iri]?.code,
         dapartCity: this.indexedAirports[bookingLeg.flight?.departAirport.iri]?.city?.name,
         arriveCity: this.indexedAirports[bookingLeg.flight?.arriveAirport.iri]?.city?.name,
         dapartDate: moment(bookingLeg.flight?.departDate).format('DD/MM/yyyy'),
         arriveDate: moment(bookingLeg.flight?.arriveDate).format('DD/MM/yyyy'),
         etd: bookingLeg.flight?.etd,
         eta: bookingLeg.flight?.eta,
        //  flightDuration: (moment(bookingLeg.flight?.arriveDate, 'YYYY-MM-DD\THH:mm:ss').from(moment(bookingLeg.flight?.departDate, 'YYYY-MM-DD\THH:mm:ss'), true)), //moment().from(Moment|String|Number|Date|Array, Boolean);
         flightDuration: this.convertDuration(duration), //(moment(bookingLeg.flight?.arriveDate, 'YYYY-MM-DD\THH:mm:ss').diff(moment(bookingLeg.flight?.departDate, 'YYYY-MM-DD\THH:mm:ss'))), //moment.duration(myVar).asSeconds() in milliseconds
        //  flightDuration: moment.utc(moment.duration(bookingLeg.flight?.eta).asSeconds() - moment.duration(bookingLeg.flight?.etd).asSeconds()).format('h:mm'), //moment.duration(myVar).asSeconds()
        //  flightDuration: moment(Date.parse(bookingLeg.flight?.eta) - Date.parse(bookingLeg.flight?.etd)).format('HH:mm'), //moment("2015-01-01").startOf('day').seconds(s).format('H:mm:ss');
         cabinClass: this.indexedCabinClasses[bookingLeg?.cabinClass]?.name,
         bookingClass: bookingLeg?.bookingLegFare.bookingClass ? bookingLeg?.bookingLegFare.bookingClass : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass,
         pricingDetail: {
           totalticketCost: bookingLeg.bookingLegFare?.cost,
           singleAdultCost: bookingLeg.bookingLegFare?.adultCost,
           ticketCost: bookingLeg.bookingLegFare?.price,
           totalTaxAmount: bookingLeg.bookingLegFare?.tax,
           totalSurcharge: this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegFare.bookingClass ? bookingLeg?.bookingLegFare.bookingClass : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.surchargeAmount,
           flightChangeFee: this.mode ? this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegFare.bookingClass ? bookingLeg?.bookingLegFare.bookingClass : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.flightChangeFee : 0,
           serviceCharge: bookingLeg.bookingLegFare?.serviceCharge,
          //  numberOfPassengers: bookingLeg?.bookingLegStops[0].noOfPassengers
          //  numberOfPassengers: this.noOfPassengers,
         },
         clusterRules: this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegFare.bookingClass ? bookingLeg?.bookingLegFare.bookingClass : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.bookingClusterRules,
      };
      this.pricingDetails = {
        ticketCost: this.pricingDetails.ticketCost+bookingLeg.bookingLegFare?.price,
        totalTaxAmount: this.pricingDetails.totalTaxAmount+bookingLeg.bookingLegFare?.tax,
        // totalSurcharge: this.pricingDetails.totalSurcharge+this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.surchargeAmount,
        flightChangeFee: this.pricingDetails.totalSurcharge+this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.flightChangeFee,
        // serviceCharge: this.pricingDetails.serviceCharge+bookingLeg.bookingLegFare?.serviceCharge
        serviceCharge: 500,
        totalticketCost: this.pricingDetails.totalticketCost+this.pricingDetails.serviceCharge+bookingLeg.bookingLegFare?.cost
      }
      this.flightSummaryDetails.push(flightSummaryDetail);
      // console.log('flight summary cluster rules',flightSummaryDetail.clusterRules)
    });
    // arr.reduce((accumulator, current) => accumulator + current.x, 0);
    // console.log('flight summary details:',this.flightSummaryDetails);
    // console.log('pricing summary details:', this.pricingDetails);

    return this.flightSummaryDetails;
  }

  convertDuration(duration: number) {
    let toHourBase = 3600000;
    let hour = Math.floor(duration/toHourBase) + 'hr';	
      let minute = ((duration%toHourBase)/toHourBase) * 60 + 'm';
      return `${hour} ${minute}`;
  }

  getBookingClusterFromBookingClass(bookingClass: string): any {
    let foundIndex = '';
    Object.keys(this.indexedBookingClusters).forEach(clusterIndex => {
      if (foundIndex != '') this.indexedBookingClusters[foundIndex];
      this.indexedBookingClusters[clusterIndex].bookingClasses.forEach((rbd:string)=>{
        if(rbd?.toLowerCase() == bookingClass?.toLowerCase()){
          foundIndex = clusterIndex;
          if (foundIndex != '') return this.indexedBookingClusters[foundIndex];
        }
      }) 
    });
    return this.indexedBookingClusters[foundIndex];
  }

}
