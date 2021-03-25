const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");


const bcryptSalt = 10;

require("../config/dbConnection");

let users = [
  {
    username: "magali",
    email: "magali@gmail.com",
    credit: 2000,
    password: bcrypt.hashSync("magali", bcrypt.genSaltSync(bcryptSalt)),
    description: "Passionnate about travelling, Magali is the undisputed master in exotic landscape digital artwork"
  },
  {
    username: "romain",
    credit : 600,
    email: "romain@gmail.com",
    password: bcrypt.hashSync("romain", bcrypt.genSaltSync(bcryptSalt)),
    description: "Former artistic designer, Romain finds his inspiration in contemporary photographers."

  },
  {
    username: "thais",
    email: "thais@gmail.com",
    credit : 1400,
    password: bcrypt.hashSync("thais", bcrypt.genSaltSync(bcryptSalt)),
    description: "Thaïs creates great cat gifs very popular in the NFT world."
  },
];

UserModel.deleteMany()
  .then(() => {
    return UserModel.create(users);
  })
  .then((usersCreated) => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map((u) => u._id));
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch((err) => {
    mongoose.disconnect();
    throw err;
  });

