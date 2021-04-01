const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/ArtworkModel");
const uploader = require("./../config/cloudinary");
const Usermodel = require("./../models/UserModel");

// get all artworks which are for sale (for homepage)
router.get("/", (req, res, next) => {
  ArtworkModel.find({ forSale: true }).sort({title:1}).limit(11)
    .populate("creator", ["username", "description", "avatar"])
    .populate("owner", ["username", "avatar"])
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});

// get 1 artwork (artwork detail page)
router.get("/:id([a-z0-9]{24})", (req, res, next) => {
  ArtworkModel.findById(req.params.id)
    .populate("creator", ["username", "description", "avatar"])
    .populate("owner", ["username", "avatar"])
    .then((artwork) => res.status(200).json(artwork))
    .catch(next);
});



// create a new artwork (for user dashboard)
router.post("/new", uploader.single("image"), (req, res, next) => {
  let { title, description, image } = req.body;
  if(req.file){ image = req.file.path}
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
router.patch(
  "/:id([a-z0-9]{24})",
  uploader.single("image"),
  (req, res, next) => {
    ArtworkModel.findById(req.params.id)
      .then((artwork) => {
        if (artwork.creator.toString() !== req.session.currentUser) {
          next({
            message: "Unauthorised to update this artwork",
            status: 403,
          });
        } else {
          let { title, description, image } = req.body;
          if (req.file){image = req.file.path};
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
  }
);

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
    .populate("creator", ["username", "description", "avatar", "networks"])
    .then((artworks) => res.status(200).json(artworks))
    .catch(next);
});

// find all creators (username) and artworks (title/description) matching a search input 
router.get("/results", async (req, res, next) => {
  console.log(req.query);
  const query = new RegExp(req.query.search, "i");
  console.log("query: ",query)
  try {
    console.log(query)
    let artworks = await ArtworkModel.find().populate("creator", [
      "username",
      "description",
      "avatar",
    ]);
    let matchArtist = artworks
      .filter((doc) => doc.creator.username.match(query))
      .filter(
        (doc, index, arr) =>
          index ===
          arr.findIndex((el) => el.creator.username === doc.creator.username)
      );
    let matchArtwork = artworks.filter(
      (doc) => doc.title.match(query) || doc.description.match(query)
    );
    res
      .status(200)
      .json({ matchArtist: matchArtist, matchArtwork: matchArtwork });
  } catch (err) {
    console.log(err);
  }
});
      // { creator : {username: { $regex: req.query.search, $options: "i" }} }

      // router.get("/results", (req, res, next) => {
      //   // console.log(req.query);
      
      //   ArtworkModel.find({
      //     $or: [
      //       { title: { $regex: req.query.search, $options: "i" } },
      //       { description: { $regex: req.query.search, $options: "i" } },
      //     ],
      //   })
      //     .populate("creator")
      //     .populate("owner")
      //     .then((artworks) => res.status(200).json(artworks))
      //     .catch(next);
      // });

module.exports = router;
