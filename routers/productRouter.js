const express = require("express")
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductByid,
    createUpdateReview,
    getReviewsOfAProduct,
    deleteReviewByProductAndReviewId
} = require("../controllers/productController");
const { autherziedUser, autherziedRoles } = require("../middlewares/auth");


const router = express.Router()

// routers 
router.route('/products').get(getAllProducts);

router.route('/admin/products').post(autherziedUser, autherziedRoles("admin"), createProduct);

router.route('/products/:id').get(getProductById);

router.route('/admin/products/:id').put(autherziedUser, autherziedRoles("admin"), updateProductById)
    .delete(autherziedUser, autherziedRoles("admin"), deleteProductByid);

router.route('/reviwes').put(autherziedUser, createUpdateReview)
    .get( getReviewsOfAProduct)
    .delete(autherziedUser, deleteReviewByProductAndReviewId);

module.exports = router;
