import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chrome-extension-popup',
  templateUrl: './chrome-extension-popup.component.html',
  styleUrl: './chrome-extension-popup.component.scss'
})
export class ChromeExtensionPopupComponent {
   chromeStoreUrl =
    'https://chromewebstore.google.com/detail/jgegomlhmdddpphokmaekelefgjblmhn';
   constructor(
    public activeModal: NgbActiveModal
  ) {}

   installExtension() {
    window.open(this.chromeStoreUrl, '_blank');

    localStorage.setItem(
      'chromeExtensionPopupShown',
      'true'
    );

    this.activeModal.close();
  }

  closeModal() {
    localStorage.setItem(
      'chromeExtensionPopupShown',
      'true'
    );

    this.activeModal.close();
  }

}
