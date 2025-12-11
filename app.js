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

// Setting up the info to pass to routes
let found_order_document = {};
let found_matching_document = {};
let found_seller_data = {};


// Setting the redirects
app.get("/", (request, response) => {response.render("index")});
app.get("/seller", (request, response) => {response.render("seller")});
app.get("/buyer", (request, response) => {response.render("buyer")});
app.get("/found", (request, response) => {
    response.render("found", {found_order_document, found_matching_document})});
app.get("/looking", (request, response) => {response.render("looking")});
app.get("/seller_info", (request, response) => {response.render("seller_info", {found_seller_data})});

// Setting post up
app.post("/api", async(request, response) => {
    console.log(request.body);
    try {
        const order_document = await new order(request.body);
        let matching_document = await order_document;

        // Changing the buyer to seller and visa versa to check if there is an order that matches the needs of the new order
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
        console.log("this matching_document is: " + matching_document)

        // Check if matching_document is empty and if it is not empty pass the values for /found page and update the amount
        if(!matching_document) {
            // try catch because mongoose validation will crash the server
            try {
                await order_document.save()
                console.log("order saved");
                response.redirect("looking");
                console.log("We got here")
            } catch (error) {
                console.log("save document error " + error)
            }
        }
        else{
            found_order_document = {buyer: order_document.buyer, name: order_document.name, email: order_document.email, veg: order_document.veg, amount: order_document.amount, county: order_document.county, delivery: order_document.delivery};
            found_matching_document = {buyer: matching_document.buyer, name:  matching_document.name, email: matching_document.email, veg: matching_document.veg, amount: order_document.amount, county: matching_document.county, delivery: matching_document.delivery};
            response.redirect("found");

            await matching_document.updateOne(
                {_id: matching_document._id},
                {$inc: {amount: - order_document.amount}}
            )
        }
        // If the amount is <= 0 delete the document
        if(matching_document.amount <= 0) {
            await order.deleteOne({_id: matching_document._id})
        }

    }
    catch(e) {
        console.log(e)
    }
});

// Get seller data ( buyer: false ) 
app.post("/apisd", async(request, response) => {
    const get_data_document = await new order(request.body);

    found_seller_data = await order.find({
        buyer: get_data_document.buyer
    }).exec();

    console.log(found_seller_data);
})

// route not found
app.use((request, response) => {response.status(404).render("404")});