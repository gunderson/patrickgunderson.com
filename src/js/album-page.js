let audioPlayer = document.querySelector('audio');
let tracks = document.querySelectorAll('.tracks li')

audioPlayer.addEventListener('play', onPlay);
audioPlayer.addEventListener('pause', onPlay);
audioPlayer.addEventListener('ended', onComplete);

tracks.forEach(el => {
    el.addEventListener('click', onTrackClick);
});

audioPlayer.src = tracks[0].dataset.src;
let currentTrack = tracks[0];

function onTrackClick(event){
    loadTrack(event.target);
}

function loadTrack(el) {
    let src = el.dataset.src;
    audioPlayer.src = src;
    currentTrack = el
    audioPlayer.play();
}

function onComplete(event){
    // play next
    let next = null;
    let done = false;
    tracks.forEach((el, index) => {
        if (done) return;
        if(audioPlayer.src.includes(el.dataset.src)){
            if (index < tracks.length - 1){
                next = tracks[index + 1];
                loadTrack(next);
                done = true;
            } else {
                markPlaying(null)
            }
        }
    });
}

function onPlay(event){
    markPlaying(currentTrack);
}
function onPause(event){
    // markPlaying(null);
}

function markPlaying(currentTrack){
    tracks.forEach(el => {
        if (el != currentTrack){
            el.classList.remove("playing");
        } else {
            el.classList.add("playing");
        }
    });
}