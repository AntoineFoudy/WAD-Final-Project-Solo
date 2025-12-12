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
        let matching_document = await new order(request.body);

        // Changing the buyer to seller and visa versa to check if there is an order that matches the needs of the new order
        if(matching_document.buyer == true) {
            matching_document.buyer = false
        }
        else {matching_document.buyer = true}

        // Find one document that matches the search
        matching_document = await order.findOne({
            buyer: matching_document.buyer,
            veg: order_document.veg,
            amount: {$gte: order_document.amount},
            county: order_document.county,
            delivery: order_document.delivery
        }).exec();
        console.log("this matching_document is: " + matching_document)

        // Check if matching_document is empty and if it is not empty pass the values for /found page and update the amount
        if(!matching_document) {
            // try catch because mongoose validation will crash the server
            try {
                await order_document.save()
                console.log("order saved " + order_document);
                response.redirect("looking");
                console.log("We got here")
            } catch (error) {
                console.log("save document error " + error)
            }
        }
        else{
            // Passing the data to be past with routing to user
            if(order_document.buyer == true) {
                found_order_document = {buyer: order_document.buyer, user: { name: order_document.user.name, email: order_document.user.email }, veg: order_document.veg, amount: order_document.amount, county: order_document.county, delivery: order_document.delivery};
            }
            else {
                found_matching_document = {buyer: matching_document.buyer, user: { name: matching_document.user.name, email: matching_document.user.email }, veg: matching_document.veg, amount: order_document.amount, county: matching_document.county, delivery: matching_document.delivery};
            }
            if(order_document.buyer == false) {
                found_order_document = {buyer: order_document.buyer, user: { name: order_document.user.name, email: order_document.user.email }, veg: order_document.veg, amount: order_document.amount, county: order_document.county, delivery: order_document.delivery};
            }
            else {
                found_matching_document = {buyer: matching_document.buyer, user: { name: matching_document.user.name, email: matching_document.user.email }, veg: matching_document.veg, amount: order_document.amount, county: matching_document.county, delivery: matching_document.delivery};
            }
            response.redirect("found");

            // updating amount based on how many veg the buy bought
            await matching_document.updateOne(
                {$inc: {amount: - order_document.amount}}
            )
        }
        if(matching_document) {
            // load updated maching_document from collection to memory
            matching_document = await order.findOne({_id: matching_document._id}).exec();
            // If the amount is <= 0 delete the document
            if(matching_document.amount <= 0) {
            await matching_document.deleteOne().exec();
        }
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