let audioElements = document.querySelectorAll('audio');

audioElements.forEach(el => {
    el.addEventListener('play', onPlay);
    el.addEventListener('ended', onComplete);
});

function onComplete(event){
    // play next
    let next = null;
    audioElements.forEach((el, index) => {
        if(el === event.currentTarget){
            if (index < audioElements.length - 1){
                next = audioElements[index + 1];
                next.play();
            }
        }
    });
}

function onPlay(event){
    pauseOthers(event.currentTarget);
}

function pauseOthers(playingElement){
    audioElements.forEach(el => {
        if (el != playingElement){
            el.pause();
        }
    });
}