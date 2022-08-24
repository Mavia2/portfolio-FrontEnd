import { Educacion } from "./educacion";
import { Experiencia } from "./experiencia";
import { Proyecto } from "./proyecto";
import { Skill } from "./skill";

export class Persona {
  id? : number;
  nombre: string;
  apellido: string;
  imagenPerfil: string;
  imagenHeader : string;
  ocupacion : string;
  ciudad : string;
  pais : string;
  acercaDe : string;
  celular: string;
  email : string;
  idPersona: number;
  user: any;

  constructor(nombre : string,  apellido : string, imagenPerfil : string, imagenHeader : string, ocupacion : string, ciudad : string,  pais : string, acercaDe : string, idPersona: number ){
    this.nombre = nombre;
    this.apellido = apellido;
    this.imagenPerfil = imagenPerfil;
    this.imagenHeader = imagenHeader;
    this.ocupacion = ocupacion;
    this.ciudad = ciudad;
    this.pais = pais;
    this.acercaDe = acercaDe;
    this.idPersona = idPersona;
  }

}

