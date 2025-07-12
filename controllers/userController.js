const User = require("../models/user");
const bcrypt = require("bcrypt");

//fetch user data
const getAllUsers = async (req, res) => {
  try {
    const fetchUsers = await User.find();
    if (fetchUsers) {
      return res.status(201).json({
        success: true,
        message: "Fetch All User",
        Users: fetchUsers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//update user details
const updateUserDetails = async (req, res) => {
  try {
    const updatedDetails = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedDetails) {
      return res.status(201).json({
        success: true,
        message: "User Updated!",
        data: updatedDetails,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//update password || change password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    const existPassword = await bcrypt.compare(currentPassword, user.password);
    if (!existPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(201).json({
      success: true,
      message: "Password changed!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//reset password || forgot password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is Wrong",
      });
    }                                                                         
    const salt = await bcrypt.genSalt(10);                                    
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(201).json({
      success: true,
      message: "password Reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//delete user || remove user
const deleteUser = async (req, res) => {
  try {
     const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (deletedUser) {
      return res.status(201).json({
        success: true,
        message: "User deleted!",
        data: deletedUser
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserDetails,
  updatePassword,
  resetPassword,
  deleteUser,
};
