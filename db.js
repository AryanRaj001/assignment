const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: {
    mrp: Number,
    specialPrice: Number,
  },
  offer: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
