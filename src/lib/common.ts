import * as CANNON from 'cannon-es';
import EventEmitter from 'events';
import {
	Color,
	PCFSoftShadowMap,
	PerspectiveCamera as ThreePerspectiveCamera,
	Scene as ThreeScene,
	TextureLoader,
	WebGLRenderer as ThreeWebGLRenderer,
	BoxGeometry as ThreeBoxGeometry,
	Mesh as ThreeMesh, Vector2, Raycaster
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



/**
 * CANNON
 */
export type World = CANNON.World;
export const world = new CANNON.World();



/**
 * THREE
 */

export const gltfLoader = new GLTFLoader();

export const textureLoader = new TextureLoader();

export const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement; 

// Scene
export type Scene = ThreeScene;
export const scene = new ThreeScene();

// Camera
export type Camera = ThreePerspectiveCamera;
export const camera = new ThreePerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
    );

// Renderer
export type Renderer = ThreeWebGLRenderer;
export const renderer = new ThreeWebGLRenderer({
	canvas: canvas,
	antialias: true
});

export type Geometry = ThreeBoxGeometry;

export type Mesh = ThreeMesh;


export const initialValue = function(){
	world.gravity.set(0, -9.81, 0);

	scene.background = new Color('#49B0F5');
	scene.add(camera);
	
	camera.position.x = -300;
	camera.position.y = 10;
	camera.position.z = 400;
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;
}

export const event: EventEmitter = new EventEmitter();

export const mouse =  new Vector2();
export const raycaster = new Raycaster();

