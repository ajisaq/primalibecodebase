import { Component, OnInit, Input } from '@angular/core';
import { BatService } from 'src/app/services/bat.service';

@Component({
  selector: 'app-booking-cluster',
  templateUrl: './booking-cluster.component.html',
  styleUrls: ['./booking-cluster.component.css']
})
export class BookingClusterComponent implements OnInit {

  @Input() isConnectingFlight: boolean = false;
  @Input() set flight(flt: any){
    // if(!this.isConnectingFlight){
      this.singleFlight = flt;
    // }else{
    //   this.prepareConnectingFlight(flt);
    //   console.log('connectingflt', flt);
    // }
    console.log(flt, this.isConnectingFlight);
  }
  @Input() segmentIndex?: number;
  @Input() indexOfFlight!: any;
  @Input() indexedAirports!: any;
  panelOpenState = false;
  singleFlight!: any;
  cabinName!: any;
  connectingCount: number = 0;


  constructor() { }

  ngOnInit(): void {
    // this.flight.map((flight: any) => {
    //   this.singleFlight = flight;
    //   this.singleFlight.cabin_prices.map((cabin: any) => {
    //     this.cabinName = cabin.name;
    //   })
    // })
    // console.log([this.singleFlight.id]);
    if(!this.isConnectingFlight){
      this.singleFlight = this.singleFlight;
    }else{
      this.prepareConnectingFlight(this.singleFlight);
      console.log('connectingflt', this.singleFlight);
    }
  }
  getPriceListArray(priceList: any): any[]{
    let priceListResult: any[] = [];
    Object.keys(priceList || {}).forEach((obj: string) => {priceListResult.push(priceList[obj])});
    return priceListResult;
  }
  getPriceListClusterCode(priceList: any, index: number): string{
    let priceListResult: string = '';
    let i = 0;
    Object.keys(priceList).forEach((key: string)=> {if(i==index){priceListResult = key}; i++});
    return priceListResult;
  }
  // getPriceListClusterCode(priceList: any, index: number): any[]{
  //   let priceListResult: any[] = [];
  //   Object.keys(priceList).forEach(obj=> priceListResult.push(obj));
  //   return priceListResult[index];
  // }
  prepareConnectingFlight(connectingFlt: any){
    let firstSegmentIndex = Object.keys(connectingFlt).sort()[0];
    let lastSegmentIndex = Object.keys(connectingFlt).sort()[Object.keys(connectingFlt).length-1];
    this.connectingCount = Object.keys(connectingFlt).length-1;
    this.singleFlight = this.mergeFlights(connectingFlt[firstSegmentIndex], connectingFlt[lastSegmentIndex]);
    console.log('gflt', this.singleFlight)
  }
  mergeFlights(x:any,y:any){
    console.log('mflt',x);
    let newMerged = JSON.parse(JSON.stringify(x));
    newMerged.flight_number = newMerged.flight_number + ' - ' + y.flight_number;
    newMerged.arrive_airport = y.arrive_airport;
    newMerged.arrive_day = y.arrive_day;
    newMerged.arrive_date = y.arrive_date;
    newMerged.eta = y.eta;
    newMerged.adult_cost += y.adult_cost;
    newMerged.available_seats = (newMerged.available_seats < y.available_seats) ? newMerged.available_seats : y.available_seats;
    newMerged.cabin_prices =  [];
    let cps: any = {}; //object to store similar cabinprices across connecting point/flights
    let sIndex = 0;

    console.log('connecting object', this.singleFlight);
    Object.keys(this.singleFlight).forEach((segment:any) => {
      this.singleFlight[segment].cabin_prices.forEach((cabinPrice: any) => {
        if(sIndex === 0){
          cps[cabinPrice.code]=[];
        }
        if(cps.hasOwnProperty(cabinPrice.code)){
          cps[cabinPrice.code].push(cabinPrice);
        }
      });
      sIndex++;
    });
    console.log('cps', cps);
    Object.keys(cps).forEach(key => {
      if(cps[key].length === Object.keys(this.singleFlight).length){
        //merge cps[key]
        let mcps = cps[key]?.reduce(function (merged: any, cabin: any) {
          merged.adult_cost = (merged.adult_cost || 0) + cabin.adult_cost;
          merged.cost = (merged.cost || 0) + cabin.cost;
          merged.price = (merged.price || 0) + cabin.price;
          merged.seats_left = (merged.seats_left < cabin.seats_left) ? merged.seats_left : cabin.seats_left;
          return (merged || cabin);
        }, {});
        console.log('reduced mcps', mcps);
        // reduce and return single object
        newMerged.cabin_prices.push(mcps)
      }
    })
    return newMerged;
  }
}
