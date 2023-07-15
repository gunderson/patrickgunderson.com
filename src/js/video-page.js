let videoElement = document.querySelector('video');
let overlayElement = document.querySelector('.play-button-overlay');

videoElement.addEventListener('play', onPlay);
videoElement.addEventListener('pause', onPause);
videoElement.addEventListener('click', onClickVideo);
overlayElement.addEventListener('click', onClickOverlay);

function onPlay(e){
	overlayElement.style.display = "none";
}

function onPause(e){
	overlayElement.style.display = "flex";
}

function onClickOverlay(e){
	videoElement.play();
}

function onClickVideo(e){
	videoElement.pause();
}