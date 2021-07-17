const express = require('express')
var router = express.Router()


router.get('/',(req,res)=>{
    res.send("Welcome to E-commerce REST API")
})


module.exports = router