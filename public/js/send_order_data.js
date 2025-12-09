const sell_button = document.getElementById("sell_button");
const buy_button = document.getElementById("buy_button");

buy_button.addEventListener("click", send_data_buy);
sell_button.addEventListener("click", send_data_sell);

// depending on what button is press function is ran for buyer or seller
function send_data_buy() {
    let buyer = "true";
    let name = document.getElementById("get_name").value;
    let email = document.getElementById("get_email").value;
    let veg = document.getElementById("get_veg").value;
    let amount = document.getElementById("get_amount").value;
    let county = document.getElementById("get_county").value;
    let delivery = document.getElementById("get_delivery").value;

    // console.log(buyer, name, email, veg, amount, county, delivery)

    // add data to object and send the data to function
    let send_data = {buyer, name, email, veg, amount, county, delivery}
    send_data_to_app(send_data);
}

function send_data_sell() {
    let buyer = "false";
    let name = document.getElementById("get_name").value;
    let email = document.getElementById("get_email").value;
    let veg = document.getElementById("get_veg").value;
    let amount = document.getElementById("get_amount").value;
    let county = document.getElementById("get_county").value;
    let delivery = document.getElementById("get_delivery").value;

    // console.log(buyer, name, email, veg, amount, county, delivery)

    // add data to object and send the data to function
    let send_data = {buyer, name, email, veg, amount, county, delivery}
    send_data_to_app(send_data);
}

function send_data_to_app(send_data) {
    const fetch_post_options = {method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(send_data)
    };

    fetch("/api", fetch_post_options)
}