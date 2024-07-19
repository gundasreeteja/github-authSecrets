const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = {
  email: String,
  password: String,
};

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
          if (foundUser.password === req.body.password) {
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
      password: req.body.password,
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
