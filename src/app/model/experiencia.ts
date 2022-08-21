export class Experiencia {
  id? : number;
  fotoUrl : string;
  institucion : string;
  cargo : string;
  descripcion : string;
  fechaInicio : string;
  fechaFin : string;
  lugar : string;
  idPersona : number;

constructor(fotoUrl : string,  institucion : string, cargo : string, descripcion : string, fechaInicio : string, fechaFin : string,  lugar : string, idPersona : number     ){
this.fotoUrl = fotoUrl;
this.institucion = institucion;
this.cargo = cargo;
this.descripcion = descripcion;
this.fechaInicio = fechaInicio;
this.fechaFin = fechaFin;
this.lugar = lugar;
this.idPersona = idPersona;
}


}
