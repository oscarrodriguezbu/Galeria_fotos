const {
  Schema,
  model
} = require('mongoose');

const PhotosSchema = new Schema({
  title: String,
  description: String,
  imageURL: String,
  public_id: String //esto lo pone el cloudinary automaticamente y sirve si se desea eliminar esa foto

});
module.exports = model('Photos', PhotosSchema);