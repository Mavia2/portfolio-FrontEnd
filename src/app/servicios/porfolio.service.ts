import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona } from '../model/persona';
import { Portfolio } from '../model/portfolio';

@Injectable({
  providedIn: 'root'
})
export class PorfolioService {
  expURL = '/persona'
  baseURL = environment.baseUrl;

  constructor(private httpClient : HttpClient) { }
  public lista(): Observable<Portfolio[]>{
    return this.httpClient.get<Portfolio[]>(this.baseURL + `/get` + this.expURL);
  }
  public detail (id:number): Observable<Portfolio>{
    return this.httpClient.get<Portfolio>(this.baseURL + `/get`+ this.expURL + `/${id}`);
  }
}
