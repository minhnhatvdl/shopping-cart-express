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

// // get: add category
// router.get("/add-category", (req, res, next) => {
//   res.render("admin/addCategory", { title: "", slug: "" });
// });

// // post: add category
// router.post(
//   "/add-category",
//   [
//     body("title")
//       .not()
//       .isEmpty()
//       .trim()
//       .withMessage("Title must not be empty")
//   ],
//   async (req, res, next) => {
//     let { title, slug } = req.body;
//     try {
//       // validate form
//       validationResult(req).throw();
//       // set value slug
//       slug = slug
//         .trim()
//         .replace(/\s+/g, "-")
//         .toLowerCase();
//       if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
//       // check in database if slug of category exists
//       const category = await Category.findOne({ slug });
//       if (category) {
//         req.flash("danger", "Slug exists");
//         res.render("admin/addCategory", {
//           title,
//           slug
//         });
//       } else {
//         const newCategory = new Category({ title, slug });
//         const result = await newCategory.save();
//         req.flash("success", "A new category has been created");
//         res.redirect("/admin-categories");
//       }
//     } catch (errors) {
//       res.render("admin/addCategory", {
//         errors: errors.array(),
//         title,
//         slug
//       });
//     }
//   }
// );

// // get: edit category
// router.get("/edit-category/:id", async (req, res, next) => {
//   try {
//     const idRequest = req.params.id;
//     const category = await Category.findOne({ _id: idRequest });
//     if (!category) throw new Error("Category not found");
//     const { _id, title, slug } = category;
//     res.render("admin/editCategory", { _id, title, slug });
//   } catch (error) {
//     req.flash("danger", error + "");
//     res.redirect("/admin-categories");
//   }
// });

// // post: edit category
// router.post(
//   "/edit-category",
//   [
//     body("title")
//       .not()
//       .isEmpty()
//       .trim()
//       .withMessage("Title must not be empty")
//   ],
//   async (req, res, next) => {
//     let { _id, title, slug } = req.body;
//     try {
//       // validate form
//       validationResult(req).throw();
//       // set value slug
//       slug = slug
//         .trim()
//         .replace(/\s+/g, "-")
//         .toLowerCase();
//       if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
//       // check category
//       const category = await Category.findOne({ _id: { $ne: _id }, slug });
//       if (category) {
//         req.flash("danger", "Slug exists");
//         res.render("admin/editCategory", {
//           _id,
//           title,
//           slug
//         });
//       } else {
//         const result = await Category.updateOne(
//           { _id },
//           {
//             $set: {
//               title,
//               slug
//             }
//           }
//         );
//         req.flash("success", `Category "${title}" has been updated`);
//         res.redirect("/admin-categories");
//       }
//     } catch (errors) {
//       res.render("admin/editPage", {
//         errors: errors.array(),
//         _id,
//         title,
//         slug
//       });
//     }
//   }
// );

// // get: delete category
// router.get("/delete-category/:id", async (req, res, next) => {
//   try {
//     const _id = req.params.id;
//     const result = await Category.deleteOne({ _id });
//     req.flash("success", `Category has been deleted`);
//     res.redirect("/admin-categories");
//   } catch (error) {
//     req.flash("danger", error + "");
//     res.redirect("/admin-categories");
//   }
// });

// export
module.exports = router;
