const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//const fs = require('fs'); //nativo de node, me permite manipular los archivos en el pc pero no sopoorta promesas
const fs = require('fs-extra'); //toca instalarlo
router.get('/', async (req, res) => {
    const photos= await Photo.find().lean(); //trae todas las fotos de mongodb
    //console.log(photos);
    res.render('images', {
        photos
    });
});


router.get('/images/add', async(req, res) => {
    const photos= await Photo.find().lean();//partials/image_form soluciona un error al intentar seguir el video de esto codigo
    res.render('image_form',{
        photos
    }); 
});


router.post('/images/add', async(req, res) => {
    //console.log(req.body); //muestra el texto que se manda desde la vista
    //console.log(req.file); //muestra el objeto del contenido de la imagen subida en la vista

    const {title, description} = req.body;
    const result= await cloudinary.uploader.upload(req.file.path);  //esto es para decir que se va a subir img a cloudinary. v2 es la version de la biblioteca de cloudinary
    //console.log(result);

    const newPhoto = new Photo({
        title,
        description,
        imageURL: result.secure_url,
        public_id: result.public_id
    });

    newPhoto.save();

    await fs.unlink(req.file.path); //elimina las imagenes en la carpta publica despues de guardarla en la bd
    //cuando hubo un error en la carga la imagen no se eliminó, será conveniente un try catch que capture el error y elimine en ambos casos?

    res.redirect('/');
});


//eliminar imagen
//no se usa el metodo delete porque hay que hacer algunos cambios en la vista entonces se hace de forma sencilla asi:
router.get('/images/delete/:photo_id', async( req, res) => {
    const {photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id); //se elimina de la bd
    const result = await cloudinary.uploader.destroy(photo.public_id); //se elimina la foto de cloudinary
    console.log(result);
    res.redirect('/images/add');
})

module.exports = router;