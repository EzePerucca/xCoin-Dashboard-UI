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

  getXWalletAccountBalance(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/balance/0x8A0da10861c24A818B600F971a983432044bBcfd`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTotalValueOperated(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/getTotalValueOperated`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getApprovalRate(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/approvalRate`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getHashRate(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/hashRate`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTotalSupply(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/totalSupply`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
