const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("admin/pages", { title: "Admin page" });
});

// add page
router.get("/add-page", (req, res, next) => {
  const title = "ddd";
  const slug = "ddd";
  const content = "ddd";
  res.render("admin/addPage", { title, slug, content });
});

// export
module.exports = router;
