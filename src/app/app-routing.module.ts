import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AclGuard } from './auth/acl.guard';
import { AuthGuard } from './auth/auth.guard';
import { CheckInComponent } from './components/check-in/check-in.component';
import { FlightsComponent } from './components/flights/flights.component';
import { HomeComponent } from './components/home/home.component';
import { ManageBookingComponent } from './components/manage-booking/manage-booking.component';
import { OffcanvasContentComponent } from './components/offcanvas-content/offcanvas-content.component';
import { OneWayComponent } from './components/one-way/one-way.component';
import { PaymentComponent } from './components/payment/payment.component';
import {SeatSelectionComponent} from './components/seat-selection/seat-selection.component';
import { RoundTripComponent } from './components/round-trip/round-trip.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ChangeFlightComponent } from './components/manage-booking/change-flight/change-flight.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'one-way', component: OneWayComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'round-trip', component: RoundTripComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'manage-booking', component: ManageBookingComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'check-in', component: CheckInComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'flights', component: FlightsComponent, canActivate: [AuthGuard,AclGuard]},
  { path: 'spinner', component: SpinnerComponent, canActivate: [AuthGuard,AclGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'one-way', component: OneWayComponent},
  { path: 'round-trip', component: RoundTripComponent},
  { path: 'manage-booking/:pnr', component: ManageBookingComponent},
  { path: 'check-in', component: CheckInComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'manage-booking/select-seat/:flightId/:pnr', component: SeatSelectionComponent},
  { path: 'manage-booking/:pnr/change-flight', component: ChangeFlightComponent},
  { path: 'manage-booking/:pnr/change-flight/:flightId', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
