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
        default: "https://res.cloudinary.com/rbn33connect/image/upload/v1617207241/default_picture_yinhcz.jpg"
    },
    networks: {
        instagram: String,
        website: String,
    },
    description: String,
    credit: Number


});


module.exports = mongoose.model("users", userSchema);
