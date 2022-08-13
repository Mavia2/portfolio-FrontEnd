import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
declare var window: any;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skillsList: any;
  editIcon = faPen;
  deleteIcon = faTrashAlt;
  addIcon = faPlusCircle
  formModal: any;
  formModalEliminar: any;
  form: FormGroup;
  esEditar = true;
  index = 0;
  tituloEliminar='';
  mensajeEliminar='';
  eliminarIndex: number;

  @Input() estaLogueado: Observable<boolean>;


  constructor(private datosPorfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        nombre:['',[Validators.required]],
        porcentaje:['',[Validators.required]],

      }
    )


   }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data => {
      this.skillsList=data.skills;

    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modalSkill')
    );
    this.formModalEliminar = new window.bootstrap.Modal(
      document.getElementById('modalEliminarSkill')
    );
  }

  openFormModal(type: string, index?: any) {
    if (type == 'edit') {
      this.index = index
      this.esEditar = true
      this.form.setValue(this.skillsList[index])
      this.formModal.show();
    } else {
      this.esEditar = false
      this.form.reset()
      this.formModal.show();
    }
  }

  openEliminar( index: any){
    this.tituloEliminar = 'Eliminar skills';
    this.mensajeEliminar = `Esta seguro que desea eliminar  ${this.skillsList[index].nombre}?`
    // endpoint delete
    this.eliminarIndex = index
    this.formModalEliminar.show();
  }

  save(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.skillsList[index] = this.form.value
    // guardar cambios en base de datos -> pegarle al endpot de update experiencia
    } else {
      this.skillsList.unshift(this.form.value);
      // agregar experiencia en base de datos -> pegarle al endpot de crear experiencia
    }
    this.formModal.hide();
  }

  eliminar(){
    delete this.skillsList[this.eliminarIndex];
    // endpoint delete
    this.formModalEliminar.hide();
  }

}
