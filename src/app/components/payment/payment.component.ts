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
  @ViewChild('stepper') private myStepper!: MatStepper;
  isLoadingFlights: boolean = false;
  isSubmitted: boolean = false;
  id: any = '';

  constructor(
    private batService: BatService,
    private flightSearchService: FlightSearchService
    ) { 
      this.flightSearchService.isLoadingFlights.pipe().subscribe(res => {
        this.isLoadingFlights = res;
        console.log('payment loading status', this.isLoadingFlights);
        
      });
      this.batService.continueToPassengerInformation.pipe().subscribe(res => {
        if(res) {
          console.log('cont to pax info',res);
          this.myStepper.next();
        }
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
