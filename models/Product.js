const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = {
  Product,
  ProductSchema
};
