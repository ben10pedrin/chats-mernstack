const express = require("express");
const router = express.Router();

const Message = require("../models/message");

router.get("/", async (req, res) => {
  res.send("hello guys");
});

module.exports = router;
