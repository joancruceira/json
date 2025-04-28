import {readfile} from 'fs/promises'

const file=await readFile('usuarios.json', 'utf-8');

const usuarios=JSON.parse(file);

console.log(usuarios);

const get_membresia=(membresia_activa)=>{
    return usuarios.filter(e=> e.membresia_activa===membresia_activa)
}

console.log(get_membresia("true"))

import dayjs from 'dayjs';


/* Constante para almacenar la fecha actual */
const fechaActual=new Date();

/* Obteniendo los datos por separado */
const año=fechaActual.getFullYear();
const mes=(fechaActual.getMonth()+1).toString().padStart(2,'0');
const dia=(fechaActual.getDate().toString().padStart(2, '0'));

/* Armando los modos amerciano y español */
const formatoBD = `${año}-${mes}-${dia}`;
const formatoEs=`${dia}-${mes}-${año}`;





/* En estas tres lineas de código se consigue hacer más sencillo lo de las fechas */
const fechaActualDJS=dayjs();

const formatoBBDD=fechaActualDJS.format('YYYY-MM-DD');
const formatoEESS=fechaActualDJS.format('DD-MM-YYYY');

console.log(formatoBD);
console.log(formatoEs);

/*  */
console.log("Ahora imprimimos las variables con el format: ");
console.log(formatoBBDD);
console.log(formatoEESS);


/* Leer JSON */
import { readFile} from 'fs/promises';


console.log(usuarios[0].nombre);

/* FUNCION JSON */

const get_membresias=(membresia_activa)=>{

    let filtro = usuarios.filter(e=> e.membresia_activa===membresia_activa);

    filtro=filtro.map(e=> e.nombre)

    return filtro;
    
}

console.log(get_membresia(true))
