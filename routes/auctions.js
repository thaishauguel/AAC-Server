const express = require("express");
const router = express.Router();
const AuctionModel=require('../models/AuctionModel')
const ArtworkModel=require('../models/ArtworkModel')



//All auctions from a user <===== we are not using this router yet, to be deleted if remains the same
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

router.post("/new", (req, res, next)=>{
    let {_artworkId, initialPrice, startingDate}= req.body

    const _auctionOwnerId = req.session.currentUser
    const active = true
    const newAuction={
        _artworkId,
        initialPrice,
        _auctionOwnerId,
        startingDate,
        active
    }
    AuctionModel.create(newAuction)
    .then((auction)=>{
        res.status(200).json(auction)
        ArtworkModel.findByIdAndUpdate(_artworkId, {forSale :true})
        .then(()=>console.log("updated"))
        .catch(next)
    })
    .catch(next)
})

router.patch("/:id/new-bid", (req, res, next)=>{
    const { bidValue } = req.body
    const bidder = req.session.currentUser
    const date = Date.now()
    const newBid= {
        bidValue,
        bidder,
        date,
    }
    AuctionModel.findByIdAndUpdate(req.params.id,
        { $push: {
            bids: {
               $each: [ newBid ],
               $position: 0
        }}},
        { new: true }
    )
    .then((auction)=>res.status(200).json(auction))
    .catch(next)
})

module.exports = router;
