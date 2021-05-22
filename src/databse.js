//para tener la coneccion a la bd en un solo lugar

const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));