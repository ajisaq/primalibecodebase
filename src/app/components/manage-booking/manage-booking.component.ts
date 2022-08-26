import { ChangeFlightFormComponent } from './change-flight-form/change-flight-form.component';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BatService } from 'src/app/services/bat.service';
import {Location} from '@angular/common';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { Dropdown } from 'src/app/models/dropdown.model';
import { BookingClustersService } from 'src/app/services/booking-clusters.service';
import { CabinClassesDropdownService } from 'src/app/services/cabin-classes.service';
import { AirportsDropdownService } from 'src/app/services/dropdowns.service';


import {Booking} from '../../models/booking.model';
// import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css'],
})
export class ManageBookingComponent implements OnInit {
  bookingForm: FormGroup = new FormGroup({});
  travelInfo: any[] = [];
  isLoading = false;
  ticketBooking: any;
  flightSummaryDetails: any[] = [];
  pricingDetails: any = {
    ticketCost: 0,
    totalTaxAmount: 0,
    totalSurcharge: 0,
    serviceCharge: 500,
    totalticketCost: 0,
    extraBaggage: 10000,
  };
  passengerInfo: any = {
    firstName: '',
    lastName: '',
    pnr: '',
  };
  cabinClassesDropdown: Dropdown[] = [];
  indexedCabinClasses: any = {};
  bookingClusters: Dropdown[] = [];
  indexedBookingClusters: any = {};
  airports: Dropdown[] = [];
  indexedAirports: any = {};
  flightDuration: any = '';
  public searchedPNR: any;
  history: any;
  flightId: any;

  constructor(
    private route: ActivatedRoute,
    private batService: BatService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.batService.onIndexedAirportsChanged.subscribe(
      (indexedAirports: any) => (this.indexedAirports = indexedAirports)
    );
    this.batService.onIndexedCabinClassesChanged.subscribe(
      (indexedCabinClasses: any) =>
        (this.indexedCabinClasses = indexedCabinClasses)
    );
    this.batService.onIndexedBookingClustersChanged.subscribe(
      (indexedBookingClusters: any) =>
        (this.indexedBookingClusters = indexedBookingClusters)
    );

    this.batService.onBookingFormChanged.subscribe((bookingForm) => {
      this.bookingForm = bookingForm;
      let booking = bookingForm.getRawValue();
      this.getFlightSummary(booking);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.searchedPNR = params.params.pnr;
      if (this.searchedPNR) {
        this.batService.onResetOpenPNR.next(this.searchedPNR);
      } else {
        this.batService
          .getPNRFromSearch2(this.searchedPNR)
          .then((booking: Booking) => {
            // this.bookingForm = booking;
            // console.log(booking);
            this.getFlightSummary(booking);
            // console.log(this.flightSummaryDetails);
          });
      }
    });

    // console.log(this.getFlightSummary());
  }
  selectSeat() {
    this.router.navigate([
      '/manage-booking/select-seat/',
      this.flightId,
      this.passengerInfo.pnr,
    ]);
  }
  get bookingLegs() {
    return this.bookingForm.get('bookingLegs') as FormGroup;
  }

  get passengers() {
    return this.bookingForm.value.passengers;
  }

  sendTicketToEmail() {
    this.isLoading = true;
    this.batService
      .sendEmailTicket(this.passengerInfo.pnr, 'talk2ahmedpeter@gmail.com')
      .then((response: any) => {
        this.isLoading = false;
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
        //notify errs
      });
  }

  printTicket() {
    window.print();
  }

  getBookingClusterFromBookingClass(bookingClass: string): any {
    let foundIndex = '';
    Object.keys(this.indexedBookingClusters).forEach((clusterIndex) => {
      if (foundIndex != '') this.indexedBookingClusters[foundIndex];
      this.indexedBookingClusters[clusterIndex].bookingClasses.forEach(
        (rbd: string) => {
          if (rbd?.toLowerCase() == bookingClass?.toLowerCase()) {
            foundIndex = clusterIndex;
            if (foundIndex != '')
              return this.indexedBookingClusters[foundIndex];
          }
        }
      );
    });
    return this.indexedBookingClusters[foundIndex];
  }

