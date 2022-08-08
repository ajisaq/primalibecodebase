import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, ParamMap } from '@angular/router';
import { BatService } from 'src/app/services/bat.service';
import { FlightSearchComponent } from 'src/app/components/flight-search/flight-search.component';
import { FlightSearchService } from '../../../services/flightSearch.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FuseConfirmDialogComponent } from 'src/@fuse/components/confirm-dialog/confirm-dialog.component'; 
// import { ChangeFlightFormComponent } from '../change-flight-form/change-flight-form.component';
import { NewFlightChangeComponent } from '../new-flight-change/new-flight-change.component';
@Component({
  selector: 'app-change-flight',
  templateUrl: './change-flight.component.html',
  styleUrls: ['./change-flight.component.css', '../../flight-search/flight-search.component.css']
})
export class ChangeFlightComponent implements OnInit {
  PNR : any;
  allFlightsOnPNR: any[] = [];
  changeFlightForm: any = {};
  changeFlightRequest: any  = {};
  startSearch: boolean = false;
  passengerTypes: any;
  newBookingLeg: any
  bookingLegs: any[] = [];
  noAdult: string = '';
  noChild: string = '';
  noInfant: string = '';
  previousPayments: any;
  bookingForm: FormGroup;


  /**
     * Constructor
     *
     * @param {MatDialogRef<FlightChangeDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder,
     */

  constructor(
      private batService : BatService,
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private flightSearchService: FlightSearchService,
      private activatedRoute: ActivatedRoute,
      private fb: FormBuilder,
      private cd: ChangeDetectorRef,

  ) {

    this.changeFlightRequest = {
      origin: '1',
      destination: '2',
      departureDate: "2022-04-12",
      adult: "1",
      child: "0",
      infant: "0"
};

    this.changeFlightForm = this.formBuilder.group({
      adult: this.noAdult,
      infant: this.noChild,
      child: this.noInfant,
      originAirportID: [null],
      destinationAirportID: [null],
      origin: [null,[Validators.required]],
      destination: [null,[Validators.required]],
      departureDate: this.changeFlightForm.departureDate,
    });
    // this.bookingLeg = _data.bookingLeg;

   }


  ngOnInit(): void {
      this.flightsOnPNR();
      
  }

  flightsOnPNR(){
    this.route.paramMap.subscribe((params: any) => {
        this.PNR = params.params.pnr;
        this.batService.getPNRFromSearch2(this.PNR).then((booking: any)=> {
          console.log(booking);
          this.route.queryParams.subscribe(params =>{
            this.previousPayments = params;
            console.log(this.previousPayments)
          })

          this.bookingLegs = booking.bookingLegs

          console.log(this.bookingLegs);

              
          })

        })


        this.batService.onBookingFormChanged
            .subscribe((bookingForm:FormGroup)=>{
                this.bookingForm = bookingForm;
                console.log(this.bookingForm);
            });

  }


  
  openDialog(templateRef: any, flight: any) {
    
    this.dialog.open(templateRef);
    console.log(flight);
    this.changeFlightForm.origin = flight.depart;
    this.changeFlightForm.patchValue({
      adult: this.noAdult,
      child: this.noChild,
      infant: this.noInfant,
      origin: flight.departAirportID,
      destination: flight.arriveAirportID,
      // originAirportID: flight.departAirportID,
      // destinationAirportID: flight.arriveAirportID,
      departureDate: moment(this.changeFlightForm.departureDate).format('yyyy-MM-DD')
    })
    this.newBookingLeg = this.changeFlightForm.value;
    console.log(this.changeFlightRequest);
  }


  getPassengersFormDropDownFormValues(passengerTypeNumbers: any) {
    this.passengerTypes = passengerTypeNumbers;
    this.changeFlightForm.patchValue({
      passengers: {
        adult: this.passengerTypes.adult,
        child: this.passengerTypes.child,
        infant: this.passengerTypes.infant
      }
    });

    this.noAdult = `${passengerTypeNumbers.adult} Adults, `;
    this.noChild = ` ${passengerTypeNumbers.child} Children and `;
    this.noInfant = ` ${passengerTypeNumbers.infant} Infants `;
  }



onSelectFlight(bookingLeg){
  console.log(bookingLeg);
  let dialogRef = this.dialog.open(NewFlightChangeComponent, {
      panelClass: 'flight-change-dialog',
      data: {
          bookingForm: this.bookingForm,
          bookingLeg: bookingLeg
      },
      minWidth: '65%',
      maxWidth: "95%"
  });

  dialogRef.afterClosed()
      .subscribe(response => {
          if (!response) {
              return;
          }
      });

}





  onSubmit() {

    // this.bookingLeg;
    //     debugger;
    //     this.batService.changeFlight(this.bookingLeg.id, this.newBookingLeg.getRawValue())
    //         .then(data=>{
    //             console.log(data);
    //         })


  //   let params: any = new URLSearchParams({
  //       origin: this.changeFlightRequest.origin, 
  //       destination: this.changeFlightRequest.destination, 
  //       departureDate: this.changeFlightForm.value.departureDate,
  //       adult: this.passengerTypes.adult,
  //       infant: this.passengerTypes.infant,
  //       child: this.passengerTypes.child
  //   }).toString();
  //   console.log('urlparams',params);
  //   this.startSearch = true;
  //   this.router.navigateByUrl(`/payment?${params}`);
    
  }


}
