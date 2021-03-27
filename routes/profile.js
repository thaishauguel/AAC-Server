const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/ArtworkModel");
const AuctionModel = require("../models/AuctionModel");

// const uploader = require("./../config/cloudinary");


//get all active auctions on artworks from my collection
// router.get("/my-current-sales", (req, res, next) => {
//   ArtworkModel.find({ owner: req.session.currentUser, forSale: true })
//     .populate("creator", "_artworkId")
//     .then((myCurrentSales) => res.status(200).json(myCurrentSales))
//     .catch(next);
// });
router.get("/my-current-sales", async (req, res, next) => {
    try{const currentSales = await AuctionModel.find({ _auctionOwnerId: req.session.currentUser, active: true })
      .populate("_artworkId" )
      .populate({
        path: 'bids',
        populate: {
          path: 'bidder',
        }
      })
      res.status(200).json(currentSales)
    } catch (err) {
      next(err);
    }
  });

//get all active auctions on which I already bidded
router.get("/my-current-bids", async (req, res, next) => {
  try {
    const activeAuctions = await AuctionModel.find({ active: true })
    .populate("_artworkId")  
    .populate({
        path: 'bids',
        populate: {
          path: 'bidder',
        }
      })
    let filteredAuctions = []
    activeAuctions.forEach((auction) => {
      if (auction.bids.filter((bid) =>
        bid.bidder._id.toString() === req.session.currentUser).length > 0) { filteredAuctions.push(auction) }
    }
    )
    res.status(200).json(filteredAuctions)
  } catch (err) {
    next(err);
  }

});

// get all artworks owned by current user (for user dashboard)
router.get("/my-collection", (req, res, next) => {
  ArtworkModel.find({ owner: req.session.currentUser })
    .populate("creator")
    .then((myArtworks) => res.status(200).json(myArtworks))
    .catch(next);
});


// get all my creations
router.get("/my-creations", (req, res, next) => {
  ArtworkModel.find({ creator: req.session.currentUser })
    .populate("owner")
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});


module.exports = router;