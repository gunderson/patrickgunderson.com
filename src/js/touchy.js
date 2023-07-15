window.addEventListener('touchstart', addTouchClass);

function addTouchClass(){
	document.querySelector("html").classList.add("touch");
	window.removeEventListener('touchstart', addTouchClass);
}