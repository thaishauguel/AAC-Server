const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AuctionModel = require("../models/AuctionModel");

const bcryptSalt = 10;

require("../config/dbConnection");


  let auctions = [
    {
        _artworkId: "60620195ddc9f96e93170dad",
        _auctionOwnerId: "605ca50000efba28d2095e13",
        bids: [{bidder :"605ca50000efba28d2095e15", bidValue :800, date: Date.now() }, {bidder :"605ca50000efba28d2095e14", bidValue :700, date: Date.now() }],
        active: true,
        initialPrice: "600",
        startingDate: Date.now(),
    },
    {
      _artworkId: "60620195ddc9f96e93170dae",
      _auctionOwnerId: "605ca50000efba28d2095e14",
      bids: [{bidder :"605ca50000efba28d2095e13", bidValue :800, date: Date.now() }, {bidder :"605ca50000efba28d2095e15", bidValue :750, date: Date.now() }],
      active: true,
      initialPrice: "600",
      startingDate: Date.now(),
  }
  ];
  
  AuctionModel.deleteMany()
    .then(() => {
      return AuctionModel.create(auctions);
    })
    .then((auctionsCreated) => {
      console.log(`${auctionsCreated.length} auctions created with the following id:`);
      console.log(auctionsCreated.map((a) => a._id));
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch((err) => {
      mongoose.disconnect();
      throw err;
    });
  