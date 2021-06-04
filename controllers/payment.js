const express = require('express')
const router = express.Router()

const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "m5bfzcm2gw373npj",
  publicKey: "26x5cv48tpq5rfsz",
  privateKey: "ed83b3a5c0d4c382673ae6b5b420aaaa"
});

exports.getToken=()=>{
    gateway.clientToken.generate({}, function (err, response) {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.send(response)
        }
      });
}

exports.processPayment=()=>{

    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.json(result)
        }
      });
}
