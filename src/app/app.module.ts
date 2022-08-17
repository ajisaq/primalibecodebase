import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { AirportsDropdownService } from './services/airport.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';
import { OneWayComponent } from './components/one-way/one-way.component';
import { RoundTripComponent } from './components/round-trip/round-trip.component';
import { BookingClusterRulesComponent } from './components/booking-cluster-rules/booking-cluster-rules.component';
import { BookingClusterComponent } from './components/booking-cluster/booking-cluster.component';
import { ScheduleCarouselComponent } from './components/schedule-carousel/schedule-carousel.component';
import { PreviousBtnDirective } from './directives/previous-btn.directive';
import { NextBtnDirective } from './directives/next-btn.directive';
import { ManageBookingComponent } from './components/manage-booking/manage-booking.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PassengerInformationComponent } from './components/passenger-information/passenger-information.component';
import { FlightRulesComponent } from './components/flight-rules/flight-rules.component';
import { FlightConfirmationComponent } from './components/flight-summary/flight-confirmation.component';
import { SummaryCardComponent } from './components/flight-summary/summary-card/summary-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { OneWaySearchFormComponent } from './components/flight-search/one-way-search-form/one-way-search-form.component';
import { RoundTripSearchFormComponent } from './components/flight-search/round-trip-search-form/round-trip-search-form.component';
import { PassengerTypeDropdownComponent } from './components/flight-search/passenger-type-dropdown/passenger-type-dropdown.component';
import { FlightSearchService } from './services/flightSearch.service';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';
import { BusinessClassComponent } from './components/seat-selection/business-class/business-class.component';
import { EconomyClassComponent } from './components/seat-selection/economy-class/economy-class.component';
import { AgentTypesDropdownService, AirportsDropdownService, PassengerTypesDropdownService } from './services/dropdowns.service';
import { ProductsDropdownService, ProductsService } from './services/products.service';
import { ProductCategoriesDropdownService } from './services/product-categories.service';
import { AuthenticationService } from './services/authentication.service';
import { GtoolsService } from './services/gtools.service';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from './auth/token-interceptor';
import { LoaderInterceptor } from './services/loader-interceptor';
import { SnackbarInterceptor } from './services/snackbar-interceptor';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AclService } from './services/acl.service';
import { LoginModule } from './components/login/login.module';
import { CabinClassesDropdownService } from './services/cabin-classes.service';
import { BookingClustersService } from './services/booking-clusters.service';
import { OffcanvasFlightSummaryComponent } from './components/offcanvas-flight-summary/offcanvas-flight-summary.component';
import { CheckinFormComponent } from './components/checkin-form/checkin-form.component';
import { SearchBookingComponent } from './components/search-booking/search-booking.component';
import { OffcanvasContentComponent } from './components/offcanvas-content/offcanvas-content.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
import {MatButtonModule} from '@angular/material/button';
import {HtmlSeatsComponent} from './components/seat-selection/html-seats/html-seats.component';
import { ChangeFlightComponent } from './components/manage-booking/change-flight/change-flight.component';
import { ChangeFlightFormComponent } from './components/manage-booking/change-flight-form/change-flight-form.component';

import { DragToSelectModule } from 'ngx-drag-to-select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ManageBookingService } from './services/manage-booking.service';
import { NewFlightChangeComponent } from './components/manage-booking/new-flight-change/new-flight-change.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FlightSearchComponent,
    OneWayComponent,
    RoundTripComponent,
    BookingClusterRulesComponent,
    BookingClusterComponent,
    ScheduleCarouselComponent,
    PreviousBtnDirective,
    NextBtnDirective,
    ManageBookingComponent,
    CheckInComponent,
    PaymentComponent,
    PassengerInformationComponent,
    FlightRulesComponent,
    // FlightSummaryComponent,
    HtmlSeatsComponent,
    FlightConfirmationComponent,
    SummaryCardComponent,
    OneWaySearchFormComponent,
    RoundTripSearchFormComponent,
    PassengerTypeDropdownComponent,
    SeatSelectionComponent,
    BusinessClassComponent,
    EconomyClassComponent,
    OffcanvasFlightSummaryComponent,
    CheckinFormComponent,
    SearchBookingComponent,
    OffcanvasContentComponent,
    SpinnerComponent,
    ChangeFlightComponent,
    ChangeFlightFormComponent,
    NewFlightChangeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatToolbarModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    FontAwesomeModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatBottomSheetModule,    
    LoginModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    DragDropModule,
    DragToSelectModule.forRoot(),
    
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AclService,
    AuthenticationService,
    FlightSearchService,
    AirportsDropdownService,
    AgentTypesDropdownService,
    CabinClassesDropdownService,
    BookingClustersService,
    PassengerTypesDropdownService,
    ProductsService,
    ProductCategoriesDropdownService,
    ManageBookingService,

    GtoolsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
      // AuthenticationService,      
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoaderInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SnackbarInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
