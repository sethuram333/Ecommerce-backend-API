const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// register an User || POST
router.post("/register",registerUser);
// login an User || POST
router.post("/login",loginUser);
module.exports = router;
