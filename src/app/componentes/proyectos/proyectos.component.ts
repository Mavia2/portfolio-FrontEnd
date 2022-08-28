import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProyectoService } from 'src/app/servicios/proyecto.service';
import { ToastrService } from 'ngx-toastr';
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

  @Input() estaLogueado: Observable<boolean>;


  constructor(private toastr: ToastrService, private proyectoService: ProyectoService, private datosPorfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        id:[''],
        titulo:['',[Validators.required]],
        descripcion:['',[Validators.required]],
        fechaRealizacion:['',[Validators.required]],
        proyectoUrl:['',[Validators.required]],
        idPersona:[''],
      }
    )

  }

  ngOnInit(): void {
    this.datosPorfolio.detail(1).subscribe(data=>{
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
    this.mensajeEliminar = `Está seguro que desea eliminar este proyecto ${this.proyectosList[index].titulo}?`;
    // endpoint delete
    this.eliminarIndex = index;
    this.formModalEliminar.show();
  }

  showSuccess() {
    this.toastr.success('Las modificaciones se realizaron con éxito.');
  }

  showError() {
    this.toastr.error('Error al realizar las modificaciones, por favor pruebe nuevamente en unos minutos.');
  }


  save(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.proyectoService.update(this.proyectosList[index].id,{
        titulo: this.form.value.titulo,
        descripcion: this.form.value.descripcion,
        fechaRealizacion: this.form.value.fechaRealizacion,
        proyectoUrl: this.form.value.proyectoUrl,
        idPersona: 1
      } ).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) =>{
          this.showError();
        },
        complete: () => console.info('complete')
    });
    } else {
      const payLoad = {
        titulo: this.form.value.titulo,
        descripcion: this.form.value.descripcion,
        fechaRealizacion: this.form.value.fechaRealizacion,
        proyectoUrl: this.form.value.proyectoUrl,
        idPersona: 1
      }
      this.proyectoService.save(payLoad).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) => {
          this.showError();
          this.ngOnInit();
        },
        complete: () => console.info('complete')
    });
    }
    this.formModal.hide();
  }

  eliminar(){
    this.proyectoService.delete(this.proyectosList[this.eliminarIndex].id).subscribe({
      next: (data) => {
        this.showSuccess();
        this.ngOnInit();
      },
      error: (e) => this.showError(),
      complete: () => console.info('complete')
    });
    this.formModalEliminar.hide();
  }


  }


