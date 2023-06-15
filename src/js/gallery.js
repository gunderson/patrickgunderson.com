let gallery = document.querySelector(".gallery");
let thumbnails = document.querySelectorAll(".gallery .thumbnail")

thumbnails.forEach(el => {
    el.addEventListener('click', () => {
        console.log(el.attributes.getNamedItem('data-full'))
        document.querySelector('.transition').src = el.attributes.getNamedItem('data-full').value;
    })
});