import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class GtoolsService {

  constructor(
    // private _api: ApiService
    private _httpClient: HttpClient,
    private fb: FormBuilder
  ) { }

  // Gender dropdown
  genderList: any = [
    { 'value': 'MR', 'label': 'Mr.' },
    { 'value': 'MRS', 'label': 'Mrs.' },
    { 'value': 'MLE', 'label': 'Ms.' },
  ];

  
  formValidations: any = {Book: {field1: [new FormValidation('NotNull', 'This field is required')]}};

  processFile(key: string, imageInput: any, fileName: string) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      const selectedFile = new ImageSnippet(event.target.result, file);

      // this._api.uploadImage(key, selectedFile.file, fileName).subscribe(
      //   (res) => {

      //   },
      //   (err) => {

      //   })
    });

    reader.readAsDataURL(file);
  }

  showNotification(from: any, align: any, type: any, message: any): void {
    // const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // TODO: implement 
  }

  // Format date of a column
  dateFormatter(params: any): {} {
    return moment(params.value, 'YYYY-MM-DD\THH:mm:ssP').format('DD/MM/YYYY');
  }

  // Format date of a column
  dateTimeFormatter(params: any): {} {
    return moment(params.value, 'YYYY-MM-DD\THH:mm:ssP').format('DD/MM/YYYY HH:mm');
  }

  // Format time of a column
  timeFormatter(params: any): {} {
    return moment(params.value, 'YYYY-MM-DD\THH:mm:ssP').format('HH:mm');
  }

  // Format date to include today for <= conditions
  todayIncludedFormatter(date: any): {} {
    return moment(date).format('YYYY-MM-DD\T23:59:59+01:00');
  }

  // Format date for DB insert
  dbDateFormatter(date: any): {} {
    return moment(date).format('YYYY-MM-DD\THH:mm:ss+01:00');
  }

  // Format date for DB insert
  dbTimeFormatter(time: any): {} {
    // console.log(time);
    return moment(time,'HH:mm:SS',true).format('HH:mm:SS');
  }

  // Format boolean true or false
  boolFormatter(params: any): string {
    let formattedCell = '<span class="text-danger"><i class="material-icons my-2">close</i></span>';
    if (params.value) {
      formattedCell = '<span class="text-success"><i class="material-icons my-2">check</i></span>';
    }
    return formattedCell;
  }

  // Download from server
  downloadFile(data: any, type: string): void {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  // Download ticket
  downloadReceipt(id: number): void {
    // this._api.getPDFReceipt(id).subscribe(
    //   data => this.downloadFile(data, 'application/pdf'),
    //   err => console.log(err)
    // );
  }


  public static compareDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1); const d2 = new Date(date2);

    // Check if the dates are equal
    const same = d1.getTime() === d2.getTime();
    if (same) { return 0; }

    // Check if the first is greater than second
    if (d1 > d2) { return 1; }

    // Check if the first is less than second
    // if (d1 < d2) { return -1; }
    return -1;
  }




  // Set configured fields to uppercase
  formatEditedFieldsValue(form: any): any {
    const fieldsName = ['name'];

    for (const field in form) {

      // Fields value to uppercase
      if (fieldsName.includes(field)) {
        form[field] = form[field].toUpperCase();
      } else {
        // console.log('NOP');
      }
    }
    return form;
  }

  // Get only changed form fields
  // TODO: return all fields if adding new record, to accomodate default fields.
  getChangedFormFields(form: any): any {
    const fb = this.fb;
    const group = fb.group({});
    // For 'Update' or 'View'
    if (form.controls['id'] !== undefined) {
      group.addControl('id', form.controls['id']);
    }
    if (form.controls['iri'] !== undefined) {
      group.addControl('iri', form.controls['iri']);
    }
    // TODO: find better solu for sn
    if (form.controls['sn'] !== undefined) {
      group.addControl('sn', form.controls['sn']);
    }
    // if (form.controls['image_upload'] !== undefined) {
    //   group.addControl('image_upload', form.controls['image_upload']);
    // }
    Object.keys(form.controls).forEach(name => {
      let currentControl: any = form.controls[name];
      // For FormArray instead of Formgroup
      if (currentControl instanceof FormArray){
        let _array = fb.array([]);
        Object.keys(currentControl.controls).forEach(i => {
          const _group = fb.group({});
          const _formGroup: any = currentControl.controls[i];
          // For 'Update' or 'View'
          if (_formGroup.controls['id'] !== undefined && _formGroup.controls['id'].value > 0) {
            _array.push(this.getChangedFormFields(_formGroup));
          }else{
            _array.push(_formGroup);
          }
        });
        group.addControl(name, _array);
      }else{
        if (currentControl.dirty) {
          // If is Date then convert for Database
          if (moment(currentControl.value, 'YYYY-MM-DD HH:mm:SS', true).format() !== 'Invalid date') {
            currentControl.value = this.dbDateFormatter(currentControl.value);
          }
          // TODO: If is Time ..
          // console.log('MOMEN',moment(currentControl.value, 'HH:mm', true).format());
          // if (moment(currentControl.value, 'HH:mm:SS', true).format() != 'Invalid date') {
          //   currentControl.value = this.dbTimeFormatter(currentControl.value);
          // }

          group.addControl(name, currentControl);
        }
      }
    });
    // console.log('RESULT',group.getRawValue())
    return group;
  }

  // Compare field with dropdown
  compareSelect(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.value === v2.id : v1 === v2;
  }
  compareSelectID(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }

  // Get timeout for call
  getTimeout(startDate: any, slaType: any): any {
    const now = moment();
    if (slaType === '4H') {
      slaType = 4 * 3600;
    } else if (slaType === '24H') {
      const today = moment().format('dd');
      slaType = 24 * 3600;
      if (today === 'Sa') {
        slaType = 48 * 3600;
      }
    } else {
      return 0;
    }
    const limite = moment(startDate);

    const seconds = slaType - now.diff(limite, 's');

    const format = Math.floor(moment.duration(seconds, 'seconds').asHours()) + 'h ' + moment.duration(seconds, 'seconds').minutes() + 'm ' + moment.duration(seconds, 'seconds').seconds() + 's';

    return format;
  }


  getOnlyUnique(value: any, index: any, self: any): any { 
    return self.indexOf(value) === index;
  }

  camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  
  snakeToCamelCase = (str: string) => str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
  )

  objectCamelToSnake(obj: any): {} {
    const objResult: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            objResult[this.camelToSnakeCase(key)] = element;
        }
    }
    return objResult;
  }

  objectSnakeToCamel(obj: any): {} {
    let objResult: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            objResult[this.snakeToCamelCase(key)] = element;
        }
    }
    return objResult;
  }


  /**
   * Get form validations for entity
   *
   * @returns {Promise<any>}
   */
  getFormValidations(entity: string): Promise<any> {
    if (!this.formValidations[entity]){
      return new Promise(( resolve, reject ) => {
        this._httpClient.get(`${environment.serverURL}/api/validations/${entity}`)
          .subscribe((response: any) => {
              // console.log('Form Validations', response);
              const validations = response;
              response.forEach((validation: any) => {
                validations[validation.field] = validation.rules.map((rule: any) => {
                    return new FormValidation(rule.constraintType, rule.message);
                  });
              });
              this.formValidations[entity] = validations;
              
              // [{field: 'code', rules: [{constraintType:'NotNull', message: 'This value should not be null.'}]}]
              resolve(this.formValidations[entity]);
          }, reject);
      });
    }
    return this.formValidations[entity];
  }

  getFieldValidation(entity: string, field: string): any {
    return this.formValidations[entity][field];
  }

  getFieldValidationDescription(entity: string, field: string): string {
    let mergedMessages = '';
    this.formValidations[entity][field].forEach((element: any) => {
      mergedMessages += `${element.message} `;
    });
    return mergedMessages;
  }

  isFieldRequired(entity: string, field: string): boolean {
    if (this.formValidations[entity][field].map((validation: any) => validation.constraintType === 'NotNull').length > 0){
      return true;
    }
    return false;
  }

}

class FormValidation {
  constructor(public constraintType: string, public message: string) { }
}
