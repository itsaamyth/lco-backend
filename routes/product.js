const express = require('express')
const router = express.Router()

const {isAdmin,isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getProductsById,createProduct,getProduct, photo,deleteProduct,updateProduct,getAllProducts,getAllUniqueCategories} = require('../controllers/product')
const {getUserById} = require('../controllers/user')


//all of params
router.param("userId",getUserById)
router.param("productId",getProductsById)

//all of actual routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)

router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)


//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)


//listing routes
router.get("/products",getAllProducts)

router.get("/products/categories",getAllUniqueCategories)



module.exports = router
