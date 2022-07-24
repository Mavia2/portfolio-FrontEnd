import { Component, OnInit } from '@angular/core';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { PorfolioService } from 'src/app/servicios/porfolio.service';

@Component({
  selector: 'app-experiencia-y-educacion',
  templateUrl: './experiencia-y-educacion.component.html',
  styleUrls: ['./experiencia-y-educacion.component.css']
})
export class ExperienciaYEducacionComponent implements OnInit {
  educacionList: any;
  experienciaList:any;

  constructor(private datosPorfolio:PorfolioService ) { }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=>{
      this.educacionList=data.educacion;
      this.experienciaList=data.experiencia;

    })

  }

}
