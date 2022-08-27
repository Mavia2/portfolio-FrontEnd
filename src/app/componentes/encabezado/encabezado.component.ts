import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { finalize, Observable } from 'rxjs';
import { PersonaService } from 'src/app/servicios/persona.service';
import { ToastrService } from 'ngx-toastr';
import { Portfolio } from 'src/app/model/portfolio';
import { StorageService } from 'src/app/servicios/firebase-storage.service';
declare var window: any;


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  miPortfolio: Portfolio;
  editIcon = faPen;
  formModal: any;
  formFotoModal: any;
  form:FormGroup;
  formFoto:FormGroup;
  formInfoContacto: any;
  file?: File;
  nombreArchivo = '';
  tipoFoto = "";
  tituloFoto = '';
  isUploading: boolean = false;
  fotoUrlHeaderDefault = "https://www.xtrafondos.com/wallpapers/espiral-tecnologico-4564.jpg"
  fotoUrlPerfilDefault = "https://files.loveisinmyhair.com/files/styles/large/public/c/cara-ovalada-cortes-de-cabello.jpg?itok=xonSYCXk"


  @Input() estaLogueado: Observable<boolean>;

  constructor( private readonly storageService: StorageService, private toastr: ToastrService, private personaService: PersonaService, private datosPorfolio:PorfolioService, private formBuilder:FormBuilder, private router: Router, private autenticacionService:AutenticacionService) {
    this.form=this.formBuilder.group(
      {
        nombre:['',[Validators.required]],
        apellido:['',[Validators.required]],
        ocupacion:['',[Validators.required]],
        ciudad:['',[Validators.required]],
        pais:['',[Validators.required]],
        celular:['',[Validators.required]],
        email:['',[Validators.required, Validators.email]],
      }
      )
      this.formFoto=this.formBuilder.group(
        {
          imagen:[null,[Validators.required]],
          fotoUrl:[''],
        }
        )
   }

  ngOnInit(): void {
    this.datosPorfolio.detail(1).subscribe(data => {
      this.miPortfolio=data;
      if (this.miPortfolio.imagenHeader === null) this.miPortfolio.imagenHeader = this.fotoUrlHeaderDefault;
      if (this.miPortfolio.imagenPerfil === null) this.miPortfolio.imagenPerfil = this.fotoUrlPerfilDefault;
      this.nombre?.setValue(this.miPortfolio.nombre);
      this.apellido?.setValue(this.miPortfolio.apellido);
      this.ocupacion?.setValue(this.miPortfolio.ocupacion);
      this.ciudad?.setValue(this.miPortfolio.ciudad);
      this.pais?.setValue(this.miPortfolio.pais);
      this.celular?.setValue(this.miPortfolio.celular);
      this.email?.setValue(this.miPortfolio.email);
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.formFotoModal = new window.bootstrap.Modal(
      document.getElementById('modalFoto')
    );
    this.formInfoContacto = new window.bootstrap.Modal(
      document.getElementById('infoContacto')
    );

  }

  openFotoFormModal(tipoFoto: string) {
      this.tipoFoto = tipoFoto;
      this.tituloFoto = tipoFoto ==='header' ? 'Imagen Header' : 'Imagen Perfil'
      this.formFoto.patchValue({imagen: null});
      this.formFotoModal.show();
  }

  public cambioArchivo(event: any) {
    if (event.target.files.length > 0) {
        this.nombreArchivo = event.target.files[0].name;
        this.file = event.target.files[0];
    }
  }

  handleSaveFoto(event: any, tipoFoto: string){
    event.preventDefault
    this.subirArchivo(this.saveFoto, tipoFoto);
  }

  subirArchivo(save: (url:string, tipoFoto: string) => void, tipoFoto: string) {
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
        save(downloadUrl, tipoFoto);
        this.file = undefined;
        this.isUploading = false;
        this.formFotoModal.hide();
      });
    }
  }

  saveFoto = (url: string, tipoFoto: string) => {
    let payload: any = {
      imagenHeader: url,
    };
    if (tipoFoto!=='header'){
      payload = {
        imagenPerfil: url,
      }
    }
      this.personaService.update(1,payload).subscribe({
        next: (v) => {
          this.showSuccess();
          this.ngOnInit();
        },
        error: (e) => {
          this.showError();
          this.ngOnInit();
        },
        complete: () => this.formModal.hide()
      });


  }

  logout(){
    this.autenticacionService.logout()
  }

  openFormModal() {
    this.formModal.show();
  }

  openformInfoContacto(){
    this.formInfoContacto.show();
  }

  save(event: Event) {
    this.miPortfolio.nombre =  this.form.get('nombre')?.value
    this.miPortfolio.apellido = this.apellido?.value
    this.miPortfolio.ocupacion = this.ocupacion?.value
    this.miPortfolio.ciudad = this.ciudad?.value
    this.miPortfolio.pais = this.pais?.value

    this.personaService.update(1,{
      nombre: this.miPortfolio.nombre,
      apellido: this.miPortfolio.apellido,
      ocupacion: this.miPortfolio.ocupacion,
      ciudad: this.miPortfolio.ciudad,
      pais: this.miPortfolio.pais,
     } ).subscribe(data=>{
          this.showSuccess();
    });

    // guardar cambios en base de datos -> pegarle al endpot de update nombre y apellido
    this.formModal.hide();
  }

  showSuccess() {
    this.toastr.success('Las modificacions se realizaron con exito');
  }

  showError() {
    this.toastr.error('Error al realizar las modificaciones, por favor pruebe nuevamente en unos minutos');
  }

  saveInfoContacto(event: Event){
    this.miPortfolio.celular = this.celular?.value
    this.miPortfolio.email = this.email?.value

    this.personaService.update(1,{
      celular: this.miPortfolio.celular,
      email: this.miPortfolio.email,
     } ).subscribe(data=>{
          this.showSuccess();
    });
    // guardar cambios en base de datos -> pegarle al endpot de update nombre y apellido
    this.formInfoContacto.hide();
  }

  goToLogin() {
    this.router.navigate(['/', 'iniciar-sesion']);
  }

  get apellido()
  {
    return this.form.get('apellido');
  }

  get nombre()
  {
    return this.form.get('nombre');
  }
  get ocupacion()
  {
    return this.form.get('ocupacion');
  }
  get ciudad()
  {
    return this.form.get('ciudad');
  }
  get pais()
  {
    return this.form.get('pais');
  }
  get celular()
  {
    return this.form.get('celular');
  }
  get email()
  {
    return this.form.get('email');
  }
}
