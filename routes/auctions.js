const express = require("express");
const router = express.Router();
const AuctionModel=require('../models/AuctionModel')



router.get("/", (req, res, next)=>{
    AuctionModel.find({_auctionOwnerId : req.session.currentUser})
    .then((auctions)=>res.status(200).json(auctions))
    .catch(next)
})

module.exports = router;
