// ------------------------------------------------------------------------
// get a list of images that are defined in the HTML

let heroImageNodes = document.querySelectorAll(".hero .images img");
let heroImages = []
heroImageNodes.forEach(img => heroImages.push(img.src));

// ------------------------------------------------------------------------
// fade loop

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
	frontLevel = 0;
	rearElement.style.backgroundImage = frontElement.style.backgroundImage;
	// delay hiding the element to fix flash between the image switch
	setTimeout(()=> {frontElement.style.opacity = 0;} , 100);
	clearInterval(intervalAnimationId);
}

function startTransition(){
	++currentIndex;
	if(currentIndex >= heroImages.length){
		currentIndex = 0;
	}
	frontElement.style.backgroundImage = `url("${heroImages[currentIndex]}")`;
	intervalAnimationId = setInterval(fadeUp, 16);
}

// ------------------------------------------------------------------------
// control

window.addEventListener("focus", startHeroCycle);
window.addEventListener("blur", pauseHeroCycle);

function startHeroCycle(){
	if (intervalLoopId){
		return;
	}
	intervalLoopId = setInterval(startTransition, 8000);
}

function pauseHeroCycle(){
	clearInterval(intervalLoopId);
	intervalLoopId = null;
}

startHeroCycle()