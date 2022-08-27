import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';
import { EducacionService } from 'src/app/servicios/educacion.service';
import {  StorageService } from 'src/app/servicios/firebase-storage.service';
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
  file?: File;
  nombreArchivo = '';
  isUploading: boolean = false;
  fotoUrlDefault = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1920px-IBM_logo.svg.png"


  @Input() estaLogueado: Observable<boolean>;

  constructor(
    private readonly storageService: StorageService,
    private formBuilderEducacion:FormBuilder,
    private toastr: ToastrService,
    private educacionService: EducacionService,
    private experienciaService: ExperienciaService,
    private datosPorfolio:PorfolioService,
    private formBuilder:FormBuilder ) {
    this.form=this.formBuilder.group(
      {
        id:[''],
        institucion:['',[Validators.required]],
        fotoUrl:[''],
        imagen:[null],
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
        fotoUrl:[''],
        imagen:[null],
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
      this.index = index;
      this.esEditar = true;
      this.form.patchValue(this.experienciaList[index]);
      this.form.patchValue({imagen: null});
      this.formModal.show();
    } else {
      this.esEditar = false
      this.form.reset()
      this.form.patchValue({fotoUrl: this.fotoUrlDefault})
      this.formModal.show();
    }
  }

  openFormModalEducacion(type: string, index?: any) {
    if (type == 'edit') {
      this.index = index
      this.esEditar = true
      this.formEducacion.patchValue(this.educacionList[index])
      this.formEducacion.patchValue({imagen: null});
      this.formModalEducacion.show();
    } else {
      this.esEditar = false
      this.formEducacion.reset()
      this.formEducacion.patchValue({fotoUrl: this.fotoUrlDefault})
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

  handleSaveExperiencia(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    this.subirArchivo(this.saveExperiencia, esEditar, "experiencia", index);
  }

 subirArchivo(save: (url:string, esEditar: boolean, index?: any) => void, esEditar: boolean, type: string, index?: any) {
    if (this.file) {
      let archivo = this.file;
      const { downloadUrl$ } = this.storageService.uploadFileAndGetMetadata(
        this.nombreArchivo,
        archivo,
      );
      this.isUploading = true;
      downloadUrl$
      .pipe(
        finalize(() =>  "" )
      )
      .subscribe((downloadUrl) => {
        save(downloadUrl, esEditar, index);
        this.file = undefined;
        this.isUploading = false;
        type === "experiencia" ? this.formModal.hide(): this.formModalEducacion.hide();
      });
    } else {
      save(this.formEducacion.value.fotoUrl, esEditar, index);
      type === "experiencia" ? this.formModal.hide(): this.formModalEducacion.hide();
    }
  }

  saveExperiencia = (url: string, esEditar: boolean, index?: any) => {
    if (esEditar){
      this.form.patchValue({fotoUrl: url});
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
      }).subscribe({
        next: (v) => this.showSuccess(),
        error: (e) => this.showError(),
        complete: () => this.formModal.hide()
      });

    } else {
      const payLoad = {
        fotoUrl: url,
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
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) => {
          this.showError();
          this.ngOnInit();
        },
        complete: () =>  {
        },
      });
    }
  }

  handleSaveEducacion(event: Event, esEditar: boolean, index?: any) {
    event.preventDefault
    this.subirArchivo(this.saveEducacion, esEditar, "educacion",  index);
  }

  saveEducacion = (url: string, esEditar: boolean, index?: any)=>{
    if (esEditar){
      this.formEducacion.patchValue({fotoUrl: url});
      this.educacionList[index] = this.formEducacion.value
      this.educacionService.update(this.educacionList[index].id,{
        fotoUrl: this.educacionList[index].fotoUrl,
        institucion: this.educacionList[index].institucion,
        fechaInicio: this.educacionList[index].fechaInicio,
        titulo: this.educacionList[index].titulo,
        lugar: this.educacionList[index].lugar,
        fechaFin: this.experienciaList[index].fechaFin,
        idPersona: 1
      }).subscribe({
        next: (v) => {
          this.showSuccess();
          this.educacionList[index].imagen = null;
        },
        error: (e) => {
          this.showError();
          this.educacionList[index].imagen = null;
        },
        complete: () => this.formModal.hide()
      });

    } else {
      const payLoad = {
        fotoUrl: url,
        institucion: this.formEducacion.value.institucion,
        fechaInicio: this.formEducacion.value.fechaInicio,
        fechaFin: this.formEducacion.value.fechaFin,
        lugar: this.formEducacion.value.lugar,
        titulo: this.formEducacion.value.titulo,
        idPersona: 1,
      }
      this.educacionService.save(payLoad).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) => {
          this.showError();
          this.ngOnInit();
        },
        complete: () =>  {
        },
      });
    }
  }

  public cambioArchivo(event: any) {
    if (event.target.files.length > 0) {
        this.nombreArchivo = event.target.files[0].name;
        this.file = event.target.files[0];
    }
  }

  showSuccess() {
    this.toastr.success('Las modificacions se realizaron con éxito');
  }

  showError() {
    this.toastr.error('Error al realizar las modificaciones, por favor pruebe nuevamente en unos minutos');
  }

  get institucion() {
    return this.form.get('institucion');
  }
}
