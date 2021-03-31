const express = require("express");
const router = express.Router();
const uploader = require("./../config/cloudinary");
const ArtworkModel = require("../models/ArtworkModel");
const AuctionModel = require("../models/AuctionModel");
const UserModel = require("../models/UserModel");

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
        path: '_artworkId',
        populate: {
          path: 'creator',
          select: ["username"]
        }
      })
      .populate({
        path: 'bids',
        populate: {
          path: 'bidder',
          select: ["username"]
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
          select: ["username"]
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
    .populate("creator", ["username", "description", "avatar"])
    .then((myArtworks) => res.status(200).json(myArtworks))
    .catch(next);
});

// get current user (for user dashboard)
router.get("/my-profile", (req, res, next) => {
  UserModel.findById(req.session.currentUser )
    .then((user) => res.status(200).json(user))
    .catch(next);
});

// Update current user (for user dashboard)
router.patch("/my-profile/update", uploader.single("avatar"), (req, res, next) => {
  let { username, email, avatar, instagram, website,description, credit } = req.body;
  if (req.file){ avatar = req.file.path};

  UserModel.findByIdAndUpdate(req.session.currentUser, 
    {
      username,
      email,
      avatar,
      networks: {
        instagram,
        website
      },
      description,
      credit
  } 
  ,{new:true})
  .then((user)=> {
    res.status(200).json(user)})
  .catch(next)
});



// get all my creations
router.get("/my-creations", (req, res, next) => {
  ArtworkModel.find({ creator: req.session.currentUser })
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});


module.exports = router;