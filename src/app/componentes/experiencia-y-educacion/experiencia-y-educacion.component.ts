import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var window: any;

@Component({
  selector: 'app-experiencia-y-educacion',
  templateUrl: './experiencia-y-educacion.component.html',
  styleUrls: ['./experiencia-y-educacion.component.css']
})
export class ExperienciaYEducacionComponent implements OnInit {
  educacionList: any;
  experienciaList:[any];
  editIcon = faPen;
  deleteIcon = faTrashAlt;
  addIcon = faPlusCircle;
  formModal: any;
  form:FormGroup;
  esEditar = true;
  index = 0;


  @Input() estaLogueado: boolean = false;

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
   }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=>{
      this.educacionList=data.educacion;
      this.experienciaList=data.experiencia;
    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modalExperiencia')
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

  get institucion() {
    return this.form.get('institucion');
  }
}
