import { Component, OnInit } from '@angular/core';
import { BatService } from 'src/app/services/bat.service';
import { Booking } from 'src/app/models/booking.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-booking',
  templateUrl: './search-booking.component.html',
  styleUrls: ['./search-booking.component.css']
})
export class SearchBookingComponent implements OnInit {

  isLoading: boolean = false;
  pnrToSearch: string = '';
  lastName: string = ''
  constructor(
    private batService : BatService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  
  searchPNR(e: any) {
    this.isLoading = true;
    e.preventDefault();
    console.log(this.pnrToSearch.toUpperCase());
    this.batService.getPNRFromSearch2(this.pnrToSearch)
    .then((resp)=>{
      this.isLoading = false;
      console.log(resp);
      if(resp.status === 'NEW'){
        console.log('No such PNR');
        this.isLoading = false;
        return
      }
      this.batService.onResetOpenPNR.next(this.pnrToSearch);
      this.router.navigate(['/manage-booking', this.pnrToSearch]);
      
    })
    .catch(err=>{
      console.log(err)
      this.isLoading = false;
        //notify errs
    })
  }
}
