let pages = document.getElementsByClassName("page");

document.getElementById("paintBtn").addEventListener("click",()=>changePage(pages.colorPg));
document.getElementById("frameBtn").addEventListener("click",()=>changePage(pages.framePg));
document.getElementById("playBtn").addEventListener("click",()=>frameNo = 0);
document.getElementById("pauseBtn").addEventListener("click",()=>notPaused = !notPaused);

window.changePage = function(nextPg){
	let activePg = document.getElementsByClassName("active")[0];
	activePg.classList.remove("active");
	window.dispatchEvent(new CustomEvent('pgexit', {detail:activePg}));
	
	nextPg.classList.add("active");
	window.dispatchEvent(new CustomEvent('pgenter', {detail:nextPg}));
};


window.btnBack = function(){
	changePage(pages.framePg);
}
for(let btn of document.getElementsByClassName("backBtn")) btn.addEventListener("click", () => btnBack());

window.addEventListener("pgenter",e => {
	if(e.detail==pages.colorPg){
		window.addEventListener("click",paint);
		window.addEventListener("touchend",paint);	
	}
});
window.addEventListener("pgexit",e => {
	if(e.detail==pages.colorPg){
		window.removeEventListener("click",paint);
		window.removeEventListener("touchend",paint);	
	}
});

window.addEventListener("pgenter",e => {
	if(e.detail==pages.framePg){
		window.addEventListener("mousedown",barClick);
	}
});
window.addEventListener("pgexit",e => {
	if(e.detail==pages.framePg){
		window.removeEventListener("mousedown",barClick);	
	}
});

pages.framePg.classList.add("active");
changePage(pages.framePg);