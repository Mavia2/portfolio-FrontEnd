import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SkillService } from 'src/app/servicios/skill.service';
import { ToastrService } from 'ngx-toastr';
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


  constructor(private toastr: ToastrService, private skillService: SkillService, private datosPortfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        id:['',[Validators.required]],
        nombre:['',[Validators.required]],
        porcentaje:['',[Validators.required]],
        idPersona:['',[Validators.required]],

      }
    )
   }

  ngOnInit(): void {
    this.datosPortfolio.detail(1).subscribe(data => {
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
      this.skillService.update(this.skillsList[index].id,{
        nombre: this.form.value.nombre,
        porcentaje: this.form.value.porcentaje,
        idPersona: 1
      } ).subscribe({
        next: (data) => {
          console.log("DATA SKILL", data)
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) =>{
          this.showError();
        },
        complete: () => console.info('complete')
    });
    } else {
      this.skillsList.unshift(this.form.value);
      const payLoad = {
        nombre: this.form.value.nombre,
        porcentaje: this.form.value.porcentaje,
        idPersona: 1,
      }
      this.skillService.save(payLoad).subscribe({
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
    this.toastr.success('Las modificaciones se realizaron con éxito.');
  }

  showError() {
    this.toastr.error('Error al realizar las modificaciones, por favor pruebe nuevamente en unos minutos.');
  }


  eliminar(){
       this.skillService.delete(this.skillsList[this.eliminarIndex].id).subscribe({
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
