

import EventEmitter from "events";
import { Camera, Geometry, Mesh, Renderer, Scene, World, camera, renderer, scene, world } from "./common";
import { BufferGeometry } from "three";

export interface BaseContentInterface {
	readonly world: World,
	readonly scene: Scene,
	readonly camera: Camera,
	readonly renderer: Renderer,
	createMesh(): Mesh
	
}
export default class BaseContent {
	readonly world: World = world;
	readonly scene: Scene = scene;
	readonly camera: Camera = camera;
	readonly renderer: Renderer = renderer;
	readonly event: EventEmitter = new EventEmitter();
	private mesh!: Mesh;
	constructor() {
		this.setSceen();
		
	}
	
	createMesh(): Mesh 
	{
		throw new Error("CreateMesh Method not implemented.");
	}

	public getMesh(): Mesh
	{	
		if(!this.mesh){
			this.mesh = this.createMesh();
		}

		return this.mesh;
	}

	private getMeshPositon(){
		return this.getMesh().position;
	}

	private getGeometry()
	{
		return this.getMesh().geometry;
	}

	private getGeometryParameter(){
		return this.getGeometry().parameter;
	}

	public cannon(){
		console.log(this.mesh);
		const meshPosition = this.getGeometry();
		const x = meshPosition.x;
		const y = meshPosition.y;
		const z = meshPosition.z;
		const boxShape = new CANNON.Box(new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2));
		// const boxBody = new CANNON.Body({mass: 1});

		// boxBody.addShape(boxShape);
		// boxBody.position.set(floorPositionX,floorPositionY,floorPositionZ);
		// world.addBody(boxBody);
	}

	private setSceen(): void
	{	
		this.scene.add(this.getMesh());
	}


	private emit(eventName: string | symbol, ...args: any[]): void
	{
		if(!this.event.emit(eventName,args)){
			throw new Error(`Event emission failed for event: ${eventName.toString()}`);
		};
	}


}