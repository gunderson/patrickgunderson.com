let prevURL = document.querySelector('a.prev').getAttribute('href');
let nextURL = document.querySelector('a.next').getAttribute('href');

function onKeyUp(event) {
	switch (event.keyCode) {
		case 37:
			if(typeof thumbnails !== 'undefined' && typeof seePrev !== 'undefined' ) {
				seePrev();
			} else {
				window.location = prevURL;
			}
			break;
		case 39:
			if(typeof thumbnails !== 'undefined' &&  typeof seeNext !== 'undefined' ) {
				seeNext();
			} else {
				window.location = nextURL;
			}
			break;
		default:
			break;
	}
}

if (prevURL && nextURL) {
	window.addEventListener('keyup', onKeyUp);
}
