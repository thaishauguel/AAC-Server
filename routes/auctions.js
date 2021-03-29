const express = require("express");
const router = express.Router();
const AuctionModel=require('../models/AuctionModel')



router.get("/", (req, res, next)=>{
    AuctionModel.find({_auctionOwnerId : req.session.currentUser})
    .then((auctions)=>res.status(200).json(auctions))
    .catch(next)
})

router.get("/:id/last-auction", async (req, res, next)=> {
    try{
        const auctions = await AuctionModel.find({_artworkId : req.params.id})
        .populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              select: ["username", "avatar"]
            }
          }, )
        const LastAuction = auctions[0]
        console.log(LastAuction)
        res.status(200).json(LastAuction)
    }
    catch(err) {
        next(err)
    }
})

module.exports = router;
