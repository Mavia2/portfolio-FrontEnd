import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proyecto } from '../model/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  expURL = '/proyecto'
  baseURL = environment.baseUrl;

  constructor(private httpClient : HttpClient) { }
  public lista(): Observable<Proyecto[]>{
    return this.httpClient.get<Proyecto[]>(this.baseURL + `/get` + this.expURL);
  }
  public detail (id:number): Observable<Proyecto>{
    return this.httpClient.get<Proyecto>(this.baseURL + `/get`+ this.expURL + `/${id}`);
  }
  public save (proyecto : Proyecto): Observable<any>{
    return this.httpClient.post<any>(this.baseURL + `/new` + this.expURL, proyecto);
  }
  public update (id:number, proyecto : Proyecto): Observable<any>{
    return this.httpClient.put<any>(this.baseURL + `/update` + this.expURL + `/${id}` , proyecto);
  }
  public delete (id: number): Observable<any>{
    return this.httpClient.delete<any>(this.baseURL + `/delete`+ this.expURL + `/${id}`);
  }
}
