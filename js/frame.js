//Find alternative low risk way
Array.prototype.move = function(old,to){
	if(to == old) return;
	this[to] = this.slice(old,old+1)[0]; //Figure out how to settle overrides/update for them
	delete this[old]; //Prevents reindexing
}

let bar = document.getElementById("framebar");
let maxFrames = 700;
window.keyframes = JSON.parse(localStorage.getItem("keyframes"),(k,v)=>{
	if(v == null || v == "null") return undefined;
	return v;
});
if(keyframes == undefined){
	keyframes = [];
	keyframes[0] = {
		idx:0,
		edits:[]
	};
	keyframes[maxFrames] = {
		idx:maxFrames,
		edits:[]
	};
}
let curFrame = 0;
//let paintedObj = window.cube;

//CANNOT SPLICE NOW FOR SOME REASON (so the memorization has been disabled temporarily)
window.curFrame = keyframes[0];
let animframes = new Proxy([],{
	get:function(obj,idx){
		if(keyframes[idx]){
			showEdits(keyframes[idx]);
			let matcol = paintedObj.getColor();
			paintedObj.resetColor();
			//obj[idx] = paintedObj.getColor();
			//return obj[idx];
			return matcol;
		}
		let prev = 0;
		let isDone = false;
		let curF = undefined;
		keyframes.forEach(f => {
			if(idx < parseInt(f.idx) && idx > parseInt(prev) && !isDone){
				let alpha = (idx-prev)/(f.idx-prev);
				curF = animframes[prev];
				let tgt = animframes[f.idx];
				paintedObj.iterall(bulb => {
					let i = bulb.index;
					curF[i.x][i.y][i.z] = curF[i.x][i.y][i.z].lerpHSL(tgt[i.x][i.y][i.z],alpha);
				});
				isDone = true;
			}
			prev = f.idx;
		});
		if(curF){
			//obj[idx] = curF;
			return curF;
		}else{
			return animframes[prev];
		}
	}
});
function resetBetweenFrames(){
	//animframes.splice(0,animframes.length);
}

function barClick(e){
	let rect = bar.getBoundingClientRect();
	let xpos = e.clientX-rect.left;
	let ypos = e.clientY-rect.top;
	if(ypos<rect.height && ypos>=0 && xpos < rect.width){
		let percent = xpos/rect.width;
		let blip = createBlip(percent);
		blip.checked = true;
		let cur = createFrame(parseInt(blip.value));
		resetBetweenFrames();
		setEditFrame(blip.value);
	}
}

function getXpos(e){
	let rect = bar.getBoundingClientRect();
	let xpos = e.clientX-rect.left;
	let percent = xpos/rect.width;
	let idx = Math.floor(percent*maxFrames);
	return [percent,idx];
}
/*
let cover = document.getElementById("temp");
cover.style.left = rect.left + "px";
cover.style.top = rect.top + "px";
cover.style.height = rect.height + "px";
*/

/*
	[].splice(idx,1)
	[].splice(0,[].length)
*/

function createFrame(idx){
	let f = {
		idx:idx,
		edits:[]
	};
	keyframes[idx] = f;
	return keyframes[idx];
}

function setEditFrame(idx){
	console.log(idx);
	curFrame = idx;
	paintedObj.resetColor();
	showEdits(getEditFrame());
}

function showEdits(f){
	f.edits.forEach(e => {
		if(e.type == "paint"){
			paintedObj.bulbs[e.idx.x][e.idx.y][e.idx.z].material.color.set(e.color);
		}
	});
}

window.getEditFrame = function(){
	return keyframes[curFrame];
}

function createBlip(percent){
	let idx = Math.floor(percent*maxFrames);
	let blip = document.createElement('input');
	blip.name = "blip";
	blip.value = idx;
	blip.type = 'radio';
	blip.classList.add('blip');
	blip.style.left = percent*100 + "%";
	bar.appendChild(blip);
	blip.addEventListener("mousedown",onBlipdown);
	blip.addEventListener("mousemove",onBlipmove);
	blip.addEventListener("mouseup",onBlipup);
	//blip.addEventListener("touchstart",onBlipdown);
	//blip.addEventListener("touchmove",onBlipmove);
	//blip.addEventListener("touchend",onBlipup);
	return blip;
}

function onBlipdown(e){
	e.target.blipdown = true;
	e.stopPropagation();
}

//Flags used so far: .dragging .isBounced .isExtending
function onBlipmove(e){
	if(e.target.blipdown){
		e.target.dragging = true;
		e.target.style.zIndex = 1000; //Necessary to pass another element when dragging
		let xpos = getXpos(e);
		e.target.style.left = xpos[0]*100 + "%";
	}
}

function onBlipup(e){
	if(e.target.dragging){
		let xpos = getXpos(e);
		//Create own update function?
		keyframes.move(e.target.value,xpos[1]);
		keyframes[xpos[1]].idx = xpos[1];
		resetBetweenFrames();
		//End move
		e.target.value = xpos[1];
		loadKeyframes();
		e.target.dragging = false;
	}
	e.target.style.zIndex = 0;
	e.target.blipdown = false;
	setEditFrame(e.target.value);
	e.stopPropagation();
}

function loadKeyframes(){
	Array.from(bar.children).forEach(elem => bar.removeChild(elem));
	maxFrames = keyframes[keyframes.length-1].idx;
	keyframes.forEach(f=>{
		createBlip(f.idx/maxFrames);
	});
	//See rest in main (TEMP TODO CLEAN)
	playProg = document.createElement('input');
	playProg.name = "play";
	playProg.value = -100;
	playProg.type = 'radio';
	playProg.classList.add('blip');
	playProg.style.backgroundImage = "url('img/play.svg')";
	playProg.style.left = "0%";
	playProg.style.display = "none";
	playProg.style.zIndex = 1001;
	playProg.addEventListener("mousedown",e => {
		//Isolate into its own function along with barClick
		let blip = createBlip(playProg.value/maxFrames);
		blip.checked = true;
		let cur = createFrame(parseInt(blip.value));
		resetBetweenFrames();
		setEditFrame(blip.value);
		e.stopPropagation();
	});
	bar.appendChild(playProg);
	resetBetweenFrames();
}
loadKeyframes();
setEditFrame(0);
document.getElementById("deleteBtn").addEventListener("click",()=>{
	delete keyframes[curFrame];
	loadKeyframes();
});
