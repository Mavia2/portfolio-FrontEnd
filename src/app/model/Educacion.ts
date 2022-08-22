export class Educacion {
  id? : number;
  fotoUrl: string;
  institucion: string;
  titulo: string ;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  idPersona: number;

  constructor(fotoUrl : string,  institucion : string, fechaInicio : string, fechaFin : string,  lugar : string, idPersona : number     ){
    this.fotoUrl = fotoUrl;
    this.institucion = institucion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.lugar = lugar;
    this.idPersona = idPersona;
  }
}
