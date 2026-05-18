import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent {

  // INPUTS
  @Input() modalType!: string;

  @Input() modalData: any;

  // OUTPUT
  @Output() saveJob = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService
  ) {}

  submitJob() {

    const jobData = {
      title: 'Frontend Developer',
      company: 'Google'
    };

    // Send data to parent component
    this.saveJob.emit(jobData);
    this.toastService.success('Job added successfully');

    console.log('Job Submitted:', jobData);

    // Close modal
    this.activeModal.close();

  }

}