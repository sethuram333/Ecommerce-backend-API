const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  updateUserDetails,
  updatePassword,
  resetPassword,
  deleteUser,
} = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')
//fetch all  || GET
router.get('/',auth,getAllUsers)
//update user details|| PUT
router.put('/updateuser/:id',auth,updateUserDetails)
//change password || PATCH
router.patch('/changepassword/:id',auth,updatePassword)
//reset password || POST
router.post('/resetpassword',resetPassword)
//delete User || DELETE
router.delete('/deleteuser/:id',deleteUser)

module.exports = router

