import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"
//async hace que sea asinctronico (retorna una Promise)
export default async function connectToMongoDB(){
try{
        //EL NOMBRE DEL proyecto
    const DB_NAME = 'SLACK_TRY'
    //ip de la base de datos
    const connection_string = ENVIRONMENT.MONGO_DB_CONNECTION_STRING
    await mongoose.connect(connection_string)
    console.log('conexion exitosa')
}
catch(error){
    console.log('[SERVER ERROR]: Fallo en la conexion', error)
}
}

//las asincronias siempre devuelven una promise, basicamente las asincronias lo que hacen es mini procesos que se ejecutan en simultaneo y cuando se resuelven devuelven
//la promesa. Las promesas por default son de estado pending, pero devuelven resolve o reject en base a la respuesta con la BD
//si marcamos a una funcion con async dicha funcion retornara una promesa, y si marcamos cierto codigo con await, mi bloque de codigo aguardara a que se resuelva dicha promesa

