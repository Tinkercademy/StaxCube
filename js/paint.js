let colorPicker = document.getElementById("hex");
let isDragging = false;
let paintedObj = window.cube;

function paint(e){
	if(isDragging){
		isDragging = false;
		return true;
	}
	let raycaster = new THREE.Raycaster();
	let mouse = getEventXY(e);
	raycaster.setFromCamera(mouse,cam);
	let intersects = raycaster.intersectObjects(paintedObj.children);
	if(intersects.length > 0){
		let curFrame = getEditFrame();
		intersects[0].object.material.color.set(colorPicker.value);
		curFrame.edits.push({
			type:'paint',
			idx:intersects[0].object.index,
			color:colorPicker.value
		});
	}
}

colorPicker.parentElement.style.backgroundColor = colorPicker.value;
colorPicker.addEventListener('change',()=>{colorPicker.parentElement.style.backgroundColor = colorPicker.value});
//Created custom rotateEvent in orbitControls script for sanity reasons.
controls.addEventListener('rotate',()=>{isDragging = true});

