const get_data = {buyer: "false"};

const fetch_post_options = {method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(get_data)
    };

fetch("/apisd", fetch_post_options)
