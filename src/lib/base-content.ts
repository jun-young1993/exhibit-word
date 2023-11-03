

import EventEmitter from "events";
import { Camera, Mesh, Renderer, Scene, World, camera, renderer, scene, world, event as ExibitEvent } from "./common";
import {EventNames} from "interfaces/content-parameter.interface";
import {Vec3, Box, Body} from 'cannon-es'
import {threeVector3FromCannonVec3} from "utills/convert";






export default class BaseContent {
	readonly world: World = world;
	readonly scene: Scene = scene;
	readonly camera: Camera = camera;
	readonly renderer: Renderer = renderer;
	readonly event: EventEmitter = ExibitEvent;
	protected body!: Body;

	constructor() {

	}


	protected cannon(
		box:Vec3,
		body: {
			mass: number,
			position: Vec3
		},
		mesh: Mesh
	){
		const boxShape = new Box(
			box
		);
		body.mass *= 10000;
		this.body = new Body(body);
		this.body.addShape(boxShape);

		this.world.addBody(this.body);

		this.animationLoop(() => {
			// console.log(this.body.position);
			mesh.position.copy(threeVector3FromCannonVec3(this.body.position));
			// @ts-ignore
			mesh.quaternion.copy(this.body.quaternion);
		})

	}

	protected setScene(mesh: Mesh): void
	{
		this.scene.add(mesh);
	}

	public animationLoop(callback: (delta: number, time: number) => void){
		this.event.on(EventNames.AnimationLoop,callback)
	}







}