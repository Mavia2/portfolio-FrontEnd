import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {
  form:FormGroup;
  isLoading = false;
  hide = true;

  constructor(private formBuilder:FormBuilder, private autenticacionService:AutenticacionService, private ruta:Router) {
    this.form=this.formBuilder.group(
    {
      username:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(8)]],
      deviceInfo:this.formBuilder.group({
      deviceId:["17867868768"],
      deviceType:["DEVICE_TYPE_ANDROI"],
      notificationToken:["67657575eececc34"]
      })
    }
    )
   }

  ngOnInit(): void {
  }

  get Username()
  {
    return this.form.get('username');
  }

  get Password()
  {
    return this.form.get('password');

  }

  onEnviar(event:Event) {
    event.preventDefault;
    this.isLoading = true;
    this.autenticacionService.IniciarSesion(this.form.value).subscribe({
      next: (data) => {
        this.ruta.navigate(['/']);
      },
      error: (error) => {
        this.form.reset();
        this.isLoading = false;
        if(error.status === 401 || error.error.type === 'password-not-equal'){
          this.form.controls['username'].setErrors({ auth: true });
          this.form.controls['password'].setErrors({ auth:true });
        } else {
          this.form.controls['username'].setErrors({ generalError: true });
        }
      },
      complete: () => ''
    })
  }

}
