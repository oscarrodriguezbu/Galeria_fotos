//se encarga de configurar la aplicacion
const express = require('express');

const morgan = require('morgan');

const multer = require('multer');

const path = require('path');

const Handlebars = require('handlebars');

const exphbs = require('express-handlebars');

const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access'); //inicializar modulos:


const app = express();

require('./databse'); //settings


app.set('port', process.env.PORT || 3000); //usa el valor de env y si no existe entonces usa el puerto 3000
//const viewPath = path.join(__dirname, 'views');

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  // .hbs es la extension de los handlebars //aca se configura las rutas de los handlebars
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: '.hbs'
}));
/* Otra forma por si acaso:
    layoutsDir: viewPath + 'layouts',
    partialsDir: viewPath + 'partials',
*/

app.set('view engine', '.hbs'); //Asociar carpeta public del css

app.use(express.static(path.join(__dirname, 'public'))); //midlewares o funciones que se ejecutan antes de llegar a las rutas

app.use(morgan('dev')); //muestra peticiones al servidor

app.use(express.json());
app.use(express.urlencoded({
  extended: false
})); //con esto se interpreta cosas ligeras como tipo texto, las imagenes con multer

const storage = multer.diskStorage({
  //configurar como quiero recibir las imagenes con multer
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + path.extname(file.originalname)); //con esto, no se manda error y se le pone la fecha de creacion de la imagen como nombre junta la extension
  }
});
app.use(multer({
  storage
}).single('image')); // analiza los datos que se envian al servidor con el fin de detectar imagenes, si la detecta la pone dentro de nuestro servidor
//routes

app.use(require('./routes')); //por defecto buscar el index.js de routes

module.exports = app;