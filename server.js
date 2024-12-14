const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const session = require('express-session');
const isSignedIn = require("./middleware/is-signed-in.js");
const app = express();

const passUserToView = require("./middleware/pass-user-to-view.js");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const router = require("express").Router()


// Port Configurations
const port = process.env.PORT ? process.env.PORT : "3000";

// Data Connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passUserToView);



// Require Controllers
const authCtrl = require("./controllers/auth.js");
const recipesCtrl = require('./controllers/recipes.js');
const ingredientsCtrl = require('./controllers/ingredients.js');

// Use Controller
app.use("/auth", authCtrl);
app.use("/recipes", recipesCtrl);
app.use("/ingredients", ingredientsCtrl);



// Root Route
app.get("/", async (req, res) => {
    res.render("index.ejs");
});



// Listen for the HTTP requests
app.listen(port, () => {
console.log(`The express app is ready on port ${port}!`);
});
