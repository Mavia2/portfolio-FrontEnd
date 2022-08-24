import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../model/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  expURL = '/skill'
  baseURL = environment.baseUrl;

  constructor(private httpClient : HttpClient) { }
  public lista(): Observable<Skill[]>{
    return this.httpClient.get<Skill[]>(this.baseURL + `/get` + this.expURL);
  }
  public detail (id:number): Observable<Skill>{
    return this.httpClient.get<Skill>(this.baseURL + `/get`+ this.expURL + `/${id}`);
  }
  public save (skill : Skill): Observable<any>{
    return this.httpClient.post<any>(this.baseURL + `/new` + this.expURL, skill);
  }
  public update (id:number, skill : Skill): Observable<any>{
    return this.httpClient.put<any>(this.baseURL + `/update` + this.expURL + `/${id}` , skill);
  }
  public delete (id: number): Observable<any>{
    return this.httpClient.delete<any>(this.baseURL + `/delete`+ this.expURL + `/${id}`);
  }
}
