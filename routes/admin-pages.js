const express = require("express");
const router = express.Router();

// middleware express-validator
const { check, body, validationResult } = require("express-validator/check");
// Page
const { Page } = require("../models/Page");

// get: home page
router.get("/", async (req, res, next) => {
  try {
    // get all pages
    let pages = await Page.find();
    res.render("admin/pages", { pages });
  } catch (error) {
    console.log(error);
  }
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
      // validate form
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
// get: edit page
router.get("/edit-page/:slug", async (req, res, next) => {
  try {
    const slugRequest = req.params.slug;
    const page = await Page.findOne({ slug: slugRequest });
    if (!page) throw new Error("Page not found");
    const { _id, title, slug, content } = page;
    res.render("admin/editPage", { _id, title, slug, content });
  } catch (error) {
    req.flash("danger", error + "");
    res.redirect("/admin");
  }
});

// post: edit page
router.post(
  "/edit-page",
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
    let { _id, title, slug, content } = req.body;
    try {
      // validate form
      validationResult(req).throw();
      // set value slug
      slug = slug
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
      // check page
      const page = await Page.findOne({ _id: { $ne: _id }, slug });
      if (page) {
        req.flash("danger", "Slug exists");
        res.render("admin/editPage", {
          _id,
          title,
          slug,
          content
        });
      } else {
        const result = await Page.updateOne(
          { _id },
          {
            $set: {
              title,
              slug,
              content
            }
          }
        );
        req.flash("success", `Page "${title}" has been updated`);
        res.redirect("/admin");
      }
    } catch (errors) {
      res.render("admin/editPage", {
        errors: errors.array(),
        _id,
        title,
        slug,
        content
      });
    }
  }
);

// get: delete page
router.get("/delete-page/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const result = await Page.deleteOne({ _id });
    req.flash("success", `Page has been deleted`);
    res.redirect("/admin");
  } catch (error) {
    req.flash("danger", error + "");
    res.redirect("/admin");
  }
});

// export
module.exports = router;
