const express = require("express");

const app = express();
app.set("view engine", "ejs");

app.listen(3000);

app.get("/", (request, response) => {response.render("index")});

app.use((request, response) => {response.status(404).render("404")});