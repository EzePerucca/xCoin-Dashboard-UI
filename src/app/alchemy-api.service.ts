import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlchemyApiService {
  private apiUrl = 'https://eth-sepolia.g.alchemy.com/v2/_xoodEdJ9iTcWejMaIPopwcagkctu0zw';

  constructor(private http: HttpClient) { }

  
  // Ejemplo de método GET
  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }
  
  // Ejemplo de método POST
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getBlockNumber(): Observable<any> {
    const body = {
      "jsonrpc": "2.0",
      "method": "eth_blockNumber",
      "params": [],
      "id": 1
    }
    return this.http.post<any>(`${this.apiUrl}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getGasUsedbyBlock(blockHash: string): Observable<any> {
    blockHash = "0x5a7c13"
    const body = {
      "jsonrpc": "2.0",
      "method": "eth_getBlockByNumber",
      "params": [blockHash, false],
      "id": 1
    }
    return this.http.post<any>(`${this.apiUrl}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getCurrentGasPrice(): Observable<any> {
    const body = {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "eth_gasPrice"
    }
    return this.http.post<any>(`${this.apiUrl}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  //#region not used
    getTransactionInfoByHash(transactionHash: any): Observable<any> {
      transactionHash = "0x4241aab8a8dc897ffa6a621af0730ee375eed7b5eac5edcc2b2c80ef9e0671ef";
      const body = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [transactionHash],
        "id": 1
      }
      return this.http.post<any>(`${this.apiUrl}`, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

  //#endregion not used
}
