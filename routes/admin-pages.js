const express = require("express");
const router = express.Router();

// middleware express-validator
const { check, body, validationResult } = require("express-validator/check");
// Page
const { Page } = require("../models/Page");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("admin/pages", { title: "Admin page" });
});

// get: add page
router.get("/add-page", (req, res, next) => {
  res.render("admin/addPage", { title: "", slug: "", content: "" });
});

// post: add page
router.post(
  "/add-page",
  [
    body("title")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Title must not be empty"),
    body("content")
      .not()
      .isEmpty()
      .withMessage("Content must not be empty")
  ],
  async (req, res, next) => {
    let { title, slug, content } = req.body;
    try {
      validationResult(req).throw();
      // set value slug
      slug = slug
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
      // check in database if slug of page exists
      const page = await Page.findOne({ slug });
      if (page) {
        req.flash("danger", "Slug exists");
        res.render("admin/addPage", {
          title,
          slug,
          content
        });
      } else {
        const newPage = new Page({ title, slug, content });
        const result = await newPage.save();
        req.flash("success", "A new page has been created");
        res.redirect("/admin");
      }
    } catch (errors) {
      res.render("admin/addPage", {
        errors: errors.array(),
        title,
        slug,
        content
      });
    }
  }
);
// export
module.exports = router;
