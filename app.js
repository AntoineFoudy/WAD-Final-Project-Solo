const express = require("express");
const mongoose = require("mongoose");

// express set up
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"))



// mongoose set up
const dbURI = "mongodb://localhost:27017/market"



mongoose.connect(dbURI)
.then((result) => {
    console.log("Connected to DB");
    app.listen(3000)
})
.catch((error) => {
    console.log("There was an error", error)
})


// Setting the redirects
app.get("/", (request, response) => {response.render("index")});
app.get("/seller", (request, response) => {response.render("seller")});
app.get("/buyer", (request, response) => {response.render("buyer")});
app.get("/found", (request, response) => {response.render("found")});
app.get("/looking", (request, response) => {response.render("looking")});

app.use((request, response) => {response.status(404).render("404")});