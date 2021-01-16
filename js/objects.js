THREE.Vector3.prototype.subScalar = function(x){
	return this.sub(new THREE.Vector3(x,x,x));
}

class Bulb extends THREE.Mesh{
	constructor(number,index,anchor){
		let size = 0.6;
		let geometry = new THREE.BoxGeometry(size,size,size);
		let material = new THREE.MeshBasicMaterial({color: 0x000000,transparent:true,opacity:0.5});
		super(geometry,material);
		
		let edges = new THREE.EdgesGeometry(geometry);
		let line_mat = new THREE.LineBasicMaterial({color:0xFFFFFF});
		let lines = new THREE.LineSegments(edges,line_mat);
		this.add(lines);
		
		this.size = size;
		this.bound = 1.0;
		
		this.index = index;
		this.number = number;
		this.anchor = anchor;
		
		this.position.copy(this.index.clone().subScalar(this.anchor).multiplyScalar(this.bound));
	}
	
	update(){
		this.position.copy(this.index.clone().subScalar(this.anchor).multiplyScalar(this.bound));
	}
}

class Cube extends THREE.Group{
	constructor(){
		super();
		this.length = 4;
		let anchor = this.length/2 +1.0/2 -1; //1.0/2 based on this.bound of bulb, -1 is due to counting from 0
		
		this.bulbs = [];
		for(let x = 0; x < this.length; x++){
			let plane = [];
			for(let y = 0; y < this.length; y++){
				let row = [];
				for(let z = 0; z < this.length; z++){
					let b = new Bulb(this.length,new THREE.Vector3(x,y,z),anchor);
					row.push(b);
					this.add(b);
				}
				plane.push(row);
			}
			this.bulbs.push(plane);
		}
	}
	
	iterall(func){
		for(let x = 0; x < this.length; x++){
			for(let y = 0; y < this.length; y++){
				for(let z = 0; z < this.length; z++){
					func(this.bulbs[x][y][z]);
				}
			}
		}	
	}
	
	resetColor(){
		this.iterall(bulb => bulb.material.color.set(0x000000));
	}
	
	getColor(){
		let color = [];
		for(let x = 0; x < this.length; x++){
			let plane = [];
			for(let y = 0; y < this.length; y++){
				let row = [];
				for(let z = 0; z < this.length; z++){
					row.push(this.bulbs[x][y][z].material.color.clone());
				}
				plane.push(row);
			}
			color.push(plane);
		}
		return color;
	}
	
	setColor(mat){
		this.iterall(bulb => bulb.material.color.set(mat[bulb.index.x][bulb.index.y][bulb.index.z]));
		
	}
}