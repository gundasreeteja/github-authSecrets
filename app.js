require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// // Mongoose Encryption secret
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET, // Secret is store in .env file, this file is not uploaded to github
//   encryptedFields: ["password"],
// }); // Plugin is required before creating the model

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(async function (req, res) {
    await User.findOne({ email: req.body.username })
      .then(function (foundUser) {
        if (foundUser) {
          if (foundUser.password === md5(req.body.password)) {
            res.render("secrets");
          } else {
            console.log("Incorrect password");
          }
        } else {
          console.log("Incorrect username");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(async function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password),
    });
    await newUser
      .save()
      .then(function (savedUser) {
        res.render("secrets");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
