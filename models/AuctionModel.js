const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({

    _artworkId : {
        type: Schema.Types.ObjectId,
        ref: 'artworks',
        required: true,
    },
    _auctionOwnerId : {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    bids: [{
        bidder: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        },
        bidValue: Number,
        date: Date
    }],
    active:{
        type: Boolean, 
        default: true
    },
    initialPrice: Number,
    startingDate: Date, 
    endingDate: Date
})

module.exports = mongoose.model("auctions", auctionSchema);
