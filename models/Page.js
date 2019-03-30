const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String },
  content: { type: String, required: true }
});

const Page = mongoose.model("Page", PageSchema);

module.exports = {
  Page,
  PageSchema
};
