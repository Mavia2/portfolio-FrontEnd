import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var window: any;


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  miPortfolio: any;
  editIcon = faPen;
  formModal: any;
  form:FormGroup;
  formInfoContacto: any;

  @Input() estaLogueado: boolean = false;

  constructor(private datosPorfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        nombre:['',[Validators.required]],
        apellido:['',[Validators.required]],
        ocupacion:['',[Validators.required]],
        ciudad:['',[Validators.required]],
        pais:['',[Validators.required]],
        celular:['',[Validators.required]],
        email:['',[Validators.required]],
      }
      )
   }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data => {
      this.miPortfolio=data;
      this.nombre?.setValue(this.miPortfolio.nombre);
      this.apellido?.setValue(this.miPortfolio.apellido);
      this.ocupacion?.setValue(this.miPortfolio.ocupacion);
      this.ciudad?.setValue(this.miPortfolio.ciudad);
      this.pais?.setValue(this.miPortfolio.pais);
      this.celular?.setValue(this.miPortfolio.celular);
      this.email?.setValue(this.miPortfolio.email);
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.formInfoContacto = new window.bootstrap.Modal(
      document.getElementById('infoContacto')
    );

  }

  openFormModal() {
    this.formModal.show();
  }

  openformInfoContacto(){
    this.formInfoContacto.show();
  }

  save(event: Event) {
    this.miPortfolio.nombre =  this.form.get('nombre')?.value
    this.miPortfolio.apellido = this.apellido?.value
    this.miPortfolio.ocupacion = this.ocupacion?.value
    this.miPortfolio.ciudad = this.ciudad?.value
    this.miPortfolio.pais = this.pais?.value


    // guardar cambios en base de datos -> pegarle al endpot de update nombre y apellido
    this.formModal.hide();
  }

  saveInfoContacto(event: Event){
    this.miPortfolio.celular = this.celular?.value
    this.miPortfolio.email = this.email?.value
    // guardar cambios en base de datos -> pegarle al endpot de update nombre y apellido
    this.formInfoContacto.hide();
  }

  get apellido()
  {
    return this.form.get('apellido');
  }

  get nombre()
  {
    return this.form.get('nombre');
  }
  get ocupacion()
  {
    return this.form.get('ocupacion');
  }
  get ciudad()
  {
    return this.form.get('ciudad');
  }
  get pais()
  {
    return this.form.get('pais');
  }
  get celular()
  {
    return this.form.get('celular');
  }
  get email()
  {
    return this.form.get('email');
  }
}
