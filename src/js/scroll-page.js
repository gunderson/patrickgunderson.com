let rootElement = document.querySelector('html');
let videoList = [];
let videoNodes = document.querySelectorAll("video");
videoNodes.forEach(element => videoList.push(element));
let prevActiveElement;
let isClicked = false;

function mediaBlock(element) {
    return this;
}

function pauseAllVideos() {
    videoList.forEach(vid => {
        vid.pause();
    });
}

function loadAndPlay(element) {
    element.src = element.dataset.source;
    element.setAttribute("autoplay", true);
    element.play();
}

function getElementNearestActiveLocation(activeLocation) {

    //TODO: move evaluation point to center of video node instead of top
    let leaderMid = videoList[0].getBoundingClientRect().top + (videoList[0].parentElement.offsetHeight / 2)
    let leaderTopDelta = Math.abs(activeLocation - leaderMid);
    let nearestElement = videoList.reduce((leader, vid) => {
        let vidMid = vid.getBoundingClientRect().top + (vid.parentElement.offsetHeight / 2);
        let vidTopDelta = Math.abs(activeLocation - vidMid);
        if (vidTopDelta <= leaderTopDelta) {
            leaderTopDelta = vidTopDelta;
            return vid;
        }
        return leader;
    }, videoList[0]);

    return nearestElement;
}

function onScroll() {
    // this is inelegant b/c when you click through from a different page, the browser counts that as a page interaction
    if (!isClicked) return;
    let activeElement = getElementNearestActiveLocation(0.4 * window.innerHeight);
    if (activeElement != prevActiveElement) {
        prevActiveElement = activeElement;
        pauseAllVideos();
        loadAndPlay(activeElement);
    }
}

window.addEventListener("mousedown", () => {
    isClicked = true;
})
window.addEventListener("touchstart", () => {
    isClicked = true;
})

// handle videoPlay buttons

let videoElements = document.querySelectorAll('video');
let overlayElements = document.querySelectorAll('.play-button-overlay');

videoElements.forEach(videoElement => {
    videoElement.addEventListener('play', onPlay);
    videoElement.addEventListener('pause', onPause);
    videoElement.addEventListener('click', onClickVideo);
});
overlayElements.forEach(overlayElement => {
    overlayElement.addEventListener('click', onClickOverlay);
})

function onPlay(e) {
    e.currentTarget.parentElement.querySelector('.play-button-overlay').style.display = "none";
    e.currentTarget.parentElement.querySelector('img').style.visibility = "hidden";
}

function onPause(e) {
    e.currentTarget.parentElement.querySelector('.play-button-overlay').style.display = "none";
}

function onClickOverlay(e) {
    e.stopPropagation();
    e.preventDefault();
    let videoElement = e.currentTarget.parentElement.querySelector('video');
    loadAndPlay(videoElement);
    overlayElements.forEach(overlayElement => {
        overlayElement.style.display = "none";
    })
}

function onClickVideo(e) {
    videoEleemtns.forEach(videoElement => {
        videoElement.pause();
    });

}



// TODO: force click on an element before running the scroll listener, to start playing
window.addEventListener('scroll', onScroll);