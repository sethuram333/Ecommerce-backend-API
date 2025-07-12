const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST|| register an user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, userType, phone } = req.body;
    const valid = await User.findOne({ email });
    if (valid) {
      return res.status(400).json({
        success: false,
        message: "This Email Already Registered!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      phone,
    });
    if (newUser) {
      return res.status(400).json({
        success: true,
        message: "User registered!",
        data: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// POST|| login an user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered!.please provide valid email",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
    const payload = {
      userId: user._id,
      email: user.email,
      userType: user.userType,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      message: "User Logged",
      accessToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { registerUser, loginUser };
