const Product = require("../models/product") 
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const product = require("../models/product")
const { sortBy } = require("lodash")

exports.getProductsById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product = product
        next()
    })
}

exports.createProduct=(req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with image"
            })
        }
        
        //destructure the fields
        const { name,description,price,category,stock } = fields

        if(!name||!description||!price||!category||!stock){
            return res.status(400).json({
                error:'Please include all fields'
            })
        }


        let product = new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size Too Big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the DB

        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Saving T shirt in DB failed"
                })
            }
            res.json(product)
        })
    })

}

exports.getProduct = (req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.deleteProduct = (req,res)=>{
    let product = req.product
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to Delete the product"
            })
        }
        res.json({
            message:"Deletion was a success",
            deletedProduct
        })
    })

}

exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with image"
            })
        }
        
        //updation code
        let product = req.product
        product = _.extend(product,fields)

        //handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size Too Big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the DB

        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Updation of T shirt in DB failed"
                })
            }
            res.json(product)
        })
    })

    
}

//products listing
exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy: "_id"
    product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"No Product Found"
            })
        }
        res.json(product)
    })
}

exports.getAllUniqueCategories=(req,res,next)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.json(400)({
                error:"No Category Found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(prod=>{
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk Operation failed"
            })
        }
        next()
    })
}
