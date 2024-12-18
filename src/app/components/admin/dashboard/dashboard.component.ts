import { Component } from '@angular/core';
import { DashboardStatisticsModel } from '../../../models/dashboard-statistics.model';
import { SwalService } from '../../../services/swal.service';
import { HttpService } from '../../../services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  statistics: DashboardStatisticsModel = new DashboardStatisticsModel();

  constructor(
    private swal: SwalService,
    private http: HttpService,
    private spinner: NgxSpinnerService
  ) {
    this.getStatistics();
  }

  getStatistics() {
    this.spinner.show();

    this.http
      .post<DashboardStatisticsModel>('Dashboard/GetStatistics')
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.statistics = res.data;
            this.spinner.hide();
          } else if (res.errorMessages) {
            res.errorMessages.forEach((error) => {
              this.swal.callToast(error, 'error');
            });
            this.spinner.hide();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }
}
