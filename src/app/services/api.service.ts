import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getTransactionHistory(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/historicTransactions`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
