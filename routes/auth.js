var express = require('express')
var router = express.Router()
const {check,validationResult} = require('express-validator')
const {signout,signup,signin,isSignedIn} = require('../controllers/auth')



router.post('/signup',[
    check("name","name should not be blank").isLength({min:1}),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 5 char").isLength({min:5})
],signup)

router.post('/signin',[
    check("email","email is required").isEmail(),
    check("password","password should be atleast 5 char").isLength({min:5})
],signin)


router.get("/signout",signout)

router.get('/testroute',isSignedIn,(req,res)=>{
    // res.send("A protected route")
    res.json(
        req.auth)
})

module.exports = router