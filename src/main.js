import { sumar } from "./math.js"
try {
    // try intenta ejecutar el bloque de codigo
    console.log(sumar(567, 23))
}
catch (error) {
    //en caso de que el bloque falle
    //catch atrapa el error y ejecuta su bloque de codigo
    console.log('fallo la operacion')
    console.log('Razon:', error)
}
finally {
    //finally ejecuta el bloque de codigo independientemente de lo que pase en try catch 
    console.log('el panadero con el pan')
}
console.log('con el try catch aisla el error y sigue funcionando la app')

//se puede hacer con callbacks

const manejarError = (x) => {

    try {
        x()
    }
    catch (error) {
        if (error.status) {
            console.error('CLIENT ERROR: ' + error.message, 'STATUS: ' + error.status)
        }
        else{
            console.error('SERVER ERROR: '+ error.message)
        }
    }
}

manejarError(() => { sumar(2) })
manejarError(()=>{asddasdas})


