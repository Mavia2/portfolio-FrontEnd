import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PorfolioService {
  expURL = '/experiencia'
  baseURL = environment.baseUrl;

  constructor(private httpClient : HttpClient) { }
  public lista(): Observable<Experiencia[]>{
    return this.httpClient.get<Experiencia[]>(this.baseURL + `/get` + this.expURL);
  }
  public detail (id:number): Observable<Experiencia>{
    return this.httpClient.get<Experiencia>(this.baseURL + `/get`+ this.expURL + `/${id}`);
  }
  public save (experiencia : Experiencia): Observable<any>{
    return this.httpClient.post<any>(this.baseURL + `/new` + this.expURL, experiencia);
  }
  public update (id:number, experiencia : Experiencia): Observable<any>{
    return this.httpClient.put<any>(this.baseURL + `/update` + this.expURL + `/${id}` , experiencia);
  }
  public delete (id: number): Observable<any>{
    return this.httpClient.delete<any>(this.baseURL + `/delete`+ this.expURL + `/${id}`);
  }



  obtenerDatos():Observable<any>{
    return this.http.get('../../assets/data/data.json');

  }
}
