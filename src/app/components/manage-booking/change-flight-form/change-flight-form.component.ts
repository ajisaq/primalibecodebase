import { Component, Inject,  ViewEncapsulation, OnInit, OnDestroy  } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { Flight } from '../../../models/flight.model';
import { FlightSearchService } from 'src/app/services/flightSearch.service';
import { BatService } from "../../../services/bat.service";

@Component({
  selector: 'app-change-flight-form',
  templateUrl: './change-flight-form.component.html',
  styleUrls: ['./change-flight-form.component.css']
})
export class ChangeFlightFormComponent implements OnInit {
    changeFlightForm: any;
    origin = new FormControl();
    destination = new FormControl();

    action: string;
    bookingForm: FormGroup;
    bookingLeg: any;
    newBookingLeg: any;
    flightSearchForm: FormGroup;
    passengerTypes: any;
    flights: any[] = [];
    showFlightCard: boolean = false;
    adult: any[] = [];
    infant: any[] = [];
    child: any[] = [];

    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ChangeFlightFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder,
     */


  constructor(
    private formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<ChangeFlightFormComponent>,
    private batService: BatService,
    private flightSearchService: FlightSearchService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private fb: FormBuilder,
  ) { 
    this.action = _data.action;

    this.bookingForm = _data.bookingForm;
    this.bookingLeg = _data.bookingLeg;
    this.newBookingLeg    =  _data.newBookingLeg


    this.flightSearchForm = this.fb.group({
        AD: [1,[Validators.required]],
        CH: [0,[]],
        IN: [0,[]],
        segments: this.getSegmentSearchArray(),
    });
    
    this._unsubscribeAll = new Subject();
}




  ngOnInit(): void {
  }


  getSegmentSearchArray(){
    let resultArray = this.fb.array([]);
        console.log(this.bookingLeg)
        this.changeFlightForm = this.formBuilder.group({
        origin: [ { value: this.bookingLeg.flight.depart_airport.state, disabled: true } ],
        destination: [ { value: this.bookingLeg.flight.arrive_airport.state, disabled: true } ],
        departureDate: [moment(this.bookingLeg.flight.depart_date).format('yyyy-MM-DD'),[Validators.required]],
      });
}


onSubmit(){
    console.log(this.changeFlightForm);
    console.log(this.bookingLeg);

    this.flightSearchService.segmentSearch(
        this.bookingLeg.flight.depart_airport.id, 
        this.bookingLeg.flight.arrive_airport.id, 
        this.changeFlightForm.controls.departureDate.value, 
        1, 0, 0
        // this.changeFlightForm.value.passengers.adult,
        // this.changeFlightForm.value.passengers.child,
        // this.changeFlightForm.value.passengers.infant
        )
          .then(response => {
            this.flights = response.data;
            // this.showFlightCard = true;
           
            console.log(this.flights);
            
            // console.log("Flight search is successful", this.flights);
          })
          .catch(error => console.log(error)
          );
}

}
