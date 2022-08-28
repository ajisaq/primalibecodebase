import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { BatService } from 'src/app/services/bat.service';
import { MatStepper } from '@angular/material/stepper';
import { FlightSearchService } from 'src/app/services/flightSearch.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
  @ViewChild('stepper') public myStepper!: MatStepper;
  stepper = this.myStepper;
  isLoadingFlights: boolean = false;
  isSubmitted: boolean = false;
  isNewBooking : boolean = false;
  isLinear = true;
  isStepCompleted : any = {
    'selection' : false,
    'payment' : false
  };
  id: any = '';

  constructor(
    private batService: BatService,
    private flightSearchService: FlightSearchService
    ) { 
      this.flightSearchService.isLoadingFlights.pipe().subscribe(res => {
        this.isLoadingFlights = res;
        // console.log('payment loading status', this.isLoadingFlights);
        
      });
      this.batService.continueToPassengerInformation.pipe().subscribe(res => {
        if(res) {
          this.myStepper.next();
        }
      });
      this.batService.bookingPaymentFloor.pipe().subscribe(res => {
        res == 'selection' ? this.isStepCompleted.selection = true : null;
        res == 'payment' ? this.isStepCompleted.payment = true : null;
      });
      this.batService.isNewBooking.pipe().subscribe(res => {
        this.isNewBooking = res;
      });
  }

  // setIsLoading() {
  //   this.flightSearchService.isLoadingFlights.pipe().subscribe(loadingStatus => this.isLoadingFlights = loadingStatus);
  // }

  ngOnInit(): void {
    // this.isLoadingFlights = true;
  }

  setIsSubmitted(): boolean {
     return this.isSubmitted = true;
  }
}
