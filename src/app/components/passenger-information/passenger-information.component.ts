import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { FlightSearchService } from 'src/app/services/flightSearch.service';
import { BatService } from 'src/app/services/bat.service';

@Component({
  selector: 'app-passenger-information',
  templateUrl: './passenger-information.component.html',
  styleUrls: ['./passenger-information.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class PassengerInformationComponent implements OnInit, OnChanges {
  @Input() isSubmitted?: boolean;

  bookingForm: FormGroup = new FormGroup({});
  noOfPassengers: any = {};
  passengersInformationForm: any;
  passengerGender: string = ''

  constructor(private formBuilder: FormBuilder, private flightSearchService: FlightSearchService, private batService: BatService) {
    this.flightSearchService.noOfPassengersObj.pipe().subscribe((noOfPax: any) => {
      // console.log('Live noOfPax',noOfPax);
      
      this.noOfPassengers = {...noOfPax};
      // console.log('No of pax returning',typeof(this.noOfPassengers.adult));
      this.generatePaxForms();
    });
    this.batService.onBookingFormChanged.subscribe(bookingForm => {
      this.bookingForm = bookingForm;
      // console.log(this.bookingForm);
    });
    
    
    this.passengersInformationForm = this.formBuilder.group({
      adult: this.formBuilder.array([]),
      child: this.formBuilder.array([]),
      infant: this.formBuilder.array([]),
      // contacts: this.formBuilder.array([])
    });
   }

  ngOnChanges(changes: SimpleChanges): void {
   

    if(changes['isSubmitted'].currentValue === true) {
      this.onSubmit();
    }
  }

  ngOnInit(): void {

    this.batService.onBookingFormChanged.subscribe(bookingForm => {
      this.bookingForm = bookingForm
      // console.log(bookingForm.getRawValue());
    });
  }

  // Get the adult form group
  
  get bookingPassengers() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  get adult() {
    return this.passengersInformationForm.get('adult') as FormArray;
  }

  get child() {
    return this.passengersInformationForm.get('child') as FormArray;
  }

  get infant() {
    return this.passengersInformationForm.get('infant') as FormArray;
  }

  get singleAdult(): any {
    return this.adult.controls as unknown as FormGroup;
  }

  // get contacts() {
  //   return this.passengersInformationForm.get('contacts') as FormArray;
  // }

  addAdultFormGroup(num: number): any {
    this.adult.clear();
    for(let i = 0; i < num; i++) {
      this.adult.push(this.formBuilder.group({
        title: ['', Validators.required],
        gender: [this.passengerGender, Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required],
        email: [''],
        address: ['adresssss'],
        dateOfBirth: ['2022-03-05', Validators.required],
        passengerType:['/api/passenger_types/1'],
      })); 
      this.adult.markAsDirty();
    }
  }

  addChildFormGroup(num: number): any {
    this.child.clear();
    for(let i = 0; i < num; i++) {
      this.child.push(this.formBuilder.group({
        title: ['', Validators.required],
        gender: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        phone: [''],
        address: ['adresssss'],
        dateOfBirth: ['2022-03-05', Validators.required],
        passengerType:['/api/passenger_types/2'],
      })); 
    }
  }

  addInfantFormGroup(num: number): any {
    this.infant.clear();
    for(let i = 0; i < num; i++) {
      this.infant.push(this.formBuilder.group({
        title: ['', Validators.required],
        gender: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        phone: [''],
        address: ['adresssss'],
        dateOfBirth: ['2022-03-05', Validators.required],
        passengerType:['/api/passenger_types/3'],
      })); 
    }
  }

  // addContactsFormGroup(): any {
  //     return this.infant.push(this.formBuilder.group({
  //       title: ['', Validators.required],
  //       gender: [this.passengerGender, Validators.required],
  //       firstName: ['', Validators.required],
  //       lastName: ['', Validators.required],
  //       phone: ['', Validators.required],
  //       email: ['', Validators.required],
  //       dateOfBirth: ['', Validators.required],
  //     })); 
  // }

  setPassengerGender(e: any, index: any) {
    if(e.target.value === 'Mr') {
      this.passengerGender = 'male'
    } else {
      this.passengerGender = 'female'
    }
    this.singleAdult[index].patchValue({gender: this.passengerGender}, {emitEvent: true});
    // this.singleAdult[index].get('gender').value = this.passengerGender;
    // this.adult.controls[index].value.gender = this.passengerGender;
    // this.passengersInformationForm.get('adult')[index].patch({
    //   gender: this.passengerGender
    // });
    
    // console.log(this.passengerGender, 'Index of the touched passenger:', 'Single Adult', this.singleAdult[index].get('gender'));
  }

  generatePaxForms() {

    this.addAdultFormGroup(Number(this.noOfPassengers.adult));
    this.addChildFormGroup(Number(this.noOfPassengers.child));
    this.addInfantFormGroup(Number(this.noOfPassengers.infant));
  }

  onSubmit(): void {
    let allPassengers = this.adult.value.concat(this.child.value, this.infant.value);
    
    // allPassengers.forEach((singlePassenger: any)=>{
    //   this.bookingPassengers.push(new FormGroup(singlePassenger));
    //   // this.bookingForm.controls['passengers'].value.push(singlePassenger);
    //   this.bookingForm.controls['passengers'].markAsDirty();
    // }) 
    this.adult.controls.forEach((singlePassenger)=>{
      this.bookingPassengers.push(singlePassenger);
    });

    this.child.controls.forEach(singlePassenger => {
      this.bookingPassengers.push(singlePassenger);
    });

    this.infant.controls.forEach(singlePassenger => {
      this.bookingPassengers.push(singlePassenger);
    });
    // this.bookingForm.controls['passengers'].setValue(allPassengers);
    // this.bookingForm.patchValue({passengers: allPassengers});
    // console.log('add pax to form', this.bookingForm, this.bookingForm.getRawValue());
    this.batService.onBookingFormChanged.next(this.bookingForm);
    this.batService.onCreatePNRButtonClicked.next(true);
    // console.log('passenger info form value',this.passengersInformationForm.value, allPassengers, 'ho hi', this.bookingPassengers, this.bookingForm, this.bookingForm.getRawValue());
  }

}
