import { Component, Input, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PersonaService } from 'src/app/servicios/persona.service';
declare var window: any;

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent implements OnInit {
  acercaDe:any;
  editIcon = faPen;
  formModal: any;
  form:FormGroup;

  @Input() estaLogueado: Observable<boolean>;


  constructor(private toastr: ToastrService, private personaService: PersonaService, private datosPorfolio:PorfolioService, private formBuilder:FormBuilder) {
    this.form=this.formBuilder.group(
      {
        acercaDe:['',[Validators.required]],

      }
      )
   }

  ngOnInit(): void {
    this.datosPorfolio.detail(1).subscribe(data => {
      this.acercaDe=data.acercaDe;
      this.acercaDeForm?.setValue(this.acercaDe);
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModalAcercaDe')
    );
  }

  showSuccess() {
    this.toastr.success('Las modificacions se realizaron con exito');
  }

  openFormModal() {
    this.formModal.show();
  }

  save(event: Event) {
      this.acercaDe = this.acercaDeForm?.value
      this.personaService.update(1,{
        acercaDe: this.acercaDe
       } ).subscribe(data=>{
            this.showSuccess();
      });
      this.formModal.hide();
  }

  get acercaDeForm(){
    return this.form.get('acercaDe');
  }
}
