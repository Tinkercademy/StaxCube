window.cam = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight);
cam.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
cam.dampingFactor = 0.25;
cam.screenSpacePanning = false;
cam.minDistance = 0;
cam.maxDistance = 500;

window.world = new THREE.Scene();
world.background = new THREE.Color(0x000000);

window.renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

window.controls = new THREE.OrbitControls(cam, renderer.domElement);

window.addEventListener("resize",()=>{
	renderer.setSize(window.innerWidth,window.innerHeight);
	cam.aspect = window.innerWidth/window.innerHeight;
	cam.updateProjectionMatrix();
});

window.getEventXY = function(e){
	let mouse = new THREE.Vector2();
	if(e.type == 'click'){
		mouse.x = e.clientX/window.innerWidth*2-1;
		mouse.y = -e.clientY/window.innerHeight*2+1;
	}else if(e.type == "touchend"){
		mouse.x = e.changedTouches[0].clientX/window.innerWidth*2-1;
		mouse.y = -e.changedTouches[0].clientY/window.innerHeight*2+1;
	}
	return mouse;
}

window.addEventListener("beforeunload",save);
function save(){
	if(window['keyframes']) localStorage.setItem("keyframes",JSON.stringify(keyframes));
	//^Actually have save files instead... (save more stuff, reload/unload saves)
}

window.cube = new Cube();
world.add(cube);
world.add(cam);
cam.position.set(10,10,10);
cam.lookAt(cube.position);

window.playProg = undefined;
let frameNo = -1;
let notPaused = true;
function animate() {
	requestAnimationFrame( animate );
	if(frameNo != -1 && notPaused){
		let rendered = animframes[frameNo];
		paintedObj.setColor(rendered);
		playProg.style.left = frameNo/maxFrames*100 + "%";
		playProg.style.display = "inline-block";
		playProg.value = frameNo;
		frameNo = frameNo + 1;
		console.log("plink");
		if(frameNo >= maxFrames){
			frameNo = -1;
			playProg.style.display = "none";
			console.log("finished");
		}
		
	}
	//cube.rotation.y -= 0.01;
	renderer.render( world, cam );
	if(frameNo != -1 && notPaused) paintedObj.resetColor();
}
animate();