import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  estaLogueado: boolean;

  constructor(private autenticacionServicio: AutenticacionService) { }

  ngOnInit(): void {

        this.estaLogueado = this.autenticacionServicio.estaLogueado;

  }

}
