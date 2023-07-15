// load gallery hash
if (window.location.hash) {
	let hashIndex = parseInt(window.location.hash.slice(1));

}


let gallery = document.querySelector(".gallery");
let thumbnails = document.querySelectorAll(".gallery .thumbnail")
let galleryIndex = 0;

thumbnails.forEach(el => {
	el.addEventListener('click', () => {
		let url = el.dataset.full;
		setFeatureImage(url);
	})
});

function setFeatureImage(url){
	console.log("data " + url)

	document.querySelector('.transition').style.backgroundImage = `url("${url}")`;
	window.location.hash = galleryIndex;
}


// modify next and prev buttons
let prevButton = document.querySelector('a.prev');
let nextButton = document.querySelector('a.next');

prevButton.addEventListener('click', event => {
	event.preventDefault();
	seePrev();
});

nextButton.addEventListener('click', event => {
	event.preventDefault();
	seeNext();
});

function seeNext(){
	if (++galleryIndex < thumbnails.length){
		let el = thumbnails[galleryIndex];
		let newURL = el.dataset.full;
		setFeatureImage(newURL);
	} else {
		window.location = nextButton.getAttribute('href');
	}
}

function seePrev(){
	if (--galleryIndex >= 0){
		let el = thumbnails[galleryIndex];
		let newURL =el.dataset.full;
		setFeatureImage(newURL);
	} else {
		window.location = prevButton.getAttribute('href');
	}
}