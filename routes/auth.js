const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

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

router.post("/signup", (req, res, next) => {
  const { username, email, password, avatar, instagram, website,description, credit } = req.body;
  if (req.file){let avatar = req.file.path};

  if (!email || !password || !username) {
    res.status(400).json({ message: "Email, username and password required" });
    return;
  }
  UserModel.findOne({ email })
    .then((userDocument) => {
      if (userDocument) {
        return res.status(400).json({ message: "Email already taken" });
      }

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

      UserModel.create(newUser)
        .then((newUserDocument) => {
          /* Login on signup */
          req.session.currentUser = newUserDocument._id;
          res.redirect("/api/auth/isLoggedIn");
        })
        .catch(next);
    })
    .catch(next);
});

router.get("/isLoggedIn", (req, res, next) => {
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

router.post("/update", (req, res, next) => {
    const { username, email, avatar, instagram, website,description, credit } = req.body;
    if (req.file){let avatar = req.file.path};

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
    req.session.destroy(err => {// We have to destroy the session here, otherwise we are not signed out.
      res.sendStatus(204);
    });
    
  } catch (err) {
    next(err);
  }
});



// -------- update and delete






module.exports = router;
