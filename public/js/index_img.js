// Slide Show for Index.ejs

display_img = document.getElementById("display_image");

let image_choice = ["/images/cabbage.jpg", "/images/carrot.jpg", "/images/peas.jpg", "/images/potato.jpg"];
let current_img = 0;

display_img.innerHTML= `<img src="${image_choice[current_img]}" width="200">`;

function slide_show() {
    current_img = (current_img + 1) % image_choice.length;
    display_img.innerHTML= `<img src="${image_choice[current_img]}" width="200" hight="200">`;
}

setInterval(slide_show, 3000)