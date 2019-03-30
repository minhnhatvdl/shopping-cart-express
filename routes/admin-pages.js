const express = require("express");
const router = express.Router();

// middleware express-validator
const { check, body, validationResult } = require("express-validator/check");

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
  (req, res, next) => {
    let { title, slug, content } = req.body;
    try {
      validationResult(req).throw();
      // set value slug
      slug = slug
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      if (!slug) slug = title.replace(/\s+/g, "-").toLowerCase();
      res.render("admin/addPage", {
        title,
        slug,
        content
      });
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
