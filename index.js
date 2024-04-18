import express from "express"; // hacer npm i express
import cors from "cors"; // hacer npm i cors

import  {sumar, multiplicar, restar, dividir } from './src/modules/matematica.js';
import  Alumno from './src/models/alumno.js'
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from './src/modules/omdb-wrapper.js'; 

const app = express();
const port = 3000;
// Agrego los Middlewares
app.use(cors()); // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON

// Aca pongo todos los EndPoints

//01
app.get('/', (req, res) => {
res.status(200).send('Ya estoy respondiendo!');

})

//02
app.get('/saludar:nombre', (req, res) => { 
    
res.status(200).send('Hola  ' +  req.params.nombre);
})
//03
app.get('/validarfecha/:ano/:mes/:dia', (req, res) => { 
    const { ano, mes, dia } = req.params; 
    //const ano = req.params.ano;

    const DateParse= Date.parse(`${ano}-${mes}-${dia}`);
    if (isNaN(DateParse) != false) {
        res.status(400).send('Fecha no válida');
    } else {
        res.status(200).send('Fecha válida');
    }
});

//04
// no se ponen los parametros de los numeros 
//'/matematica/sumar?n1={numero}&n2={numero}' --> solo la funcion
app.get('/matematica/sumar ', (req, res) =>
{
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    const resultado = sumar(n1,n2); 
    res.status(200).send('El resultado es:' , resultado);
})  

//05
app.get('/matematica/restar', (req, res) =>
{
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    const resultado = restar(n1,n2); 
    res.status(200).send('El resultado es:' , resultado);
})  

//06
app.get('/matematica/multiplicar ', (req, res) =>
{
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    const resultado = multiplicar(n1,n2); 
    res.status(200).send('El resultado es:' , resultado);
}) 
//07
app.get('/matematica/dividir', (req, res) =>
{
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    if(n2==0)
    {
        res.status(400).send('Bad request');
    }
    else{
    const resultado = dividir(n1,n2); 
    res.status(200).send('El resultado es:' , resultado);
    }
})
//08 preguntar

app.get('/omdb/searchbypage', async (req, res) => {
    const searchText = req.query.search;
    const page = req.query.p ? parseInt(req.query.p) : 1;

    try {
        const resultado = await OMDBSearchByPage(searchText, page);
        if (resultado.respuesta) {
            res.status(200).send(resultado);
        } else {
            res.status(404).send({ mensaje: 'No se encontraron resultados' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//09n preguntar
 
app.get('/omdb/searchComplete',  async (req, res) => 
{
    const searchText = req.query.search;
    try {
        const resultado = await OMDBSearchByPage(searchText);
        if (resultado.respuesta) {
            res.status(200).send(resultado);
        } else {
            res.status(404).send({ mensaje: 'No se encontraron resultados' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
    })

//10

app.get('/omdb/searchbyomdbid',  async (req, res) => 
{
    const searchText = req.query.id; 
    try{
        const resultado = await OMDBSearchByPage(id); 
        if (resultado.respuesta) {
            res.status(200).send(resultado);
        } else {
            res.status(404).send({ mensaje: 'No se encontraron resultados' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
    })

//11
const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido" , "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));

app.get ('/alumnos' , async (req, res) =>  
{
    try{
        res.status(200).send(alumnosArray);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
 
})
// Alumnos es un objeto y tiene atributis por ejemplo: dni
//12
app.get ('/alumnos/:dni' , async (req, res) =>  
{
    try{
        let dni = alumnosArray.find(({dni}) => dni === req.params.dni);  
        res.status(200).send(alumnosArray);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
 
})
 
//13
app.post ('/alumnos' , async (req, res) =>  
{
    try{
        alumnosArray.push(new Alumno (req.params.nombre, req.params.dni , req.params.edad))
        res.status(201).send('Created');
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
 
})

//14
app.delete ('/alumnos:dni' , async (req, res) =>  
{
    try{
        const dni= req.params.dni;
        const posicion= alumnosArray.findIndex( alumno => alumno.getDni() ===dni);
        
        if (posicion== -1)
        {
            res.status(404).send({ mensaje: 'Alumno no encontrado' });
            return; 

        }
        alumnosArray.splice (posicion, 1); 
        res.status(202).send ("Deleted"); 
       
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
 
})


 
// Inicio el Server y lo pongo a escuchar.

//03
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})