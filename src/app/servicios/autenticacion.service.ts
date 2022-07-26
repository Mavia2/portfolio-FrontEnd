import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable}from 'rxjs';
import  {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  url=`${environment.baseUrl}/login`;
  currentUserSubject:BehaviorSubject<any>;
  isLoginSubject: BehaviorSubject<boolean>;

  constructor(private http:HttpClient) {
    this.currentUserSubject= new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')|| '{}'));
    this.isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
   }

   IniciarSesion(credenciales:any):Observable<any>
   {

    return this.http.post(this.url, credenciales).pipe(map(data=>{
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUserSubject.next(data);
      this.isLoginSubject.next(true);
      return data;
    }))
   }

   private hasToken() : boolean {
    return !!sessionStorage.getItem('currentUser');
  }

   get usuarioAutenticado()
   {
    return this.currentUserSubject.value;
   }

   logout(){
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoginSubject.next(false);
   }

   get estaLogueado(): Observable<boolean>{
    return this.isLoginSubject.asObservable();
   }

}
