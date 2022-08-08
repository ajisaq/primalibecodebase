import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNextBtn]'
})
export class NextBtnDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click')
  nextHandler() {
    let element = this.elementRef.nativeElement.parentElement.parentElement.children[0];
    let item = element.getElementsByClassName('item');
    element.append(item[0]);
  }


  // nextHandler() {
  //   let element = this.elementRef.nativeElement.parentElement.children[0].children[0].children[0];
  //   let item = element.getElementsByClassName('slider-item');
  //   element.append(item[0]);
  //   console.log(item);
  // }

}
