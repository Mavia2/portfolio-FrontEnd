export class Skill {
  id? : number;
  nombre: string;
  porcentaje: number;
  idPersona: number;

  constructor(nombre : string, porcentaje: number, idPersona : number     ){
    this.nombre = nombre;
    this.porcentaje = porcentaje;
    this.idPersona = idPersona;
  }
}
