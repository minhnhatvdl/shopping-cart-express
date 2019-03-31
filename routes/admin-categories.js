const express = require("express");
const router = express.Router();

// middleware express-validator
const { check, body, validationResult } = require("express-validator/check");

// get: category page
router.get("/", async (req, res, next) => {
  res.render("admin/categories");
});

// export
module.exports = router;
