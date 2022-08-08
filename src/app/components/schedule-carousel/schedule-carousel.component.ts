import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-carousel',
  templateUrl: './schedule-carousel.component.html',
  styleUrls: ['./schedule-carousel.component.css']
})
export class ScheduleCarouselComponent implements OnInit {
  dateLowestPriceRange: any[] = [];
  selectedDate:string = '';

  @Output() onSelectedFlightDateChanged = new EventEmitter<string>();
  @Input() segmentIndex?: number;
  @Input() set selectedFlightDate(selectedDate: string){
    this.selectedDate = selectedDate
    // this.selectedDate = moment(selectedDate).format('ddd, MMM DD')
  }
  @Input() set indexedFlightsByDate(dateFlight: any){
    // console.log('here', dateFlight);
    this.dateLowestPriceRange = dateFlight;
    // this.dateLowestPriceRange = [];
    // Object.keys(dateFlight).forEach((flightDate: string)=>{
    //   const flight: any = {
    //     displayDate: flightDate, 
    //     flight: dateFlight[flightDate]
    //   };
    //   // flight.displayDate = moment(flight.depart_date).format('ddd, MMM DD');
    //   this.dateLowestPriceRange.push(flight);
    // })

    // console.log(this.dateLowestPriceRange);
  };

  constructor() { }

  ngOnInit(): void {
    // console.log('inputted value indexedFlightsByDate', this.indexedFlightsByDate);
  }

  getLowestPrices(): any[] {
    // console.log('items date',this.dateLowestPriceRange);
    return this.dateLowestPriceRange;
  }

  selectDate(date: string){
    this.selectedFlightDate = date;
    this.onSelectedFlightDateChanged.next(date);
    // console.log(date, this.selectedDate, this.selectedFlightDate);
  }

  formatDisplayDate(date: string): string {
    return moment(date, 'DD-MM-YYYY').format('ddd, MMM DD');
  }

  nextDays(){
    // search for flight with next 3 days
    // this.onSelectedFlightDateChanged.next(date);
    // console.log('search next 3 days of search date');
  }

  previousDays(){
    // search for flight with previous 3 days
    // this.onSelectedFlightDateChanged.next(date);
    // console.log('search previous 3 days of search date');
  }

}
