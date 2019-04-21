const express = require("express");
const router = express.Router();

// middleware express-validator
const { check, body, validationResult } = require("express-validator/check");
// fs-extra
const fs = require("fs-extra");
// mkdirp
const mkdirp = require("mkdirp");
// Product
const { Product } = require("../models/Product");
// Category
const { Category } = require("../models/Category");

// get: product page
router.get("/", async (req, res, next) => {
  try {
    // get all products
    const products = await Product.find();
    res.render("admin/products", { products });
  } catch (error) {
    console.log(error);
  }
});

// get: add product
router.get("/add-product", async (req, res, next) => {
  try {
    // get all categories
    const categories = await Category.find();
    res.render("admin/addProduct", {
      title: "",
      slug: "",
      description: "",
      category: -1,
      categories,
      price: ""
    });
  } catch (error) {
    console.log(error);
  }
});

// post: add product
router.post(
  "/add-product",
  [
    body("title")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Title must not be empty"),
    body("description")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Description must not be empty"),
    body("category")
      .not()
      .equals("-1")
      .withMessage("Category must be selected"),
    body("price")
      .isNumeric()
      .withMessage("Price must be numeric")
  ],
  async (req, res, next) => {
    let { title, slug, description, category, price } = req.body;
    // get name of image
    const imageName = req.files? req.files.image.name: "";
    // check type of image
    let errorImage = {error: 0};
    if(req.files) {
      const imageType = req.files.image.mimetype;
      if(['image/gif', 'image/jpeg', 'image/png'].indexOf(imageType) === -1) {
        errorImage = {error: 1, param: 'image', msg: 'Type of image is not correct'};
      }
    }
    // get all categories
    const categories = await Category.find();
    try {
      // validate form
      validationResult(req).throw();
      // set value slug
      slug = slug
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
      // check in database if slug of product exists
      const product = await Product.findOne({ slug });
      if (product) {
        req.flash("danger", "Slug exists");
        res.render("admin/addProduct", {
          title,
          slug,
          description,
          category,
          categories,
          price
        });
      } else {
        const newProduct = new Product({ title, slug, description, category, price, image: imageName });
        if(imageName) {
          // create a link of image
          // link of image: public/images/productId/imageName
          await mkdirp(`public/images/${newProduct._id}`);
          // move image to the created folder
          const image = req.files.image;
          await image.mv(`public/images/${newProduct._id}/${imageName}`);
        }
        // save a product
        const result = await newProduct.save();
        req.flash("success", "A new product has been created");
        res.redirect("/admin-products");
      }
    } catch (errors) {
      // set list of errors
      let listError = errors.array();
      if(errorImage.error === 1) listError = [...listError, errorImage];
      res.render("admin/addProduct", {
        errors: listError,
        title,
        slug,
        description,
        category,
        categories,
        price
      });
    }
  }
);

// get: edit product
router.get("/edit-product/:id", async (req, res, next) => {
  try {
    const idRequest = req.params.id;
    const product = await Product.findOne({ _id: idRequest });
    if (!product) throw new Error("Product not found");
    // get all categories
    const categories = await Category.find();
    const { _id, title, slug, description, category, price, image } = product;
    res.render("admin/editProduct", { _id, title, slug, description, category, categories, price, image });
  } catch (error) {
    req.flash("danger", error + "");
    res.redirect("/admin-products");
  }
});

// post: edit product
router.post(
  "/edit-product",
  [
    body("title")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Title must not be empty"),
  body("description")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Description must not be empty"),
  body("category")
    .not()
    .equals("-1")
    .withMessage("Category must be selected"),
  body("price")
    .isNumeric()
    .withMessage("Price must be numeric")
  ],
  async (req, res, next) => {
    let { _id, title, slug, description, category, price, currentImageName } = req.body;
    // get name of image
    const imageName = req.files? req.files.image.name: currentImageName;
    // check type of image
    let errorImage = {error: 0};
    if(req.files) {
      const imageType = req.files.image.mimetype;
      if(['image/gif', 'image/jpeg', 'image/png'].indexOf(imageType) === -1) {
        errorImage = {error: 1, param: 'image', msg: 'Type of image is not correct'};
      }
    }
    // get all categories
    const categories = await Category.find();
    try {
      // validate form
      validationResult(req).throw();
      // set value slug
      slug = slug
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
      // check product
      const product = await Product.findOne({ _id: { $ne: _id }, slug });
      if (product) {
        req.flash("danger", "Slug exists");
        res.render("admin/editProduct", {
          _id,
          title,
          slug,
          description,
          category,
          categories,
          price,
          image: imageName
        });
      } else {
        // change a link of image when uploading a new image
        if(req.files) {
          // delete exist image
          await fs.remove(`public/images/${_id}`);
          // create a link of image
          // link of image: public/images/productId/imageName
          await mkdirp(`public/images/${_id}`);
          // move image to the created folder
          const image = req.files.image;
          await image.mv(`public/images/${_id}/${imageName}`);
        }
        const result = await Product.updateOne(
          { _id },
          {
            $set: {
              title,
              slug,
              description,
              category,
              price,
              image: imageName
            }
          }
        );
        req.flash("success", `Product "${title}" has been updated`);
        res.redirect("/admin-products");
      }
    } catch (errors) {
      // set list of errors
      let listError = errors.array();
      if(errorImage.error === 1) listError = [...listError, errorImage];
      res.render("admin/addProduct", {
        errors: listError,
        title,
        slug,
        description,
        category,
        categories,
        price
      });
    }
  }
);

// get: delete product
router.get("/delete-product/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    // delete image
    await fs.remove(`public/images/${_id}`);
    // delete a product
    const result = await Product.deleteOne({ _id });
    req.flash("success", `Product has been deleted`);
    res.redirect("/admin-products");
  } catch (error) {
    req.flash("danger", error + "");
    res.redirect("/admin-products");
  }
});

// export
module.exports = router;
