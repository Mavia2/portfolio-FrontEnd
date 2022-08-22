export class Proyecto {
  id? : number;
  titulo: string;
  descripcion: string;
  fechaRealizacion: string ;
  proyectoUrl: string;
  idPersona: number;

  constructor(titulo : string,  descripcion : string, fechaRealizacion : string, proyectoUrl : string,  idPersona : number ){
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaRealizacion = fechaRealizacion;
    this.proyectoUrl = proyectoUrl;
    this.idPersona = idPersona;
  }
}
