const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artworkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  forSale: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("artworks", artworkSchema);

//IF (!forSale && bids.length !== 0) ==> Owner == bids[0][0].bidder(.username after populate)

//             vente en cours or last vente                  vente d'avant -1       vente d'avant -2
// bid:[[{user1, 30},{user2, 20},{user1, 10}], [{user3, 30},{user5, 20},{user3, 10}], []]
//        last bid      bid d'avant -1          
