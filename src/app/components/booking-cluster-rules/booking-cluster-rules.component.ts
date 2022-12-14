import { Component, Input, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { BatService } from 'src/app/services/bat.service';
import { OffcanvasFlightSummaryComponent } from '../offcanvas-flight-summary/offcanvas-flight-summary.component';


@Component({
  selector: 'app-booking-cluster-rules',
  templateUrl: './booking-cluster-rules.component.html',
  styleUrls: ['./booking-cluster-rules.component.css']
})
export class BookingClusterRulesComponent implements OnInit {

  indexedBookingClusters: any = {};
  bookingClusterDetail: any = {};
  @Input() segmentIndex?: number;
  @Input() flight!: any;
  @Input() bookingCluster!: any;
  @Input() indexOfBookingCluster!: any;
  @Input() querySelector!: any;
  @Input() selectedCabinIndex!: number;
  @Input() isConnectingFlight: boolean = false;
  selectFlightParameters: any;
  constructor(private _bottomSheet: MatBottomSheet, private batService: BatService) { }

  ngOnInit(): void {
    this.batService.onIndexedBookingClustersChanged.subscribe((indexedBookingClusters: any) => {
      this.indexedBookingClusters = indexedBookingClusters;
      this.bookingClusterDetail = indexedBookingClusters[this.indexOfBookingCluster];
    });
    console.log('segment cluster things', this.segmentIndex,this.flight, this.indexedBookingClusters, this.bookingCluster, this.indexOfBookingCluster, this.querySelector);
    this.selectFlightParameters = {
      segmentIndex: this.segmentIndex||0,
      flight: this.flight,
      cabinIndex: this.selectedCabinIndex,
      bookingClusterIndex: this.indexOfBookingCluster
    };
  }

  openBottomSheet(): void {
    this._bottomSheet.open(OffcanvasFlightSummaryComponent, {
      panelClass: 'custom-bottomsheet-width'
    });
  }
  chooseFlight(){
    this.batService.onSelectFlightClicked.next(this.selectFlightParameters);
    // this.chooseFlight(data.segmentIndex,data.flight,data.flight.cabin_prices[data.cabinIndex],data.flight.cabin_prices[data.cabinIndex].price_list[data.bookingClusterIndex])
  }
}
