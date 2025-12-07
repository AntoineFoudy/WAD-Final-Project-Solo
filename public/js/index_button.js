let buy_button = document.getElementById("buy_button");
let sell_button = document.getElementById("sell_button");

buy_button.addEventListener("click", buyer_page);
sell_button.addEventListener("click", seller_page);

function buyer_page() {
    window.location.replace("http://localhost:3000/buyer");
}

function seller_page() {
    window.location.replace("http://localhost:3000/seller");
}