const express = require("express")
const router = express.Router()
const Ingredient = require("../models/ingredient")
const isSignedIn = require("../middleware/is-signed-in")

router.get("/", isSignedIn, async (req, res) => {
const ingredient = await Ingredient.find()
res.render("ingredients/index.ejs", {ingredient})
})

router.get("/new", isSignedIn, (req, res) => {
    res.render("ingredients/new.ejs")
})

router.post("/", isSignedIn, async (req, res) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.redirect("/ingredients/new")
    }

    const newIngredient = new Ingredient({ name: req.body.name.trim()})
    await newIngredient.save()
    res.redirect("/ingredients")
})

router.delete("/:id", isSignedIn, async (req, res) => {
    await Ingredient.findByIdAndDelete(req.params.id)
    res.redirect("/ingredients")
})

module.exports = router;