import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  constructor() {}

  callAlert(title: string, text?: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: 3000,
      showConfirmButton: false,
      showCancelButton: false,
    });
  }

  callToast(title: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      title: title,
      timer: 5000,
      icon: icon,
      position: 'bottom-end',
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton: false,
      toast: true,
    });
  }

  callSwal(
    title: string,
    text: string | undefined,
    confirmBtnText: string,
    cancelButtonText: string,
    icon: SweetAlertIcon = 'success',
    callback: () => void
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: true,
      confirmButtonText: confirmBtnText,
      showCancelButton: true,
      cancelButtonText: cancelButtonText,
    }).then((res) => {
      if (res.isConfirmed) {
        callback();
      }
    });
  }
}

export type SweetAlertIcon =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'question';
