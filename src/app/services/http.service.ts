import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';
import { apiUrl } from '../constants';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  post<T>(
    endpoint: string,
    param?: any,
    body?: any
  ): Observable<ResultModel<T>> {
    const url = param
      ? `${apiUrl}/${endpoint}?${param}`
      : `${apiUrl}/${endpoint}`;
    return this.http.post<ResultModel<T>>(url, body, {
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });
  }
}
