import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Dropdown } from 'src/app/models/dropdown.model';
import { BatService } from 'src/app/services/bat.service';
import { BookingClustersService } from 'src/app/services/booking-clusters.service';
import { CabinClassesDropdownService } from 'src/app/services/cabin-classes.service';
import { AirportsDropdownService } from 'src/app/services/dropdowns.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FlightSearchComponent } from '../../flight-search/flight-search.component';
import { FlightSearchService } from 'src/app/services/flightSearch.service';
import { isString } from 'lodash';
declare var PaystackPop:any;
@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  @Output() submitStatus = new EventEmitter();
  isLoading: boolean = false;
  isSubmitted: boolean = true;
  show: boolean = true;
  bookingForm: FormGroup = new FormGroup({});
  flightSummaryDetails: any[] = [];
  pricingDetails: any = {
    ticketCost: 0,
    totalTaxAmount: 0,
    totalSurcharge: 0,
    serviceCharge: 500,
    totalticketCost: 0
  };
  cabinClasses: Dropdown[] = [];
  indexedCabinClasses: any = {};
  bookingClusters: Dropdown[] = [];
  indexedBookingClusters: any = {};
  airports: Dropdown[] = [];
  indexedAirports: any = {};
  flightDuration: any = '';
  noOfPassengers: number = 0;

  constructor(
      private batService: BatService, 
      private flightSearchService: FlightSearchService,
      private router: Router, 
      public dialog: MatDialog
    ) {
      if(this.router.url !== '/payment') {
        this.show = false;
      }

      this.flightSearchService.noOfPassengersObj.pipe().subscribe((noOfPax: any) => {
        this.noOfPassengers = noOfPax;
        // console.log('No of pax returning',this.noOfPassengers);
      })
      
    this.batService.onIndexedAirportsChanged.subscribe((indexedAirports: any) => this.indexedAirports = indexedAirports);
    this.batService.onIndexedCabinClassesChanged.subscribe((indexedCabinClasses: any) => this.indexedCabinClasses = indexedCabinClasses);
    this.batService.onIndexedBookingClustersChanged.subscribe((indexedBookingClusters: any) => this.indexedBookingClusters = indexedBookingClusters);
    // this.batService.onIndexedPassengerTypesChanged.subscribe((indexedPassengerTypes: any) => this.indexedPassengerTypes = indexedPassengerTypes);

      this.batService.onBookingFormChanged.subscribe(bookingForm => {
        this.bookingForm = bookingForm;
        this.getFlightSummary();
        // console.log('Booking form in summary card:',this.bookingForm);
      });
   }

  ngOnInit(): void {
    // this.getFlightSummary();

    console.log('Is loading:',);
    
  
    // console.log( this.indexedCabinClassesDropdown, this.indexedAirports );
  }

  get bookingLegs(): FormArray {
    return this.bookingForm.get('bookingLegs') as FormArray;
  }

  openDialog() {
    this.dialog.open(FlightSearchComponent);
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
    this.bookingLegs.getRawValue().forEach((bookingLeg: any) => {
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
           serviceCharge: bookingLeg.bookingLegFare?.serviceCharge,
          //  numberOfPassengers: bookingLeg?.bookingLegStops[0].noOfPassengers
           numberOfPassengers: this.noOfPassengers,
         },
         clusterRules: this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegFare.bookingClass ? bookingLeg?.bookingLegFare.bookingClass : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.bookingClusterRules,
      };
      this.pricingDetails = {
        ticketCost: this.pricingDetails.ticketCost+bookingLeg.bookingLegFare?.price,
        totalTaxAmount: this.pricingDetails.totalTaxAmount+bookingLeg.bookingLegFare?.tax,
        // totalSurcharge: this.pricingDetails.totalSurcharge+this.getBookingClusterFromBookingClass(bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass)?.surchargeAmount,
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

  submitPassengerInformation(): void {
    this.isLoading = true;
    this.submitStatus.emit(this.isSubmitted);
    // console.log('toast cluster ', this.getBookingClusterFromBookingClass(this.flightSummaryDetails[0]?.bookingClass));
  }

  payWithPaystack(e: any) {
    e.preventDefault();
    let handler = PaystackPop.setup({
      key: 'pk_test_aa7bd5057116124433b5d6fed01333365febcd11', // Replace with your public key
      email: 'ubsribadu@gmail.com',
      amount: this.pricingDetails.totalticketCost * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1) + this.bookingForm.value.recordLocator, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        alert('Window closed.');
      },
      callback: function(response: any){
        let message = 'Payment complete! Reference: ' + response.reference;
        alert(message);
      }
    });
    handler.openIframe();
  }

  payWithCash() {
    let bookingId = this.bookingForm.controls['id'].value;
    let pnr = this.bookingForm.controls['recordLocator'].value;
    let amount = this.pricingDetails.totalticketCost;
          this.batService.addCashPayment(pnr, amount)
            .then(response=>{
              this.batService.createTickets(bookingId)
                .then(data=>{
                  //onSearch PNR
                  this.batService.onResetOpenPNR.next(data.PNR);
                  this.goToNextStep();
                });
            });
  }

  payLater() {
    let pnr = this.bookingForm.controls['recordLocator'].value;
      this.batService.addBookingHold(pnr)
        .then(data=>{
          //onSearch PNR
          this.batService.onResetOpenPNR.next(data.PNR);
        });
    this.goToNextStep();
  }

  goToNextStep(): void {
    // console.log('Go to next mat step', this.batService.goToNextMatStep());
    // this.batService.goToNextMatStep();
    this.batService.continueToPassengerInformation.next(true);
    this.batService.goToNextMatStep();
  }
  

}
