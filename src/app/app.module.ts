import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './componentes/encabezado/encabezado.component';
import { AcercaDeComponent } from './componentes/acerca-de/acerca-de.component';
import { ExperienciaYEducacionComponent } from './componentes/experiencia-y-educacion/experiencia-y-educacion.component';
import { SkillsComponent } from './componentes/skills/skills.component';
import { ProyectosComponent } from './componentes/proyectos/proyectos.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { PortfolioComponent } from './componentes/portfolio/portfolio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterceptorService } from './servicios/interceptor.service';
import { PorfolioService } from './servicios/porfolio.service';






@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    AcercaDeComponent,
    ExperienciaYEducacionComponent,
    SkillsComponent,
    ProyectosComponent,
    IniciarSesionComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule

  ],

  providers: [PorfolioService,
    {provide:HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true}
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
