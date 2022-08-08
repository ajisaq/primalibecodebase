import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-passenger-type-dropdown',
  templateUrl: './passenger-type-dropdown.component.html',
  styleUrls: ['./passenger-type-dropdown.component.css']
})
export class PassengerTypeDropdownComponent implements OnInit {

  passengerNumbersForm: FormGroup;
  @Output() passengerNumbersFormValue = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { 
    this.passengerNumbersForm = formBuilder.group({
      adult: new FormControl(1,[Validators.min(1),Validators.max(9)]),
      child: new FormControl(0,[Validators.min(0),Validators.max(9)]),
      infant: new FormControl(0,[Validators.min(0),Validators.max(9)])
    });
  }

  ngOnInit(): void {
    this.passengerNumbersFormValue.emit(this.passengerNumbersForm.value);
  }

  onSubmit() {
    this.passengerNumbersFormValue.emit(this.passengerNumbersForm.value); 
    // console.log(this.passengerNumbersForm.value);
  }

  add(e:any, target: string) {
    let targetCtrl = this.passengerNumbersForm.controls[target] as FormControl;
    targetCtrl.patchValue(targetCtrl.value+1);    
    this.passengerNumbersFormValue.emit(this.passengerNumbersForm.value);
  }

  reduce(e:any,target:string) {
    let targetCtrl = this.passengerNumbersForm.controls[target] as FormControl;
    targetCtrl.patchValue(targetCtrl.value-1);
    this.passengerNumbersFormValue.emit(this.passengerNumbersForm.value);
  }

  // emitFormValue() {    
  //   this.passengerNumbersFormValue.emit(this.passengerNumbersForm.value)
  //   console.log( this.passengerNumbersForm.value);
    
  // }
}
