let rootElement = document.querySelector('html');
let videoList = [];
let videoNodes = document.querySelectorAll("video");
videoNodes.forEach(element => videoList.push(element));
let prevActiveElement;

function mediaBlock(element){
    return this;
}

function pauseAllVideos(){
    videoList.forEach(vid => {
        vid.pause();
    });
}

function loadAndPlay(element){
    element.src = element.dataset.source;
    element.setAttribute("autoplay", true);
    element.play();
}

function getElementNearestActiveLocation(activeLocation){

    //TODO: move evaluation point to center of video node instead of top
    let leaderMid = videoList[0].getBoundingClientRect().top + (videoList[0].parentElement.offsetHeight  / 2)
    let leaderTopDelta = Math.abs(activeLocation - leaderMid);
    let nearestElement = videoList.reduce((leader, vid)=>{
        let vidMid = vid.getBoundingClientRect().top + (vid.parentElement.offsetHeight  / 2);
        console.log(vidMid)
        let vidTopDelta = Math.abs(activeLocation - vidMid);
        if (vidTopDelta <= leaderTopDelta){
            leaderTopDelta = vidTopDelta;
            return vid;
        }
        return  leader;
    }, videoList[0]);

    return nearestElement;
}

function onScroll(){
    console.log("scroll")
    let activeElement = getElementNearestActiveLocation(0.4 * window.innerHeight);
    if (activeElement != prevActiveElement){
        prevActiveElement = activeElement;
        pauseAllVideos();
        loadAndPlay(activeElement);
    }
}
// TODO: force click on an element before running the scroll listener, to start playing
window.addEventListener('scroll', onScroll);