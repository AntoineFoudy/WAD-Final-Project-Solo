const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
    buyer: Boolean,
    user: {
        name: String,
        email: String
    },
    veg: String,
    amount: {
        type: Number,
        min: 1,
    },
    county: String,
    delivery: Boolean
})

module.exports = mongoose.model("ActiveOrders", order_schema)