import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FlightSearchService } from 'src/app/services/flightSearch.service';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AirportsDropdownService } from 'src/app/services/dropdowns.service';
import { Dropdown } from 'src/app/models/dropdown.model';
import { Airport } from 'src/app/models/airports.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { isString } from 'lodash';
@Component({
  selector: 'app-one-way-search-form',
  templateUrl: './one-way-search-form.component.html',
  styleUrls: ['./one-way-search-form.component.css']
})
export class OneWaySearchFormComponent implements OnInit {
  noAdult: string = '';
  noChild: string = '';
  noInfant: string = '';
  passengerTypes: any;
  oneWayForm: any;
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

  @Input() flightSearchForm: any;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
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
      });
    
  }

  ngOnInit(): void {
    // this.oneWayForm = this.formBuilder.group({
    //   origin: ['', Validators.required],
    //   destination: ['', Validators.required],
    //   departureDate: ['', Validators.required],
    //   passengers: this.formBuilder.group({
    //     adult: ['', Validators.required],
    //     child: [''],
    //     infant: ['']
    //   })
    // });

    this.filteredOriginOptions = this.originControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        if(isString(value)){
          return this._originFilter(value)
        }else{
          return this._originFilter(value.city.name)
        }
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
    this.destinationControl.valueChanges.subscribe((airportId)=>{
      // console.log(airportId)
    })
  }

  private _originFilter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.originOptions.filter(option => option.extra.city.name.toLowerCase().includes(filterValue));
  }

  private _destinationFilter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationOptions.filter(option => option.extra.city.name.toLowerCase().includes(filterValue));
  }

  onSubmit() {
   this.searchFlight();
   // console.log('Form Value is', this.oneWayForm.value);
  }

  selectedOrigin(event: MatAutocompleteSelectedEvent): void {
    this.oneWayForm.patchValue({
      origin: event.option.value.id
    })
    this.originControl.setValue(event.option.viewValue)
    // console.log(event, this.oneWayForm.value);
  }

  selectedDestination(event: MatAutocompleteSelectedEvent): void {
    this.oneWayForm.patchValue({
      destination: event.option.value.id
    })
    this.destinationControl.setValue(event.option.viewValue)
    // console.log(event, this.oneWayForm.value);
  }

  getPassengersFormDropDownFormValues(passengerTypeNumbers: any) {
    this.passengerTypes = passengerTypeNumbers;
    this.oneWayForm.patchValue({
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

  searchFlight() {
    this.flightSearchService.segmentSearch(
      this.oneWayForm.value.origin, 
      this.oneWayForm.value.destination, 
      this.oneWayForm.value.departureDate, 
      this.oneWayForm.value.passengers.adult,
      this.oneWayForm.value.passengers.child,
      this.oneWayForm.value.passengers.infant)
        .then(response => {
          this.flights = response.data;
          this.router.navigate(['/one-way']);
          if (response.massage === 'success') {
            
          }
          // console.log(response);
          
          // console.log("Flight search is successful", this.flights);
        })
        .catch(error => console.log(error)
        );
  }

  // goToFlightSearchResutls(): any{
  //   // Redirect to flight search results page
  //   return this.router.navigate(['/one-way']);

  // }

}
