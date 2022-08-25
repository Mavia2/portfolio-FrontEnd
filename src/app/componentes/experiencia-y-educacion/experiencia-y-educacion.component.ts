import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';
import { EducacionService } from 'src/app/servicios/educacion.service';
import { Educacion } from 'src/app/model/educacion';
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

  constructor(private formBuilderEducacion:FormBuilder, private toastr: ToastrService,  private educacionService: EducacionService, private experienciaService: ExperienciaService, private datosPorfolio:PorfolioService, private formBuilder:FormBuilder ) {
    this.form=this.formBuilder.group(
      {
        id:[''],
        institucion:['',[Validators.required]],
        fotoUrl:['',[Validators.required]],
        cargo:['',[Validators.required]],
        descripcion:['',[Validators.required]],
        fechaInicio:['',[Validators.required]],
        fechaFin:['',[Validators.required]],
        lugar:['',[Validators.required]],
        idPersona:[''],
      }
    )
    this.formEducacion=this.formBuilderEducacion.group(
      {
        id:[''],
        institucion:['',[Validators.required]],
        fotoUrl:['',[Validators.required]],
        titulo:['',[Validators.required]],
        fechaInicio:['',[Validators.required]],
        fechaFin:['',[Validators.required]],
        lugar:['',[Validators.required]],
        idPersona:[''],
      }
    )
   }

  ngOnInit(): void {
    this.datosPorfolio.detail(1).subscribe(data=>{
      this.educacionList=data.educaciones;
      //this.educacionList.sort((a: Educacion,b: Educacion)=>{a.fechaFin - b.fechaFin})
      this.experienciaList=data.experiencias;
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
      this.mensajeEliminar = `Está seguro que desea eliminar: ${this.educacionList[index].institucion}?`
      // endpoint delete
    } else {
      this.tituloEliminar = 'Eliminar experiencia';
      this.mensajeEliminar = `Está seguro que desea eliminar esta experiencia ${this.experienciaList[index].institucion}?`
    }
    this.eliminarIndex = index
    this.formModalEliminar.show();
  }

  eliminar(){
    if (this.eliminarTipo == 'educacion') {
      //delete this.educacionList[this.eliminarIndex];
      this.educacionService.delete(this.educacionList[this.eliminarIndex].id).subscribe({
        next: (data) => {
          this.showSuccess();
          this.ngOnInit();
        },
        error: (e) => this.showError(),
        complete: () => console.info('complete')
    });
    } else {
      this.experienciaService.delete(this.experienciaList[this.eliminarIndex].id).subscribe({
        next: (data) => {
          this.showSuccess();
          this.ngOnInit();
        },
        error: (e) => this.showError(),
        complete: () => console.info('complete')
      });
    }
    this.formModalEliminar.hide();
  }

  save(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.experienciaList[index] = this.form.value
      this.experienciaService.update(this.experienciaList[index].id,{
        fotoUrl: this.experienciaList[index].fotoUrl,
        institucion: this.experienciaList[index].institucion,
        fechaInicio: this.experienciaList[index].fechaInicio,
        fechaFin: this.experienciaList[index].fechaFin,
        lugar: this.experienciaList[index].lugar,
        cargo: this.experienciaList[index].cargo,
        descripcion: this.experienciaList[index].descripcion,
        idPersona: 1

      } ).subscribe({
        next: (v) => this.showSuccess(),
        error: (e) => this.showError(),
        complete: () => console.info('complete')
    });
    } else {
      const payLoad = {
        fotoUrl: this.form.value.fotoUrl,
        institucion: this.form.value.institucion,
        fechaInicio: this.form.value.fechaInicio,
        fechaFin: this.form.value.fechaFin,
        lugar: this.form.value.lugar,
        cargo: this.form.value.cargo,
        descripcion: this.form.value.descripcion,
        idPersona: 1,
      }
      this.experienciaService.save(payLoad).subscribe({
        next: (data) => {
          console.log("DATA EXPERIENCIA",data);
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

  showSuccess() {
    this.toastr.success('Las modificacions se realizaron con éxito');
  }

  showError() {
    this.toastr.error('Error al realizar las modificaciones, por favor pruebe nuevamente en unos minutos');
  }

  saveEducacion(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    if (esEditar) {
      this.educacionList[index] = this.formEducacion.value
      this.educacionService.update(this.educacionList[index].id,{
        fotoUrl: this.educacionList[index].fotoUrl,
        institucion: this.educacionList[index].institucion,
        titulo: this.educacionList[index].titulo,
        fechaInicio:this.educacionList[index].fechaInicio,
        fechaFin: this.educacionList[index].fechaFin,
        lugar: this.educacionList[index].lugar,
        idPersona: 1,
      } ).subscribe({
        next: (v) => this.showSuccess(),
        error: (e) => this.showError(),
        complete: () => console.info('complete')
    });
    } else {
      const payload = {
        fotoUrl: this.formEducacion.value.fotoUrl,
        institucion: this.formEducacion.value.institucion,
        titulo: this.formEducacion.value.titulo,
        fechaInicio:this.formEducacion.value.fechaInicio,
        fechaFin: this.formEducacion.value.fechaFin,
        lugar: this.formEducacion.value.lugar,
        idPersona: 1,
      }
      this.educacionService.save(payload).subscribe({
        next: (data) => {
          console.log("DATA EDUCACION", data)
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) => this.showError(),
        complete: () => console.info('complete')
    });
    }

    this.formModalEducacion.hide();
  }

  get institucion() {
    return this.form.get('institucion');
  }
}
