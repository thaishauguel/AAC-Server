const express = require("express");
const router = express.Router();
const AuctionModel=require('../models/AuctionModel')
const ArtworkModel=require('../models/ArtworkModel')
const UserModel=require('../models/UserModel')



//All auctions from a user <===== we are not using this router yet, to be deleted if remains the same
router.get("/", (req, res, next)=>{
    AuctionModel.find({_auctionOwnerId : req.session.currentUser})
    .then((auctions)=>res.status(200).json(auctions))
    .catch(next)
})

router.get("/:id/last-auction", async (req, res, next)=> {
    try{
        const auctions = await AuctionModel.find({_artworkId : req.params.id}).sort({startingDate:-1})
        .populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              select: ["username"]
            }
          }, )
        const LastAuction = auctions[0]
        res.status(200).json(LastAuction)
    }
    catch(err) {
        next(err)
    }
})

router.post("/new", (req, res, next)=>{
    let {_artworkId, initialPrice, startingDate}= req.body

    const _auctionOwnerId = req.session.currentUser;


    

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

router.patch("/close-auction/:id", (req,res,next)=>{
    const {owner}=req.body
AuctionModel.findByIdAndUpdate(req.params.id, {active:false}, {new:true})
.then((auction)=>{
    res.status(200).json(auction)
        ArtworkModel.findByIdAndUpdate(auction._artworkId, {forSale :false, owner})
        .then(()=>console.log("auction closed"))
        .catch(next)
}
)
.catch(next)

})

// delete an auction (only the creator of the auction may delete it)
router.delete("/:id", (req, res, next) => {
    AuctionModel.findById(req.params.id)
    .then((auction) => {
      if (auction._auctionOwnerId.toString() !== req.session.currentUser) {
        next({
          message: "Unauthorised to delete this auction",
          status: 403,
        });
      } else {
        ArtworkModel.findByIdAndUpdate(auction._artworkId, {forSale :false})
        .then(()=>console.log("auction closed"))
        .catch(next)
        AuctionModel.findByIdAndDelete(req.params.id)
          .then((auction) => res.status(200).json(auction))
          .catch(next);
      }
    })
    .catch((err) => next(err));

})


//Update the credits of the buyer and the seller just after an auction was closed
router.patch('/update-credits', async (req, res, next)=>{
    try {const {bidValue, sellerId, buyerId}= req.body

    let sellerUpdated = await UserModel.findByIdAndUpdate(sellerId, { $inc: { credit: bidValue }}, {new:true})
    let buyerUpdated = await UserModel.findByIdAndUpdate(buyerId, { $inc: { credit:  - bidValue }}, {new:true})

    res.status(200).json(sellerUpdated)}
    catch(err) {
        next(err)
    }
})

module.exports = router;
