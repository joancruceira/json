import express from 'express';
import dotenv from 'dotenv'; 

import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

const usuarios = JSON.parse(readFileSync('./usuarios.json', 'utf-8'));
const suscripciones=JSON.parse(readFileSync('./suscripciones.json', 'utf-8'));
const clases = JSON.parse(readFileSync('./clases.json', 'utf-8'));

console.log(usuarios);
//Traer nuestras variables de entorno
dotenv.config();

//Crear instancia de app
const app = express();

//Consigurar puerto
const port = process.env.PORT || 3000;

//Funcion JSON
app.use(express.json());

//levantar el servidor
app.listen(port, ()=>{console.log(`Servidor levantado en puerto ${port}`)});

//Definición de rutas
app.get('/', (req, res)=> {

    res.send('Hola mundo!');

});

//Petición GET para listar todos los datos de los usuarios
app.get('/usuarios/:nombre', (req, res)=> {

    const nom = req.params.nombre.toLowerCase();
    const resultado = usuarios.find(e => e.nombre.toLowerCase() === nom);
    if(resultado){
        res.status(200).json(resultado);

    }
    else{
        res.status(400).json({ error: 'Usuario no encontrado' });
    }
    

});
//Petición GET para filtrar por membresia activa/inactiva
app.get('/suscripcionesactivas/:estado', (req, res)=>{


    const est=req.params.estado;
    const boolEstado = est === "true";
    

    const filtrarPorEstado=(EstadoBooleando)=>{return usuarios.filter(e=> e.membresia_activa===EstadoBooleando)};
    const resultado = filtrarPorEstado(boolEstado);

    if(resultado.length!=0){

        
        res.status(200).json(resultado);

    }

    else{
        
        res.status(400).json({ error: 'No existen suscripciones' });
        }

})



//Método post para iniciar sesión 
/*

Usar el siguiente ejemplo json que sería lo que envía el front:

{
    "user": "Lucia",
    "pass": "hashed123"

}

*/
app.post('/login', (req, res)=> {

    const { user, pass } = req.body;
    const resultado = usuarios.find(e => e.nombre.toLowerCase() === user.toLowerCase() && e.contraseña===pass);

    const boolResult=resultado!==undefined;
    
    if(boolResult){
        res.status(200).json({ mensaje: "Sesión iniciada" });
    }
    else{
        res.status(400).json("Usuario o contraseña incorrecta"); 
    }

})

//Método post para registrar usuario
/*

Usar el siguiente ejemplo json que sería lo que envía el front:

{
    "nombre": "Luciano",
    "apellido": "Ejemplo",
    "email": "LucianoEjemplo@gmail.com",
    "contraseña": "hashed123B"

}

*/

app.post('/signup', (req, res)=> {

    const { nombre, apellido, email, contraseña } = req.body;
    
    const nuevoUsuario = {
        id:usuarios.length+1,
        nombre,
        apellido,
        email,
        contraseña,
        membresia_activa:true
    };

    usuarios.push(nuevoUsuario);
    writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));
    res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: nuevoUsuario });
});

//Método put para cambiar contraseña
/*

Usar el siguiente ejemplo json que sería lo que envía el front:

{
    "email": "FrancoEjemplo@gmail.com",
    "contraseña": "hashed123C"

}

*/

app.put('/cambiarClave', (req,res)=>{

const {email, nuevaContraseña}=req.body;

const usuario=usuarios.find(u=> u.email===email);

if(usuario){
    usuario.contraseña=nuevaContraseña;
    writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));
    res.status(200).json({ mensaje: "Contraseña actualizada con éxito" });
}
else{
    res.status(400).json({mensaje: "No se pudo actualizar la contraseña"})
}


});


//Método put para cambiar estado de la suscripcion
/*

Usar el siguiente ejemplo json que sería lo que envía el front:

{
    "idUsuario": 1

}

*/

app.put("/estadoMembresia", (req, res) => {
  const {idUsuario} = req.body;
  const usuario = usuarios.find((e) => e.id === idUsuario);


  if (!usuario) {
    return res.status(400).json({ mensaje: "No se encontró el id de usuario" });
  }

  usuario.membresia_activa = !usuario.membresia_activa;
  const membresia = suscripciones.find((id) => id.id_usuario === idUsuario);

  if (membresia) {
    membresia.activo = usuario.membresia_activa;
  }
  
  try {

    writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));

    writeFileSync('./suscripciones.json', JSON.stringify(suscripciones, null, 2));

    res.status(200).json({ 
        mensaje: "Has cambiado correctamente el estado de la membresía",
        nuevaMembresia: usuario.membresia_activa ? "Activa" : "Inactiva"})

  } catch (error) {

    console.error('Error guardando los cambios:', error);
    console.error('Error guardando los cambios:', error);

    res.status(500).json({ mensaje: "Error al guardar los cambios" });
  }
  
});


//Método para borrar un usuario registrado, comprobando si tiene membresia
app.delete('/eliminarUsuario', (req, res)=>{

const {idUsuario}=req.body;

const usuario=usuarios.find(u=> u.id===idUsuario);
const suscripcion = suscripciones.find(s=> s.id_usuario===idUsuario);

if(!usuario){
    res.status(400).json({mensaje: "error, imposible eliminar el registro solicitado"});

};

usuario.nombre="";
usuario.apellido="";
usuario.email="";
usuario.contraseña="";
usuario.membresia_activa=false;


if (suscripcion) {
    suscripcion.tipo = "";
    suscripcion.fecha_inicio = "";
    suscripcion.fecha_fin = "";
    suscripcion.activo = false;
}

try {
    writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));
    writeFileSync('./suscripciones.json', JSON.stringify(suscripciones, null, 2));
    res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
} catch (error) {
    console.error('Error al guardar cambios:', error);
    res.status(500).json({ mensaje: "Error al guardar cambios" });
}


})