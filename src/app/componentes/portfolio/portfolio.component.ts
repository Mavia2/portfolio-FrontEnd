import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  estaLogueado: Observable<boolean>;

  constructor(private autenticacionServicio: AutenticacionService) {
    this.estaLogueado = autenticacionServicio.estaLogueado;
  }

  ngOnInit(): void {

        //this.estaLogueado = this.autenticacionServicio.estaLogueado;
        //this.estaLogueado = true;

  }

}
