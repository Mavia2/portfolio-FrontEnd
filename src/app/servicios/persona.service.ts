import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona } from '../model/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  expURL = '/persona'
  baseURL = environment.baseUrl;

  constructor(private httpClient : HttpClient) { }

  public save (persona : Persona): Observable<any>{
    return this.httpClient.post<any>(this.baseURL + `/new` + this.expURL, persona);
  }
  public update (id:number, persona : any): Observable<any>{
    return this.httpClient.put<any>(this.baseURL + `/update` + this.expURL + `/${id}` , persona);
  }
  public delete (id: number): Observable<any>{
    return this.httpClient.delete<any>(this.baseURL + `/delete`+ this.expURL + `/${id}`);
  }

}
