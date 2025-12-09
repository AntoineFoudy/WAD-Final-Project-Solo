const express = require("express");
const mongoose = require("mongoose");
const order = require("./utils/order.js");

// express set up
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());



// mongoose set up
const dbURI = "mongodb://localhost:27017/market"



mongoose.connect(dbURI)
.then((result) => {
    console.log("Connected to DB");
    app.listen(3000)
})
.catch((error) => {
    console.log("There was an error", error)
});


// Setting the redirects
app.get("/", (request, response) => {response.render("index")});
app.get("/seller", (request, response) => {response.render("seller")});
app.get("/buyer", (request, response) => {response.render("buyer")});
app.get("/found", (request, response) => {response.render("found")});
app.get("/looking", (request, response) => {response.render("looking")});

// Setting post up
app.post("/api", async(request, response) => {
    console.log(request.body);
    try {
        const order_document = await new order(request.body);
        let matching_document = await order_document;

        // Changing the buyer to seller and visa versa to check if there is an order that matches the new order
        if(matching_document.buyer == true) {
            matching_document.buyer = false
        }
        else {matching_document.buyer = true}

        // Find one document that matches the search
        matching_document = await order.findOne({
            buyer: matching_document.buyer,
            veg: order_document.veg,
            amount: {$lte: order_document.amount},
            county: order_document.county,
            delivery: order_document.delivery
        }).exec();
        console.log(matching_document)

        // Check if matching_document is empty
        let is_null = await checkthedata(matching_document)
        console.log(is_null)

        if(is_null == null) {
            order_document.save().then(() => console.log("order saved"))
            response.redirect("looking");
            console.log("We got here")
        };

    }
    catch(e) {
        console.log(e)
    }
});

// route not found
app.use((request, response) => {response.status(404).render("404")});

function checkthedata(matching_document) {
    if(matching_document == null) {
        console.log("No data found")
        return null
    }
    else {
        return matching_document
    }    
};