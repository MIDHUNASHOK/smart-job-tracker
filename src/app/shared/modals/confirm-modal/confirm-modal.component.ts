import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  @Input() title = 'Confirm Delete';

  @Input() message =
    'Are you sure?';

  @Output() confirm =
    new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  confirmDelete() {

    this.confirm.emit();

    this.activeModal.close();

  }

}