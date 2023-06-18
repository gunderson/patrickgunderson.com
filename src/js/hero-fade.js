let heroImageNodes = document.querySelectorAll(".hero .images img");
let heroImages = []
heroImageNodes.forEach(img => heroImages.push(img.src));

console.log(heroImages)


let images = [
    "/images/hero/composition-72.jpg",
    "/images/hero/ablaze-line.png",
    "/images/hero/ablaze-rings.png",
    "/images/hero/composition-52.jpg",
    "/images/hero/interference.jpg",
]

let currentIndex = 0;

let frontLevel = 0;

let intervalAnimationId;
let intervalLoopId;

let frontElement = document.querySelector('.bg-transition');
let rearElement = document.querySelector('.bg');

function fadeUp(){
    frontLevel += .5 * (1/60);
    if (frontLevel >= 1){
        completeTransition();
        return;
    }
    frontElement.style.opacity = frontLevel;
}

function completeTransition(){
    // console.log("completeTransition");
    frontLevel = 0;
    rearElement.style.backgroundImage = frontElement.style.backgroundImage;
    // delay to fix flash between the switch
    setTimeout(()=> {frontElement.style.opacity = 0;} , 100);
    clearInterval(intervalAnimationId);
}

function startTransition(){
    // console.log("startTransition");

    ++currentIndex;
    if(currentIndex >= heroImages.length){
        currentIndex = 0;
    }
    frontElement.style.backgroundImage = `url("${heroImages[currentIndex]}")`;
    intervalAnimationId = setInterval(fadeUp, 16);
}

intervalLoopId = setInterval(startTransition, 8000);