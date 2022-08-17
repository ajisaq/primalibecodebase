import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { environment } from 'src/environments/environment';
import { Agent } from './models/agent.model';
import { Booking, BookingLeg, BookingLegFare, Coupon, BookedProduct, BookingLegProduct, BookingLegStopFare, Contact, BookingRemark, BookingHistory, Passenger, Payment } from './models/booking.model';
import { CabinClass } from './models/cabin-class.model';
import { Currency } from './models/currency.model';
import { Fare, FareDbrLeg, PassengerType } from './models/fare.model';
import { Flight } from './models/flight.model';
import { Product } from './models/products.model';
import { ScheduleLeg } from './models/schedule.model';
import { AclService } from './services/acl.service';
import { AuthenticationService } from './services/authentication.service';
import { BatService } from './services/bat.service';
import { BookingClustersService } from './services/booking-clusters.service';
import { CabinClassesDropdownService } from './services/cabin-classes.service';
import { AirportsDropdownService, PassengerTypesDropdownService } from './services/dropdowns.service';
import { GtoolsService } from './services/gtools.service';
import { ProductCategoriesDropdownService } from './services/product-categories.service';
import { ProductsService } from './services/products.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'primalaeroibe';
  bookingForm: FormGroup;
  validPNRLength:number = 6;

    airportsDropdown: any[] = [];
    cabinClassesDropdown: any[] = [];
    bookingClusters: any[] = [];
    passengerTypesDropdown: any[] = [];
    indexedCabinClasses: any = {};

    /**
     * Constructor
     *
     * @param {SplashScreenService} _splashScreenService
     */
     constructor(private _splashScreenService: SplashScreenService,
        private fb: FormBuilder,
        private batService: BatService, 
        private authenticationService: AuthenticationService, 
        private gTools: GtoolsService, 
        private productsService: ProductsService,
        private productCatergoriesDropdownService: ProductCategoriesDropdownService,
        private _router: Router,

        private airportsDropdownService: AirportsDropdownService,
        private cabinClassesDropdownService: CabinClassesDropdownService,
        private bookingClustersService: BookingClustersService,
        private passengerTypesDropdownService: PassengerTypesDropdownService,
        // private _currenciesDropdownService: CurrenciesDropdownService,
        private _aclService: AclService,
        ){
            this.bookingForm = this.createBookingForm(new Booking({}));
        }

        ngOnInit() {
            this.airportsDropdownService.getAirportsDropdown().then((airportsDropdown: any[]) => {
                this.airportsDropdown = airportsDropdown;
                let indexedAirports: any = {};
                this.airportsDropdown.forEach((airport: any)=>{
                    indexedAirports[airport.value]=airport.extra;
                });
                // console.log(indexedAirports);
                this.batService.onIndexedAirportsChanged.next(indexedAirports);
            });
            this.cabinClassesDropdownService.getCabinClassesDropdown().then((cabinClassesDropdown: any[]) => {
                this.cabinClassesDropdown = cabinClassesDropdown;
                
                this.cabinClassesDropdown.forEach((cabinClassDropdown: any)=>{
                    this.indexedCabinClasses[cabinClassDropdown.extra.code]=cabinClassDropdown.extra;
                });
                // console.log('indexed cabin classes', this.indexedCabinClasses);
                this.batService.onIndexedCabinClassesChanged.next(this.indexedCabinClasses);
            });
            this.bookingClustersService.getBookingClusters().then((bookingClusters: any[]) => {
                this.bookingClusters = bookingClusters;
                let indexedBookingClusters: any = {};
                this.bookingClusters.forEach((bookingCluster: any)=>{
                    indexedBookingClusters[bookingCluster.code]=bookingCluster;
                });
                // console.log(indexedBookingClusters);
                this.batService.onIndexedBookingClustersChanged.next(indexedBookingClusters);
            });
            this.passengerTypesDropdownService.getPassengerTypesDropdown().then((passengerTypesDropdown: any[]) => {
                this.passengerTypesDropdown = passengerTypesDropdown;
                let indexedPassengerTypesDropdown: any = {};
                this.passengerTypesDropdown.forEach((passengerTypeDropdown: any)=>{
                    indexedPassengerTypesDropdown[passengerTypeDropdown.value]=passengerTypeDropdown.extra;
                    // this.indexedPassengerTypesDropdownByCode[passengerTypeDropdown.extra.code]=passengerTypeDropdown;
                });
                // console.log(indexedPassengerTypesDropdown);
                this.batService.onIndexedPassengerTypesChanged.next(indexedPassengerTypesDropdown);
            });
            
          // Hide Nav
          // this._fuseConfig.getConfig().subscribe((config: FuseConfig)=>{
          //     // config.layout.navbar.hidden = true;
          //     config.layout.navbar.folded = true;
          //     this._fuseConfig.setConfig(config);
          // })
  
        //   //load unrequireds
        //   this.productsService.getProducts();
        //   this.productCatergoriesDropdownService.getProductCategoriesDropdown();
  
          let newBooking = new Booking({});
          this.openPNR(newBooking);
  
  
  
          // this.batService.onOpenBookingChanged.subscribe((booking: Booking)=>{
          //     this.openPNR(booking);
          // })
          this.batService.onResetOpenPNR.subscribe(pnr=>{
              this.onIgnorePNR(null);
              if(pnr){
                  this.onSearchPNR(pnr);
              }
          })
          this.batService.onBookingFormChanged.next(this.bookingForm);
          // console.log('bookingForm',this.bookingForm);
          this.batService.onBookingFormChanged.pipe().subscribe((bookingForm:any) => this.bookingForm=bookingForm);
          this.batService.onCreatePNRButtonClicked.pipe().subscribe((clicked:boolean) => this.onSavePNR());
  
      }
  
      openPNR(booking:Booking){
          // console.log({booking});
          this.bookingForm = this.createBookingForm(booking);
          this.batService.onBookingFormChanged.next(this.bookingForm);
      }
  
      createBookingForm(booking?: Booking){
          booking = booking ? booking : new Booking({});
          return this.fb.group({
              id          :[booking.id],
              date        : [booking.date? moment(booking.date, "DD/MM/YYYY HH:mm"): moment()],
              effectiveDate: [booking.effectiveDate? moment(booking.effectiveDate, "DD/MM/YYYY HH:mm"):moment()],
              status      : [booking.status],
              isGroup     : [booking.isGroup],
              // origin      : [booking.origin],
              // destination : [booking.destination],
              bookingLegs : this.getBookingLegsFormArray(booking.bookingLegs),
              email       : [booking.email],
              phone       : [booking.phone],
              payments    : this.getPaymentsFormArray(booking.payments),
              passengers  : this.getPassengersFormArray(booking.passengers),
              contacts    : this.getContactsFormArray(booking.contacts),
              recordLocator: [booking.recordLocator],
              groupName   : [booking.groupName],
              bookingAgent: [new Agent(booking.bookingAgent).iri],
              isCancelled : [booking.isCancelled],
              amountPaid  : [booking.amountPaid],
              amountDue   : [booking.amountDue],
              amountPending: [booking.amountPending],
              waitListX    : [booking.waitList],
              remarks     : this.getRemarksFormArray(booking.bookingRemarks),
              bookingHistoriesX : this.getHistoriesFormArray(booking.bookingHistories),
          })
      }
  
      getBookingLegsFormArray(bookingLegs: any){
          // let bookingLegs = booking_legs; //booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
          let resultArray = this.fb.array([]) as FormArray;
          bookingLegs.forEach((bookingLeg: BookingLeg) => {
            let el = this.fb.group<any>({
                id: [bookingLeg.id],
                // booking:  [bookingLeg.booking],
                flight  : [new Flight(bookingLeg.flight)], //[new Flight(bookingLeg.flight).iri],
                fare    : [new Fare(bookingLeg.fare)],
                fareDbrLeg  : [new FareDbrLeg(bookingLeg.fareDbrLeg).iri],
                //TODO
                bookingLegStops : [bookingLeg.bookingLegStops.map(bStop=>new ScheduleLeg(bStop).iri)],
                bookingLegFare: this.getBookingLegFareForm(bookingLeg.bookingLegFare),
                // bookingLegProducts: this.getBookingLegProductsFormArray(bookingLeg.bookingLegProducts),
                coupons: this.getCouponsFormArray(bookingLeg.coupons),
                charges : [[]],//bookingLeg.charges],
                expireAt    : [bookingLeg.expireAt],
                isCheckedIn : [bookingLeg.isCheckedIn],
                isBoarded   : [bookingLeg.isBoarded],
                isNoShow    : [bookingLeg.isNoShow],
                isDeleted   : [bookingLeg.isDeleted],
                checkInX : [bookingLeg.checkIn],
                isCancelled : [bookingLeg.isCancelled],
                isOpen  : [bookingLeg.isOpen],
                isWaitlisted    : [bookingLeg.isWaitlisted],
                isTicketed  : [bookingLeg.isTicketed],
                cabinClass  : [new CabinClass(bookingLeg.cabinClass).iri],
                ssrs    : [bookingLeg.ssrs],
            })
            resultArray.push(el)
          });
          return resultArray;
      }
  
      getBookingLegFareForm(bookingLegFare: BookingLegFare){
          // let bookingLegs = booking_legs; //booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
          return this.fb.group({
              id:         [bookingLegFare.id],
              // bookingLeg:  [bookingLegFare.bookingLeg],
              bookingClass: [bookingLegFare.bookingClass],
              fareDbrLeg  : [new FareDbrLeg(bookingLegFare.fareDbrLeg).iri],
              adultCost   : [{value: bookingLegFare.adultCost, disabled: true}],
              price       : [{value: bookingLegFare.price, disabled: true}],
              tax         : [{value: bookingLegFare.tax, disabled: true}],
              discount    : [{value: bookingLegFare.discount, disabled: true}],
              surcharge   : [{value: bookingLegFare.surcharge, disabled: true}],
              cost        : [{value: bookingLegFare.cost, disabled: true}],
              manualFare  : [{value: bookingLegFare.manualFare, disabled: true}],
              rbd         : [{value: bookingLegFare.rbd, disabled: true}],
              costBreakdown:[{value: bookingLegFare.costBreakdown, disabled: true}],
              fareRules   : [{value: bookingLegFare.fareRules, disabled: true}],
          })
      }
  
      getCouponsFormArray(coupons: Coupon[]|any[]){
          let resultArray = this.fb.array([]) as FormArray;
          coupons.forEach((coupon: Coupon|any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [coupon.id],
                      // bookingLeg: [coupon.bookingLeg],
                      ticketNumber: [coupon.ticketNumber],
                      amount      : [coupon.amount],
                      currency    : [coupon.currency],//iri
                      passenger   : [coupon.passenger],//iri
                      checkIn     : [coupon.checkIn],
                      reservedSeats   : [coupon.reservedSeats],
                      reservedSeatName: [coupon.resevedSeatName],
                      ssrs            : [coupon.ssrs],
                      status          : [coupon.status],
                      isHeldConfirmed : [coupon.isHeldConfirmed],
                      isTicketed      : [coupon.isTicketed],
                      isSeatSelected  : [coupon.isSeatSelected],
                      isWaitlisted    : [coupon.isWaitlisted],
                      isTimechanged   : [coupon.isTimechanged],
                      bookedProducts  : this.getBookedProductsFormArray(coupon.bookedProducts),
                      expireAt        : [coupon.expireAt],
                  })  
              )
          });
          return resultArray;    
      }
  
      getBookedProductsFormArray(bookedProducts: BookedProduct[]|any[]){
          let resultArray = this.fb.array([]) as FormArray;
          bookedProducts.forEach((bookedProduct: BookedProduct|any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [bookedProduct.id],
                      product     : [bookedProduct.product], //iri
                      name        : [bookedProduct.name],
                      price       : [bookedProduct.price],
                      quantity    : [bookedProduct.quantity],
                      amount      : [bookedProduct.amount],
                      tax         : [bookedProduct.tax],
                  })  
              )
          });
          return resultArray;    
      }
  
      getBookingLegProductsFormArray(blProducts: BookingLegProduct[]|any[]){
          // let bookingLegs = booking_legs; //booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
          let resultArray = this.fb.array([]) as FormArray;
          blProducts.forEach((blProduct: BookingLegProduct|any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [blProduct.id],
                      passenger:  [new Passenger(blProduct.passenger).iri],
                      product     : [new Product(blProduct.product).iri],
                      name        : [blProduct.name],
                      amount      : [blProduct.amount],
                      tax         : [blProduct.tax],
                  })  
              )
          });
          return resultArray;    
      }
  
      getBookingLegStopFaresFormArray(bookingLegStopFares: BookingLegStopFare[]|any[]){
          // let bookingLegs = booking_legs; //booking_legs.map(booking_leg=>new BookingLeg(booking_leg))
          let resultArray = this.fb.array([]) as FormArray;
          bookingLegStopFares.forEach((bookingLegStopFare: BookingLegStopFare|any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [bookingLegStopFare.id],
                      // bookingLegStop:  [bookingLegStop.bookingLeg],
                      bookingClass  : [bookingLegStopFare.bookingClass],
                      fareDbrLeg  : [new FareDbrLeg(bookingLegStopFare.fareDbrLeg).iri],
                      adultCost   : [bookingLegStopFare.adultCost],
                      price       : [bookingLegStopFare.price],
                      tax         : [bookingLegStopFare.tax],
                      discount    : [bookingLegStopFare.discount],
                      cost        : [bookingLegStopFare.cost],
                      costBreakdown: [bookingLegStopFare.costBreakdown],
                  })  
              )
          });
          return resultArray;    
      }
  
      getPassengersFormArray(passengers: any){
          // let passengers = passengerz; //passengerz.map(pax=>new Passenger(pax))
          let resultArray = this.fb.array([]) as FormArray;
          passengers.forEach((passenger: Passenger) => {
              resultArray.push(
                  this.fb.group({
                      id:         [passenger.id],
                      // booking  : [passenger.booking],
                      firstName   :[passenger.firstName],
                      lastName    :[passenger.lastName],
                      gender      :[passenger.gender],
                      title       :[passenger.title],
                      passengerType:[new PassengerType(passenger.passengerType).iri],
                      dateOfBirth :[passenger.dateOfBirth],
                      phone       :[passenger.phone],
                      email       :[passenger.email],
                      address     :[passenger.address],
                      seat        :[passenger.seat],
                      ticketNumber:[passenger.ticketNumber],
                      ffp         :[passenger.ffp],
                      reservedSeats:[passenger.reservedSeats],
                      ssrs        :[passenger.ssrs],
                      hasExtraDetails: [passenger.hasExtraDetails()],
                      // bookingLegProducts: [] //formArray 
  
  
                  })
              )
          });
          return resultArray;
      }
  
      getContactsFormArray(contacts: any){
          // let contacts = contactz; //passengerz.map(pax=>new Passenger(pax))
          let resultArray = this.fb.array([]) as FormArray;
          contacts.forEach((contact: Contact) => {
              resultArray.push(
                  this.fb.group({
                      id:         [contact.id],
                      // booking  : [contact.booking],
                      firstName   :[contact.firstName],
                      lastName    :[contact.lastName],
                      title       :[contact.title],
                      phone       :[contact.phone],
                      email       :[contact.email],
                      address     :[contact.address],
                      fqtvNumber  :[contact.fqtvNumber],
                  })
              )
          });
          return resultArray;
      }
  
      getPaymentsFormArray(payments: any){
          // let payments = paymentz; //paymentz.map(pay=>new Payment(pay))
          let resultArray = this.fb.array([]) as FormArray;
          payments.forEach((payment: Payment) => {
              resultArray.push(
                  this.fb.group({
                      id:         [payment.id],
                      // booking  : [payment.booking],
                      amount      :[payment.amount],
                      date        :[payment.date],
                      modeOfPayment       :[payment.modeOfPayment],
                      reference       :[payment.reference],
                      currency        :[new Currency(payment.currency).iri],
                      remarks     :[payment.remarks],
                      isCredit        :[payment.isCredit],
                      isDeleted       :[payment.isDeleted],
                  })
              )
          });
          return resultArray;
      }
  
      getRemarksFormArray(remarks: any){
          // let payments = paymentz; //paymentz.map(pay=>new Payment(pay))
          let resultArray = this.fb.array([]) as FormArray;
          remarks.forEach((remark: BookingRemark | any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [remark.id],
                      // booking  : [remark.booking],
                      remark      :[remark.remark],
                      remark_by   :[remark.remarkBy.iri],
                      date        :[remark.date],
                      _remark_by  :[remark.remarkBy]
                  })
              )
          });
          return resultArray;
      }
  
      getHistoriesFormArray(histories: any){
          // let payments = paymentz; //paymentz.map(pay=>new Payment(pay))
          let resultArray = this.fb.array([]) as FormArray;
          histories.forEach((history: BookingHistory | any) => {
              resultArray.push(
                  this.fb.group({
                      id:         [history.id],
                      // booking  : [history.booking],
                      date      :[history.date],
                      agentBooking:[history.agentBooking],
                      user      :[history.user],
                      title     :[history.title],
                      message   :[history.message],
                      type      :[history.type],
                  })
              )
          });
          return resultArray;
      }
  
  
  
      onSavePNR(){
          let _bookingForm = _.cloneDeep(this.bookingForm);
  
          //remove flight object and use iri
          let bookingLegs = _bookingForm.get('bookingLegs') as FormArray;
          bookingLegs.controls.forEach((bookingLeg: any)=>{
              let flightIri = "/api/flights/"+bookingLeg.controls['flight'].value.id;
              bookingLeg.controls['flight'].patchValue(flightIri);
              
              let cabinClassIri = this.indexedCabinClasses[bookingLeg.controls['cabinClass'].value]['@id'];
              bookingLeg.controls['cabinClass'].patchValue(cabinClassIri);
              
  
              let fareId = bookingLeg.controls['fare'].value.id;
              if(fareId){
                  let fareIri = "/api/fares/"+fareId;
                  bookingLeg.controls['fare'].patchValue(fareIri);
              }else{
                  bookingLeg.controls['fare'].patchValue(null);
              }
              
          });
  
          //set pax type, currently sending name not iri
          let passengers = _bookingForm.get('passengers') as FormArray;
          passengers.controls.forEach((passenger: any)=>{
              let passengerTypeIri = "/api/passenger_types/1";
              passenger.controls['passengerType'].patchValue(passengerTypeIri);
          });
          
          const bookingValues = _bookingForm.getRawValue();
          let id = this.bookingForm.controls['id'].value;
          if(!id){
              // Create
              this.batService.addBooking(bookingValues)
                  .then(booking=>{
  
                      //new custom booking response
                      // let pnr = booking.PNR;
                      // this.op
  
                      //open Saved booking
                      
                      this.onSearchPNR(booking.PNR);
                  })
                  .catch(e=>{
                      //notify errs
                  });
          }else{
              // Update
              // get only updated fields
              let updatedBookingForm = this.gTools.getChangedFormFields(_bookingForm);
              let x = updatedBookingForm.getRawValue();
              let v = updatedBookingForm.value;
              let z = updatedBookingForm.controls.value;
            //   debugger
              this.batService.updateBooking(updatedBookingForm.getRawValue())
                  .then(booking=>{
                      //open Saved booking
                      this.openPNR(booking);
                  })
                  .catch(e=>{
                      //notify errs
                  });
              
          }
      }
      onSearchPNR(pnrToSearch: any) {
          this.batService.getPNRFromSearch2(pnrToSearch)
              .then((booking: Booking)=>{
                  //open Saved booking
                  this.openPNR(booking);
              })
              .catch(e=>{
                  //notify errs
              })
      }
      onDisplayPNR(pnrToSearch: any){
          // sent from template
          // console.log("onDisplayPNR",pnrToSearch);
          //refresh
          this.onSearchPNR(pnrToSearch);
      }
      onIgnorePNR(e?: any){
          let booking = new Booking();
          this.openPNR(booking);
          // redirect to flight search page
          // this._router.navigate(['/payment']);
          // console.log("onIgnorePNR",e)
      }
  
      onIgnoreRefreshPNR(pnrToSearch: any){
          // console.log("onIgnoreRefreshPNR",pnrToSearch)
          //ignore
          this.onIgnorePNR(null);
          //refresh
          this.onSearchPNR(pnrToSearch);
      }
  
  
  
}
