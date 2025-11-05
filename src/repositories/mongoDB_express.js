import connectToMongoDB from "./config/configMongoDB.config.js";
import { Channels } from "./models/Chanels.model.js";
import { ChannelMessages } from "./models/Channel.messages.model.js";
import MemberWorkspace from "./models/MemberWorkspace.model.js";
import User from "./models/User.model.js";
import Workspaces from "./models/Workspace.model.js";
import UserRepository from "./repository/user.repository.js";
import express, { request, response } from "express";


connectToMongoDB()

/* async function crearUsuario(name, email, password) {
    try {
        await User.insertOne({
            name: name,
            email: email,
            password: password
        })
        console.log('[SERVER]: usuario creado exitosamente')
    }
    catch (error) {
        console.log('[SERVER ERROR]: usuario no creado', error)
    }
} */
/* crearUsuario('roberto', `user${Date.now()}@gmail.com`, 'asddassda') */

async function crearWrokspace(name, url_image) {
    try {
        await Workspaces.insertOne({
            name: name,
            url_image: url_image
        })
        console.log('[SERVER]: workspace creado exitosamente')
    }
    catch (error) {
        console.log('[SERVER ERROR]: no se pudo crear el workspace')
    }
}

/* crearWrokspace("juan","https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png")  */

async function crearMemberWorkspace(id_user, id_workspace, role) {

    try {
        await MemberWorkspace.insertOne({
            id_user: id_user,
            id_workspace: id_workspace,
            role: role
        })
        console.log('[SERVER]: memberworkspace creado exitosamente')
    }
    catch (error) {
        console.log('[SERVER ERROR]: no se pudo crear el memberworkspace')
    }
}

/* crearMemberWorkspace('68de8641db1b246aa426b3d5','68de8641db1b246aa426b3d6', 'user')  */

async function crearChannels(id_workspace, name) {
    try {
        await Channels.insertOne({
            id_workspace: id_workspace,
            name: name
        })
        console.log('[SERVER]: canal creado exitosamente')
    }
    catch (err) {
        console.log('[SERVER ERROR]: no se pudo crear el canal')
    }
}

/* crearChannels('68de8641db1b246aa426b3d6', 'chat privado con pepito') */

async function crearChannelMessages(id_channel, id_sender, content) {
    try {
        await ChannelMessages.insertOne({
            id_channel: id_channel,
            id_sender: id_sender,
            content: content
        })
        console.log('[SERVER]: mensaje enviado')
    }
    catch (error) {
        console.log('[SERVER ERROR]: el mensaje no fue enviado')
    }

}

/* crearChannelMessages('68de8f74e348248ba59fbe79', '68de8641db1b246aa426b3d5','asdasdasddasasddassdagdfgdf') */
/* UserRepository.create('maria', `user${Date.now()}@gmail.com`, 'askdhjfdif')  */
/* UserRepository.getAll() */

/* UserRepository.getById('68de8641db1b246aa426b3d5') */
/*  UserRepository.getByEmail('user1759418704313@gmail.com') */
/* UserRepository.deleteById('68dea2f0e0f62791fd6b03f2') */

/* UserRepository.updateById('68dea8cc3fc34b7aad4a29de', {
    name: 'maria lauras',
})
 */


//nos crea una app de express(servidor web)
const app = express()
//por defecti, nuestra app no esta preparada para recibir JSON en el body

app.use(express.json())
//con esta funcion (middleware: aplicacion que se ejecuta en el medio de 2 procesos) configuramos un middleware que permite que el json que envien en el body de la consulta se transforme en un objeto JS

const PORT = 8080

app.get(
    '/test',
    (request, response) => {
        console.send('<h1>hola mundo</h1>')
    }
)
//a mi server le van a mandar un objeto con numero1 y numero 2
//responder con el resultado de la suma
app.post(
    '/sumar',
    //request es el objeto con la informacion de consulta
    //response es el objeto para dar respuestas
    (request, response) => {
        const raw_1 = request.body.numero_1;
        const raw_2 = request.body.numero_2;

        if (
            //el typeof devuelve un string del tipo de dato
            typeof raw_1 === 'boolean' || typeof raw_2 === 'boolean' ||
            raw_1 === null || raw_2 === null ||
            raw_1 === undefined || raw_2 === undefined
        ) {
            return response.status(400).send('TYPE ERROR: Inputs must be numeric values');
        }
        const numero_1 = Number(raw_1);
        const numero_2 = Number(raw_2);
        if (isNaN(numero_1)) {
            return response.send('TYPE ERROR REQUEST: the request of numero_1 isNAN')
        }
        else if (isNaN(numero_2)) {
            return response.send('TYPE ERROR REQUEST: the request of numero_2 isNAN')
        }
        const sumas = numero_1 + numero_2;
        response.send(sumas)
        //si se quieren comunicar con mi servidor normalmente se transferiran los datos mediante request.body


    }

)

const products = []
app.post(
    '/products',
    (request, response) => {
        const title = request.body.title;
        const price = Number(request.body.price);
        const stock = Number(request.body.stock);
        const new_product = {};
        if (typeof title === 'string' && title.length >= 4) {
            new_product.title = title;
        } else return response.status(400).send('Error: title must be a string with at least 4 characters');
        if (price > 0) {
            new_product.price = price;
        } else return response.status(400).send('Error: The price must be a number greater than 0');
        if (Number.isInteger(stock) && stock > 0) {
            new_product.stock = stock
        } else return response.status(400).send('Error: The stock must be a number greater than 1');
        products.push(new_product);
        console.log(products)
        return response.status(201).send(new_product);
    }
)



//listen lo usamos para dedicar un puerto a nuestro servidor
//Recibe 2 parametros
//1. nro puerto
//2. Callback que se ejecutara si todo sale bien
app.listen(PORT, () => { console.log(`ON in ${PORT}`) })


console.log(products)