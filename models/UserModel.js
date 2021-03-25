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
        default: "https://cdn.boldomatic.com/content/post/fl4sZw/LOVE-ME-I-M-AN-ARTIST?size=800"
    },
    networks: {
        instagram: String,
        website: String,
    },
    description: String,
    credit: Number


});


module.exports = mongoose.model("users", userSchema);
