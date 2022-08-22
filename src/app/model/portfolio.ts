import { Educacion } from "./Educacion";
import { Experiencia } from "./experiencia";
import { Persona } from "./persona";
import { Proyecto } from "./proyecto";
import { Skill } from "./skill";

export class Portfolio {
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
  educaciones: [Educacion];
  experiencias : [Experiencia];
  proyectos : [Proyecto];
  skills : [Skill];

  constructor(email:string, celular: string, acercaDe: string, pais: string, ciudad: string, ocupacion: string, imagenHeader: string, imagenPerfil: string, apellido: string, nombre: string, educaciones: [Educacion], proyectos: [Proyecto], skills: [Skill], experiencias: [Experiencia] ){
    this.email = email;
    this.celular = celular;
    this.acercaDe = acercaDe;
    this.pais = pais;
    this.ciudad = ciudad;
    this.nombre = nombre;
    this.imagenPerfil = imagenPerfil;
    this.imagenHeader = imagenHeader;
    this.ocupacion = ocupacion;
    this.apellido = apellido;
    this.educaciones = educaciones;
    this.experiencias = experiencias;
    this.proyectos = proyectos;
    this.skills = skills;
  }

}

