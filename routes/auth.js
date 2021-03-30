const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const uploader = require("./../config/cloudinary");


const salt = 10;

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .then((userDocument) => {
      if (!userDocument) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValidPassword = bcrypt.compareSync(password, userDocument.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      req.session.currentUser = userDocument._id;
      res.redirect("/api/auth/isLoggedIn");
    })
    .catch(next);
});

router.post("/signup", uploader.single("avatar"),  (req, res, next) => {
  console.log('coucou0' )

  let { username, email, password, avatar, instagram, website,description, credit } = req.body;
  if (req.file){ avatar = req.file.path};
  console.log('coucou1' )

  if (!email || !password || !username) {
    res.status(400).json({ message: "Email, username and password required" });
    return;
  }
  console.log('coucou2')

  UserModel.findOne({ email })
    .then((userDocument) => {
      console.log(userDocument)
      if (userDocument) {
        return res.status(400).json({ message: "Email already taken" });
      }
      console.log('coucou4' )

      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        username,
        email,
        password: hashedPassword,
        avatar,
        networks: {
          instagram,
          website,
        },
        description,
        credit
      };
      // console.log('newUser', newUser)

      UserModel.create(newUser)
        .then((newUserDocument) => {
          /* Login on signup */
          console.log(newUserDocument)
          req.session.currentUser = newUserDocument._id;
          // console.log(req.session.currentUser)
          res.redirect("/api/auth/isLoggedIn");
        })
        .catch(next);
    })
    .catch(next);
});

router.get("/isLoggedIn", (req, res, next) => {
  console.log('coucou', req.session.currentUser )
  if (!req.session.currentUser)
    return res.status(401).json({ message: "Unauthorized" });

  const id = req.session.currentUser;
  
  UserModel.findById(id)
    .select("-password")
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch(next);
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(function (error) {
    if (error) next(error);
    else res.status(200).json({ message: "Succesfully disconnected." });
  });
});


router.get("/update", (req, res, next) => {
  res.redirect("/api/auth/isLoggedIn");

});

router.post("/update", uploader.single("avatar"), (req, res, next) => {
    let { username, email, avatar, instagram, website,description, credit } = req.body;
    if (req.file){ avatar = req.file.path};

  UserModel.findByIdAndUpdate(req.session.currentUser, {
    username,
    email,
    avatar,
    networks: {
      instagram,
      website,
    },
    description,
    credit
  },{new:true})
  .then((user)=> {
    res.status(200).json(user)})
  .catch(next)
})

router.get('/update-password', (req, res, next)=>{
  res.redirect("/api/auth/isLoggedIn");
})
  
router.post('/update-password',async(req, res, next)=>{
    let {formerPassword, newPassword}=req.body
    const user= await UserModel.findById(req.session.currentUser)
    const isSamePassword = bcrypt.compareSync(formerPassword, user.password);
        if (!isSamePassword) {
          res.status(400).json({ message: "Former password is not valid" })
        } 
        else {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          newPassword = hashedPassword;
          await UserModel.findByIdAndUpdate(req.session.currentUser, {password : newPassword}, {new:true});
          res.status(200).json({ message: "password successfully changed!" })        }
    }
  )

router.get("/delete", async (req, res, next) => {
  try {
    await UserModel.findByIdAndRemove(req.session.currentUser);
    req.session.destroy()
    console.log("req.session ", req.session)
    res.sendStatus(204).redirect("/api/auth/isLoggedIn")
      // err => {// We have to destroy the session here, otherwise we are not signed out.
  } catch (err) {
    next(err);
  }
});



// -------- update and delete






module.exports = router;
