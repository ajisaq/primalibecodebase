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
  @Input() classSelector!: any;
  @Input() toggleSelectedID!: string;
  @Input() selectedCabinIndex!: number;
  @Input() isConnectingFlight: boolean = false;
  @Input() stepper!: any;
  selectFlightParameters: any;
  constructor(private _bottomSheet: MatBottomSheet, private batService: BatService) { }

  ngOnInit(): void {
    this.batService.onIndexedBookingClustersChanged.subscribe((indexedBookingClusters: any) => {
      this.indexedBookingClusters = indexedBookingClusters;
      this.bookingClusterDetail = indexedBookingClusters[this.indexOfBookingCluster];
    });
    this.selectFlightParameters = {
      segmentIndex: this.segmentIndex||0,
      flight: this.flight,
      cabinIndex: this.selectedCabinIndex,
      bookingClusterIndex: this.indexOfBookingCluster
    };
  }

  openBottomSheet(): void {
    this.batService.bookingPaymentFloor.next('selection');
    this._bottomSheet.open(OffcanvasFlightSummaryComponent, {
      panelClass: 'custom-bottomsheet-width',
      data: this.stepper
    });
  }
  chooseFlight(){
    this.batService.onSelectFlightClicked.next(this.selectFlightParameters);
  }
}
