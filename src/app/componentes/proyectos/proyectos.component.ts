import { Component, OnInit } from '@angular/core';
import { PorfolioService } from 'src/app/servicios/porfolio.service';
import { faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private datosPorfolio:PorfolioService) { }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=>{
      this.proyectosList=data.proyectos;


    })
  }

}
