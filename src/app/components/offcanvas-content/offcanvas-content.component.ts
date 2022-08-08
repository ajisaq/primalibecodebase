import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-offcanvas-content',
  templateUrl: './offcanvas-content.component.html',
  styleUrls: ['./offcanvas-content.component.css']
})
export class OffcanvasContentComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<OffcanvasContentComponent>) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
