const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artworkSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    artwork: {
        type: String,
        required: true
    },
    bids: [[{
        bidder: ObjectId(user),
        bid: Number
    }]],
    saleStatus: {
        isForSale: {
            type: Boolean,
            default: false
        },
        initialPrice: {
            type: Number,
        }
    }
});
//IF (!forSale && bids.length !== 0) ==> Owner == bids[0][0].bidder(.username after populate)

const ArtworkModel = mongoose.model("artworks", artworkSchema);
module.exports = ArtworkModel;

//             vente 1                                 vente 2
// bid:[[{user1, 30},{user2, 20},{user1, 10}], [{user3, 30},{user5, 20},{user3, 10}], []]