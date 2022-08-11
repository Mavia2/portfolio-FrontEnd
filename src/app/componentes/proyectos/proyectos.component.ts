import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var window: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectosList:any;
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

  @Input() estaLogueado: boolean = false;


  constructor(private datosPorfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        titulo:['',[Validators.required]],
        descripcion:['',[Validators.required]],
        proyectoUrl:['',[Validators.required]],

      }
    )

  }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=>{
      this.proyectosList=data.proyectos;


    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modalProyectos')
    );
    this.formModalEliminar = new window.bootstrap.Modal(
      document.getElementById('modalEliminarProyectos')
    );
  }

  openFormModal(type: string, index?: any) {
    if (type == 'edit') {
      this.index = index
      this.esEditar = true
      this.form.setValue(this.proyectosList[index])
      this.formModal.show();
    } else {
      this.esEditar = false
      this.form.reset()
      this.formModal.show();
    }
  }

  openEliminar( index: any){
    this.tituloEliminar = 'Eliminar proyecto';
    this.mensajeEliminar = `Esta seguro que desea eliminar este proyecto ${this.proyectosList[index].titulo}?`;
    // endpoint delete
    this.eliminarIndex = index;
    this.formModalEliminar.show();
    console.log('TEST')
  }

  save(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.proyectosList[index] = this.form.value
    // guardar cambios en base de datos -> pegarle al endpot de update experiencia
    } else {
      this.proyectosList.unshift(this.form.value);
      // agregar experiencia en base de datos -> pegarle al endpot de crear experiencia
    }
    this.formModal.hide();
  }

  eliminar(){
    delete this.proyectosList[this.eliminarIndex];
    // endpoint delete
    this.formModalEliminar.hide();
  }


  }


