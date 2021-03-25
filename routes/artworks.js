const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/ArtworkModel");
const uploader = require("./../config/cloudinary");

// get all artworks which are for sale (for homepage)
router.get("/", (req, res, next) => {
  ArtworkModel.find({ forSale: true })
    .populate("creator")
    .populate("owner")
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});

// get 1 artwork (artwork detail page)
router.get("/:id([a-z0-9]{24})", (req, res, next) => {
  ArtworkModel.findById(req.params.id)
    .populate("creator")
    .populate("owner")
    .then((artwork) => res.status(200).json(artwork))
    .catch(next);
});

// get all artworks owned by current user (for user dashboard)
router.get("/my-collection", (req, res, next) => {
  ArtworkModel.find({ owner : req.session.currentUser })
    .populate("creator")
    .then((myArtworks) => res.status(200).json(myArtworks))
    .catch(next);
});

// create a new artwork (for user dashboard)
router.post("/new", uploader.single("image"), (req, res, next) => {
  let { title, description } = req.body;
  let image = req.file.path;
  ArtworkModel.create({
    title,
    description,
    image,
    creator: req.session.currentUser,
    owner: req.session.currentUser,
  })
    .then((newArtwork) => res.status(201).json(newArtwork))
    .catch(next);
});

// update an artwork (for user dashboard) - only creators may update their own artwork
router.patch("/:id([a-z0-9]{24})", uploader.single("image"), (req, res, next) => {
  ArtworkModel.findById(req.params.id)
    .then((artwork) => {
      if (artwork.creator.toString() !== req.session.currentUser) {
        next({
          message: "Unauthorised to update this artwork",
          status: 403,
        });
      } else {
        let { title, description } = req.body;
        let image = req.file.path;
        ArtworkModel.findByIdAndUpdate(
          req.params.id,
          {
            title,
            description,
            image,
          },
          { new: true }
        )
          .then((updatedArtwork) => res.status(200).json(updatedArtwork))
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

// delete an artwork (for user dashboard) - only creators may delete their own artwork
router.delete("/:id", (req, res, next) => {
  ArtworkModel.findById(req.params.id)
    .then((artwork) => {
      if (artwork.creator.toString() !== req.session.currentUser) {
        next({
          message: "Unauthorised to delete this artwork",
          status: 403,
        });
      } else {
        ArtworkModel.findByIdAndDelete(req.params.id)
          .then((artwork) => res.status(200).json(artwork))
          .catch(next);
      }
    })
    .catch((err) => next(err));
});

// get all artworks from a specific artist (for artist page, with bio)
router.get("/artist/:id", (req, res, next) => {
  ArtworkModel.find({ creator: req.params.id })
    .populate("creator")
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});

// find all artworks matching a search input --> as creator or in description
router.get("/results", (req, res, next) => {
    console.log(req.query)
//   const exp = new RegExp(req.query);
//   const query = { $regex: exp };

//     const search = req.query.search;
// // console.log("search: ",typeof search)
  
//   ArtworkModel.find( {creator: {$regex: search, $options: "i"} } )
// // {$regex: req.query, $options: "i"}   {$regex: req.query, $options: "i" }
// // { $or: [{ creator: search} , { description: search }] }  
//   .populate("creator")
//     .populate("owner")
//     .then((artworks) => res.status(200).json(artworks))
//     .catch(next);
});

module.exports = router;
