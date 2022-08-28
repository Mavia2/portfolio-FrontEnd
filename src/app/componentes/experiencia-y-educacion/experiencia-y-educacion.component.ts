import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt, faCalendarDay} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';
import { EducacionService } from 'src/app/servicios/educacion.service';
import {  StorageService } from 'src/app/servicios/firebase-storage.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from 'src/app/utils/MomentDateFormatter ';
import * as moment from 'moment';
import { Educacion } from 'src/app/model/educacion';
import { Experiencia } from 'src/app/model/experiencia';
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
  calendarIcon = faCalendarDay;
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
  model: any;
  modelFin: any;
  modelEducacionInicio: any;
  modelEducacionFin: any;

  @Input() estaLogueado: Observable<boolean>;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
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
      const educacion = data.educaciones;
      this.educacionList = educacion.sort((a: Educacion,b: Educacion)=>{return moment(b.fechaFin, "DD/MM/YYYY").diff(moment(a.fechaFin, "DD/MM/YYYY"));})
      this.experienciaList=data.experiencias.sort((a: Experiencia,b: Experiencia)=>{return moment(b.fechaFin, "DD/MM/YYYY").diff(moment(a.fechaFin, "DD/MM/YYYY"));});
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
      const date = moment(this.form.value.fechaInicio, "DD/MM/YYYY");
      const newDate = {year: Number(date.format('YYYY')), month: Number(date.format('M')), day: Number(date.format('D'))};
      this.form.patchValue({fechaInicio: newDate});
      const dateFin = moment(this.form.value.fechaFin, "DD/MM/YYYY");
      const year = Number(dateFin.format('YYYY'));
      const month = Number(dateFin.format('M'));
      const day = Number(dateFin.format('D'));
      const newDateFin = {year: year, month: month, day: day};
      this.form.patchValue({fechaFin: newDateFin});
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
      const date = moment(this.formEducacion.value.fechaInicio, "DD/MM/YYYY");
      const newDate = {year: Number(date.format('YYYY')), month: Number(date.format('M')), day: Number(date.format('D'))};
      this.formEducacion.patchValue({fechaInicio: newDate});
      const dateFin = moment(this.formEducacion.value.fechaFin, "DD/MM/YYYY");
      const newDateFin = {year: Number(dateFin.format('YYYY')), month: Number(dateFin.format('M')), day: Number(dateFin.format('D'))};
      this.formEducacion.patchValue({fechaFin: newDateFin});
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
      save(type === "experiencia" ? this.form.value.fotoUrl : this.formEducacion.value.fotoUrl, esEditar, index);
      type === "experiencia" ? this.formModal.hide(): this.formModalEducacion.hide();
    }
  }

  saveExperiencia = (url: string, esEditar: boolean, index?: any) => {
    let ngbDate = this.form.controls['fechaInicio'].value;
    let ngbDateFin = this.form.controls['fechaFin'].value;
    let myDate = this.ngbDateParserFormatter.format(ngbDate);
    let myDateFin = this.ngbDateParserFormatter.format(ngbDateFin);
    if (esEditar){
      this.form.patchValue({fotoUrl: url});
      this.experienciaList[index] = this.form.value
      this.experienciaService.update(this.experienciaList[index].id,{
        fotoUrl: this.experienciaList[index].fotoUrl,
        institucion: this.experienciaList[index].institucion,
        fechaInicio: myDate,
        fechaFin: myDateFin,
        lugar: this.experienciaList[index].lugar,
        cargo: this.experienciaList[index].cargo,
        descripcion: this.experienciaList[index].descripcion,
        idPersona: 1
      }).subscribe({
        next: (v) => {
          this.ngOnInit();
          this.showSuccess();
        },
        error: (e) =>  {
          this.showError();
          this.ngOnInit();
        },
        complete: () => this.formModal.hide()
      });

    } else {
      const payLoad = {
        fotoUrl: url,
        institucion: this.form.value.institucion,
        fechaInicio: myDate,
        fechaFin: myDateFin,
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
    let ngbDate = this.formEducacion.controls['fechaInicio'].value;
    let ngbDateFin = this.formEducacion.controls['fechaFin'].value;
    let myDate = this.ngbDateParserFormatter.format(ngbDate);
    let myDateFin = this.ngbDateParserFormatter.format(ngbDateFin);
    if (esEditar){
      this.formEducacion.patchValue({fotoUrl: url});
      this.educacionList[index] = this.formEducacion.value
      this.educacionService.update(this.educacionList[index].id,{
        fotoUrl: this.educacionList[index].fotoUrl,
        institucion: this.educacionList[index].institucion,
        fechaInicio: myDate,
        titulo: this.educacionList[index].titulo,
        lugar: this.educacionList[index].lugar,
        fechaFin: myDateFin,
        idPersona: 1
      }).subscribe({
        next: (v) => {
          this.showSuccess();
          this.educacionList[index].imagen = null;
          this.ngOnInit();
        },
        error: (e) => {
          this.showError();
          this.educacionList[index].imagen = null;
          this.ngOnInit();
        },
        complete: () => this.formModal.hide()
      });

    } else {
      const payLoad = {
        fotoUrl: url,
        institucion: this.formEducacion.value.institucion,
        fechaInicio: myDate,
        fechaFin: myDateFin,
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
