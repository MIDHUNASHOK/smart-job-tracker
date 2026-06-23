import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chrome-extension-popup',
  templateUrl: './chrome-extension-popup.component.html',
  styleUrl: './chrome-extension-popup.component.scss'
})
export class ChromeExtensionPopupComponent {
   constructor(
    public activeModal: NgbActiveModal
  ) {}

  closeModal() {
    this.activeModal.close();
  }

}
