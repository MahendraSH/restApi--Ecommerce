const express = require("express");
const { loginUser,
    regestorUser,
    logutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updateUserPassword,
    updateUserDetails,
    getAllUsers,
    getUsersById,
    updateUserRole,
    deleteUserById } = require("../controllers/userController");
const { autherziedUser,
    autherziedRoles } = require("../middlewares/auth");

const router = express.Router();

router.route('/user/reg').post(regestorUser);

router.route('/user/log').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:link').put(resetPassword)

router.route('/user/logout').get(logutUser);

router.route('/me').get(autherziedUser, getUserDetails);

router.route('/password/update').put(autherziedUser, updateUserPassword);

router.route('/me/update').put(autherziedUser, updateUserDetails);

router.route('/admin/users').get(autherziedUser, autherziedRoles('admin'), getAllUsers);

router.route('/admin/users/:id').get(autherziedUser, autherziedRoles('admin'), getUsersById)
    .put(autherziedUser, autherziedRoles('admin'), updateUserRole)
    .delete(autherziedUser, autherziedRoles('admin'), deleteUserById);

module.exports = router;