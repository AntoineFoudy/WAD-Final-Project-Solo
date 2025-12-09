const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
    buyer: Boolean,
    name: String,
    email: String,
    veg: String,
    amount: Number,
    county: String,
    delivery: Boolean
})

module.exports = mongoose.model("ActiveOrders", order_schema)