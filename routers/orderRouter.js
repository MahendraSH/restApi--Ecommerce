const express = require("express")

const { autherziedUser, autherziedRoles } = require("../middlewares/auth");
const { createNewOrder, getSingleOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");


const router = express.Router()
router.route('/order/new').post(autherziedUser, createNewOrder);
router.route('/admin/order/:id').get(autherziedUser, autherziedRoles('admin'), getSingleOrder);
router.route('/order/me').get(autherziedUser, getMyOrders);
router.route('/admin/order').get(autherziedUser, autherziedRoles('admin'), getAllOrders)


module.exports = router;