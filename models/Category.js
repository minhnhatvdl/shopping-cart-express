const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = {
  Category,
  CategorySchema
};
