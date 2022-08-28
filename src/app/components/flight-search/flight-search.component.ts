import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BatService } from 'src/app/services/bat.service';
import { Booking } from 'src/app/models/booking.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Dropdown } from 'src/app/models/dropdown.model';
import { AirportsDropdownService } from 'src/app/services/dropdowns.service';
import { FlightSearchService } from 'src/app/services/flightSearch.service';
import { isString, now } from 'lodash';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FlightSearchComponent {
  isSearching: boolean = false;
  noAdult: string = '';
  isLoading: boolean = false;
  noChild: string = '';
  noInfant: string = '';
  passengerTypes: any;
  flights: any[] = [];
  passengerNumber: any;
  airportsDropdown?: Dropdown[];
  airports: any = [];

  originOptions: any[] = [];
  destinationOptions: any[] = [];
  filteredOriginOptions: Observable<any[]> | undefined;
  filteredDestinationOptions: Observable<any[]> | undefined;
  originControl = new FormControl();
  destinationControl = new FormControl();

  isSelected: string = 'oneWay';
  pnrInfo:any = {};
  pnrToSearch: string = '';
  flightSearchForm: any
  tripTypeForm = new FormGroup({
    tripType: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private batService : BatService,
    private flightSearchService: FlightSearchService, 
    private airportsDropdownService: AirportsDropdownService
    ) {     
    
      this.airportsDropdownService.getAirportsDropdown().then(data => {
        this.airportsDropdown = data;
        this.airportsDropdown?.map((airport: any) => {
          this.originOptions.push(airport);
          this.destinationOptions.push(airport);
        } )
        // console.log('destinations',this.destinationOptions);
        // console.log('origins',this.originOptions);
        this.filteredOriginOptions = this.originControl.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            if(isString(value)){
              return this._originFilter(value)
            }
              return this._originFilter(value.city.name)
            
          }),
        );
        this.filteredDestinationOptions = this.destinationControl.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            if(isString(value)){
              return this._destinationFilter(value)
            }else{
              return this._destinationFilter(value.city.name)
            }
          }),
        );
      });

      let todayDate = moment();

      this.flightSearchForm = this.formBuilder.group({
        tripType: [this.isSelected,[Validators.required]],
        passengers: this.formBuilder.group({
          adult: [1, Validators.required],
          child: [0],
          infant: [0]
        }),
        // currency: [""],
        // segments: this.getSegmentSearchArray(),
        origin: [null,[Validators.required]],
        destination: [null,[Validators.required]],
        departureDate: [todayDate.format('yyyy-MM-DD'),[Validators.required]],
        returnDate: [],
      });
      this.flightSearchForm.controls['tripType'].valueChanges
        .subscribe((val: string)=>{
          let returnCtrl = this.flightSearchForm.controls['returnDate'] as FormControl;
          if(val=='oneWay'){
            returnCtrl.setValidators([]);
          }else if(val=='roundTrip'){
            returnCtrl.setValidators(Validators.required);
            let defaultDate = moment(this.flightSearchForm.value.departureDate);
            returnCtrl.setValue(defaultDate.clone().add(+1, 'days').format('yyyy-MM-DD'));
          }
        })
      this.flightSearchForm.controls['departureDate'].valueChanges
        .subscribe((val: string)=>{
          let returnCtrl = this.flightSearchForm.controls['returnDate'] as FormControl;
          if(this.flightSearchForm.value.tripType=='roundTrip'){
            let newDate = moment(val);
            returnCtrl.setValue(newDate.clone().add(+1, 'days').format('yyyy-MM-DD'));
          }
        })
      // calling below function to remove error for expression changed after it was checked on noAdult
      this.getPassengersFormDropDownFormValues(this.flightSearchForm.controls.passengers.value);
  }

  ngOnInit(): void { }

  private _originFilter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.originOptions.filter(option => option.extra.city.name.toLowerCase().includes(filterValue));
  }

  private _destinationFilter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationOptions.filter(option => option.extra.city.name.toLowerCase().includes(filterValue));
  }

  onSubmit() {

    //  this.searchFlight();
    //  console.log('Form Value is', this.flightSearchForm.value);
    if (this.flightSearchForm.status == 'VALID'){
      // Navigate to the result page with extras
      this.isSearching = true;
      this.flightSearchService.isLoadingFlights.next(this.isSearching);
      this.batService.isNewBooking.next(true);
      let params: any = new URLSearchParams(
        {origin: this.flightSearchForm.value.origin, 
        destination: this.flightSearchForm.value.destination, 
        departureDate: this.flightSearchForm.value.departureDate,
        adult: this.flightSearchForm.value.passengers.adult,
        child: this.flightSearchForm.value.passengers.child,
        infant: this.flightSearchForm.value.passengers.infant}
        ).toString();
      // console.log('urlparams',params);
      this.router.navigateByUrl(`/payment?${params}${(this.flightSearchForm.value.tripType == 'roundTrip') ? '&returnDate='+this.flightSearchForm.value.returnDate : ''}`);
    }
  }
  selectedOrigin(event: MatAutocompleteSelectedEvent): void {
    this.flightSearchForm.patchValue({
      origin: event.option.value.id
    })
    this.originControl.setValue(event.option.viewValue)
    console.log(event, this.flightSearchForm.value);
  }

  selectedDestination(event: MatAutocompleteSelectedEvent): void {
    this.flightSearchForm.patchValue({
      destination: event.option.value.id
    })
    this.destinationControl.setValue(event.option.viewValue)
    console.log(event, this.flightSearchForm.value);
  }

  getPassengersFormDropDownFormValues(passengerTypeNumbers: any) {
    this.passengerTypes = passengerTypeNumbers;
    this.flightSearchForm.patchValue({
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
  submit() {}

  changeTripTypeHandler(e: any) {
    this.isSelected = e.target.value ;
  }


  
  searchPNR(e: any) {
    this.isLoading = true;
    e.preventDefault();
    console.log(this.pnrToSearch.toUpperCase());
    this.batService.getPNRFromSearch2(this.pnrToSearch)
    .then((resp)=>{
      this.isLoading = false;
      console.log(resp);
      if(resp.status === 'NEW'){
        console.log('No such PNR');
        this.isLoading = false;
        return
      }
        this.router.navigate(['/manage-booking', this.pnrToSearch]);
      
  })
  .catch(err=>{
    console.log(err)
    this.isLoading = false;
      //notify errs
  })
}

  


}
