import { Directive, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[appPreviousBtn]'
})
export class PreviousBtnDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click')
  previousHandler() {
    let element = this.elementRef.nativeElement.parentElement.parentElement.children[0];
    let item = element.getElementsByClassName('item');
    element.prepend(item[item.length - 1]);    
  }

}