  getFlightSummary(booking: any) {
    this.flightSummaryDetails = [];
    this.pricingDetails = {
      ticketCost: 0,
      totalTaxAmount: 0,
      totalSurcharge: 0,
      serviceCharge: 500,
      totalticketCost: 0,
      extraBaggage: 10000,
    };
    this.passengerInfo = {
      passengers: booking.passengers,
      pnr: booking.recordLocator,
    };

    booking.bookingLegs.map((bookingLeg: any) => {
      // console.log(bookingLeg);
      let duration = moment(
        bookingLeg.flight?.arrive_date,
        'YYYY-MM-DDTHH:mm:ss'
      ).diff(moment(bookingLeg.flight?.depart_date, 'YYYY-MM-DDTHH:mm:ss'));
      this.flightId = bookingLeg.flight.id;
      let flightSummaryDetail = {
        flightNumber: bookingLeg.flight?.flight_number,
        dapartAirportCode: bookingLeg.flight?.depart_airport?.code,
        arriveAirportCode: bookingLeg.flight?.arrive_airport?.code,
        dapartDate: moment(bookingLeg.flight?.depart_date).format('DD/MM/yyyy'),
        arriveDate: moment(bookingLeg.flight?.arrive_date).format('DD/MM/yyyy'),
        etd: bookingLeg.flight?.etd,
        eta: bookingLeg.flight?.eta,
        flightDuration: this.convertDuration(duration), //(moment(bookingLeg.flight?.arriveDate, 'YYYY-MM-DD\THH:mm:ss').diff(moment(bookingLeg.flight?.departDate, 'YYYY-MM-DD\THH:mm:ss'))), //moment.duration(myVar).asSeconds() in milliseconds
        cabinClass: bookingLeg?.cabinClass,
        bookingClass: bookingLeg?.bookingLegFare.bookingClass
          ? bookingLeg?.bookingLegFare.bookingClass
          : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass,
        pricingDetail: {
          totalticketCost: bookingLeg.bookingLegFare?.cost,
          singleAdultCost: bookingLeg.bookingLegFare?.adultCost,
          ticketCost: bookingLeg.bookingLegFare?.price,
          totalTaxAmount: bookingLeg.bookingLegFare?.tax,
          totalSurcharge: bookingLeg.bookingLegFare?.surcharge,
          serviceCharge: bookingLeg.bookingLegFare?.serviceCharge,
          extraBaggage: 10000,
        },
        passengerInfo: {
          passengers: booking.passengers,
          pnr: booking.recordLocator,
        },
        clusterRules: this.getBookingClusterFromBookingClass(
          bookingLeg?.bookingLegFare.bookingClass
            ? bookingLeg?.bookingLegFare.bookingClass
            : bookingLeg?.bookingLegStops[0]?.bookingLegStopFare?.bookingClass
        )?.bookingClusterRules,
      };
      this.flightSummaryDetails.push(flightSummaryDetail);

      // console.log(flightSummaryDetail);
      // this.changeFlight(flightSummaryDetail.pricingDetail)
    });
  }

  convertDuration(duration: number) {
    let toHourBase = 3600000;
    let hour = Math.floor(duration / toHourBase) + 'hr';
    let minute = ((duration % toHourBase) / toHourBase) * 60 + 'm';
    return `${hour} ${minute}`;
  }

  changeFlight(data: any) {
    this.router.navigate(
      [`manage-booking/${this.passengerInfo.pnr}/change-flight`],
      { queryParams: data, queryParamsHandling: 'merge' }
    );
  }

  onChangeFlight(bookingLeg: any) {
    let dialogRef = this.dialog.open(ChangeFlightFormComponent, {
      panelClass: 'flight-change-dialog',
      data: {
        bookingForm: this.bookingForm,
        bookingLeg: bookingLeg,
      },
      minWidth: '65%',
      maxWidth: '95%',
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        return;
      }
    });
  }
}
