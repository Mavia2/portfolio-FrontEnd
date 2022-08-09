import { Component, OnInit } from '@angular/core';
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


  constructor(private datosPorfolio:PorfolioService, private formBuilder:FormBuilder ) {
    this.form=this.formBuilder.group(
      {
        nombre:['',[Validators.required]],
        apellido:['',[Validators.required]],
      }
      )
   }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data => {
      this.miPortfolio=data;
      this.nombre?.setValue(this.miPortfolio.nombre);
      this.apellido?.setValue(this.miPortfolio.apellido);
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );

  }

  openFormModal() {
    this.formModal.show();
  }

  save(event: Event) {
    this.miPortfolio.nombre =  this.form.get('nombre')?.value
    this.miPortfolio.apellido = this.apellido?.value
    // guardar cambios en base de datos -> pegarle al endpot de update nombre y apellido
    this.formModal.hide();
  }

  get apellido()
  {
    return this.form.get('apellido');
  }

  get nombre()
  {
    return this.form.get('nombre');
  }


}
