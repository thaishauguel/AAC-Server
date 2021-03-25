const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "urlToDefined"
    },
    networks: {
        instagram: String,
        website: String,
    },
    description: String,
    //AllMyCreations: [(artworkCollection)],
    // CurrentCollection:[],
    // AllMyPurchases: [ObjectId(artworkCollection)],
    //ArtToSell: [ObjectId]


});


const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;