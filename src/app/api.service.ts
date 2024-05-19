import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:3000/historicTransactions';

  constructor(private http: HttpClient) { }

  getTransactionHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
