import { Component } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { MessageModel } from '../../../models/message.model';
import { FormsModule, NgForm } from '@angular/forms';
import { SwalService } from '../../../services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  model: MessageModel = new MessageModel();

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private spinner: NgxSpinnerService
  ) {}

  send(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<MessageModel>('Messages/Create', null, this.model)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              form.resetForm();
              this.swal.callToast(res.successMessage);
              this.spinner.hide();
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.error.ErrorMessages) {
              err.error.ErrorMessages.forEach((error: any) => {
                this.swal.callToast(error, 'error');
              });
            }
            this.spinner.hide();
          },
        });
    }
  }
}
