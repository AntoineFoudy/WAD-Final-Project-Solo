const sell_button = document.getElementById("sell_button");
const buy_button = document.getElementById("buy_button");

// checks to see what page is active depending on what button ID is on the page
if(buy_button) {
    buy_button.addEventListener("click", send_data);
};
if(sell_button) {
    sell_button.addEventListener("click", send_data);
};

// depending on what button is press function is ran for buyer or seller
function send_data() {
    let buyer = " ";
    if(buy_button) {
        buyer = "true";
    }
    else {
        buyer = "false";
    }
    let name = document.getElementById("get_name").value.trim();
    let email = document.getElementById("get_email").value.trim();
    let veg = document.getElementById("get_veg").value.trim();
    let amount = document.getElementById("get_amount").value.trim();
    let county = document.getElementById("get_county").value.trim();
    let delivery = document.getElementById("get_delivery").value.trim();

    // add data to object and send the data to function, if any fields are  alert user
    if(name && email && veg && amount && county && delivery) {
        let send_data = {buyer, name, email, veg, amount, county, delivery}
        send_data_to_app(send_data) 
    }
    else {
        alert("Please do not leave any field empty")
    }
};

function send_data_to_app(send_data) {
    const fetch_post_options = {method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(send_data)
    };

    fetch("/api", fetch_post_options)
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
};