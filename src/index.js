//encargado de arrancar la app

if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config();
}
//require('dotenv').config(); //lee el archivo .env y lo hace accesible

const app = require('./app');


app.listen(app.get('port'), () => {
    console.log(`Server on port: ${app.get('port')} `);
    console.log(`Enviromentt: ${process.env.NODE_ENV} `);
}) 

