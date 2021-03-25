const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const ArtworkModel = require("../models/ArtworkModel");
const AuctionModel = require("../models/AuctionModel");

const bcryptSalt = 10;

require("../config/dbConnection");


  let artworks = [
    {
        title: "Nyan Cat",
          description: "This is a cat gif ",
          image: "https://news.artnet.com/app/news-upload/2021/02/NYAN-CAT-ARTINTERVIEW-copy.jpg",
          creator:"605ca50000efba28d2095e15",
          owner: "605ca50000efba28d2095e15",
          forSale: false,
    },
    {
        title: "The Day it Started",
        description: "Dark landscapes somewhere between reality and my imagination",
        image: "https://www.northlandscapes.com/files/images/nft/luminous-signals/northlandscapes-luminous-signals-%2306-chapter-1-dreamland.jpg",
        creator:"605ca50000efba28d2095e13",
        owner: "605ca50000efba28d2095e13",
        forSale: true,
    },
    {
        title: "Lumière tamisée",
        description: "Collage de photos",
        image: "https://www.yankodesign.com/images/design_news/2021/03/nfts/nft_ds_yanko_design-07.jpg",
        creator:"605ca50000efba28d2095e14",
        owner: "605ca50000efba28d2095e14",
        forSale: true
     },
  ];
  
  ArtworkModel.deleteMany()
    .then(() => {
      return ArtworkModel.create(artworks);
    })
    .then((artworksCreated) => {
      console.log(`${artworksCreated.length} artworks created with the following id:`);
      console.log(artworksCreated.map((a) => a._id));
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch((err) => {
      mongoose.disconnect();
      throw err;
    });
  