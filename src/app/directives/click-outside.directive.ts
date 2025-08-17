import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() public appClickOutside = new EventEmitter<void>();
  
  constructor(private elementRef: ElementRef) { }

   @HostListener('document:click', ['$event.target'])
    public onClick(targetElement: any): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    
    // Si el clic no fue dentro del elemento y el menú está visible, emitir el evento
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
