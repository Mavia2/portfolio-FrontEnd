import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
declare var window: any;

@Component({
  selector: 'app-experiencia-y-educacion',
  templateUrl: './experiencia-y-educacion.component.html',
  styleUrls: ['./experiencia-y-educacion.component.css']
})
export class ExperienciaYEducacionComponent implements OnInit {
  educacionList: any;
  experienciaList:any;
  editIcon = faPen;
  deleteIcon = faTrashAlt;
  addIcon = faPlusCircle;
  formModal: any;
  formModalEducacion: any;
  formModalEliminar: any;
  form: FormGroup;
  formEducacion: FormGroup;
  esEditar = true;
  index = 0;
  tituloEliminar='';
  mensajeEliminar='';
  eliminarIndex: number;
  eliminarTipo: string;


  @Input() estaLogueado: Observable<boolean>;

  constructor(private datosPorfolio:PorfolioService, private formBuilder:FormBuilder ) {
    this.form=this.formBuilder.group(
      {
        institucion:['',[Validators.required]],
        fotoUrl:['',[Validators.required]],
        cargo:['',[Validators.required]],
        descripcion:[''],
        fechaInicio:['',[Validators.required]],
        fechaFin:['',[Validators.required]],
        lugar:['',[Validators.required]],
      }
    )
    this.formEducacion=this.formBuilder.group(
      {
        institucion:['',[Validators.required]],
        fotoUrl:['',[Validators.required]],
        titulo:['',[Validators.required]],
        fechaInicio:['',[Validators.required]],
        fechaFin:['',[Validators.required]],
        lugar:['',[Validators.required]],
      }
    )
   }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=>{
      this.educacionList=data.educacion;
      this.experienciaList=data.experiencia;
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modalExperiencia')
    );
    this.formModalEducacion = new window.bootstrap.Modal(
      document.getElementById('modalEducacion')
    );
    this.formModalEliminar = new window.bootstrap.Modal(
      document.getElementById('modalEliminar')
    );

  }

  openFormModal(type: string, index?: any) {
    if (type == 'edit') {
      this.index = index
      this.esEditar = true
      this.form.setValue(this.experienciaList[index])
      this.formModal.show();
    } else {
      this.esEditar = false
      this.form.reset()
      this.formModal.show();
    }
  }

  openFormModalEducacion(type: string, index?: any) {
    if (type == 'edit') {
      this.index = index
      this.esEditar = true
      this.formEducacion.setValue(this.educacionList[index])
      this.formModalEducacion.show();
    } else {
      this.esEditar = false
      this.formEducacion.reset()
      this.formModalEducacion.show();
    }
  }

  openEliminar(tipo: string, index: any){
    this.eliminarTipo = tipo
    if (tipo == 'educacion') {
      this.tituloEliminar = 'Eliminar Educacion';
      this.mensajeEliminar = `Esta seguro que desea eliminar esta institucion ${this.educacionList[index].institucion}`
      // endpoint delete
    } else {
      this.tituloEliminar = 'Eliminar experiencia';
      this.mensajeEliminar = `Esta seguro que desea eliminar esta experiencia ${this.experienciaList[index].institucion}`
    }
    this.eliminarIndex = index
    this.formModalEliminar.show();
  }

  eliminar(){
    if (this.eliminarTipo == 'educacion') {
      delete this.educacionList[this.eliminarIndex];
      // endpoint delete
    } else {
      delete this.experienciaList[this.eliminarIndex];
      // endpoint delete
    }
    this.formModalEliminar.hide();
  }

  save(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.experienciaList[index] = this.form.value
    // guardar cambios en base de datos -> pegarle al endpot de update experiencia
    } else {
      this.experienciaList.unshift(this.form.value);
      // agregar experiencia en base de datos -> pegarle al endpot de crear experiencia
    }
    this.formModal.hide();
  }

  saveEducacion(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.educacionList[index] = this.formEducacion.value
    // guardar cambios en base de datos -> pegarle al endpot de update experiencia
    } else {
      this.educacionList.unshift(this.formEducacion.value);
      // agregar experiencia en base de datos -> pegarle al endpot de crear experiencia
    }
    this.formModalEducacion.hide();
  }

  get institucion() {
    return this.form.get('institucion');
  }
}
