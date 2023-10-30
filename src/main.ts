import * as THREE from 'three'
import {
    BoxGeometry,
    Material,
    MathUtils,
    Mesh,
    MeshPhongMaterial, MeshStandardMaterial,
    Raycaster,
    Scene,
    TextureLoader,
    Vector2
} from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import dat from 'dat.gui';
import * as CANNON from 'cannon-es';
import {threeVector3FromCannonVec3} from "./lib/convert";

const isDev = true;
const datGui = new dat.GUI();
const dotGuiAdd = function (object:object,name:string) : void
{

    if(isDev) {
        // @ts-ignore
        datGui.add(object, "x", -1000, 1000, 0.1).name(name + ' x');
        // @ts-ignore
        datGui.add(object, "y", -1000, 1000, 0.1).name(name + ' y');
        // @ts-ignores
        datGui.add(object, "z", -1000, 1000, 0.1).name(name + ' z');
        
    }
}

//Canvas
const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;
// ========== GLTF
const gltfLoader = new GLTFLoader();
// ========== textureLoader
const textureLoader = new TextureLoader();

// cannon world
const world = new CANNON.World();
world.gravity.set(0, -9.81, 0); // 중력 설정



// ================ Light
// spotLight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new Scene();
scene.background = new THREE.Color('#49B0F5');

// Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const gridHelper  = new THREE.GridHelper(5);
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = 4;
camera.position.y = 19;
camera.position.z = 30;
scene.add(camera);


// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
ambientLight.position.set(0,1000, 0);
scene.add(ambientLight);

// ===========MESHES

// Floor
// const floorHeight = 1;
// const floorWidth = 800;
// const floorDepth = 800;
// const floorPositionX = 0;
// const floorPositionY = 0;
// const floorPositionZ = 0;
// const floorGeometry = new BoxGeometry(floorWidth, floorHeight, floorDepth);
// const floorMaterial = new MeshPhongMaterial({
//     color: 0xffffff,
//     shininess: 10, // 빛을 반사하는 정도 (조절 가능)
//     reflectivity: 0.3, // 빛을 얼마나 반사할지 (조절 가능)
// });
// const floorMesh = new Mesh(floorGeometry, floorMaterial);
// floorMesh.position.set(floorPositionX, floorPositionY, floorPositionZ);
// scene.add(floorMesh);
//
// const floorShape = new CANNON.Box(
//     new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2)
// );
// const floorBody = new CANNON.Body({
//     mass: 0,
//     position: new CANNON.Vec3(floorPositionX, floorPositionY, floorPositionZ)
// });
// floorBody.addShape(floorShape);
// world.addBody(floorBody);
//
//
// const frontWall = floorMesh.clone();
// frontWall.rotation.set(MathUtils.degToRad(90),0,0);
// frontWall.position.set(0,0,-(floorDepth/2));
// scene.add(frontWall);
// const frontWallShape = new CANNON.Box(
//     new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2)
// );
// const frontWallBody = new CANNON.Body({
//     mass: 0,
//     position: new CANNON.Vec3(floorPositionX, floorPositionY, floorPositionZ)
// });
// floorBody.addShape(frontWallShape);
// world.addBody(frontWallBody);
//
// const backWall = floorMesh.clone();
// backWall.rotation.set(MathUtils.degToRad(90),0,0);
// backWall.position.set(0,0,(floorDepth/2));
// scene.add(backWall);
// const backWallShape = new CANNON.Box(
//     new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2)
// );
// const backWallBody = new CANNON.Body({
//     mass: 0,
//     position: new CANNON.Vec3(floorPositionX, floorPositionY, floorPositionZ)
// });
// floorBody.addShape(backWallShape);
// world.addBody(backWallBody);
//
// const rightWall = floorMesh.clone();
// rightWall.rotation.set(0,0,MathUtils.degToRad(90));
// rightWall.position.set(floorWidth/2,0,0);
// scene.add(rightWall);
// const rightWallShape = new CANNON.Box(
//     new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2)
// );
// const rightWallBody = new CANNON.Body({
//     mass: 0,
//     position: new CANNON.Vec3(floorPositionX, floorPositionY, floorPositionZ)
// });
// floorBody.addShape(rightWallShape);
// world.addBody(rightWallBody);


gltfLoader.load(
    './gltf/basic-box-house.glb',
    gltf => {
        const mesh = gltf.scene.children[0];
        // @ts-ignore
        const material = mesh.material as MeshStandardMaterial;
        material.color.set(0xffffff);

        scene.add(mesh);

        dotGuiAdd(mesh.position, 'mesh position');
        dotGuiAdd(mesh.rotation, 'mesh rotation');
    }
);

















// 조준점 설정
const crossHairGeometry = new THREE.CircleGeometry(0.02, 32);
const crossHairMaterial = new THREE.MeshBasicMaterial({ color: '0x000000' });
const crossHairMesh = new THREE.Mesh(crossHairGeometry, crossHairMaterial);
crossHairMesh.position.z = -2; // 조준점의 거리 조절
camera.add(crossHairMesh);

// Controller
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());
controls.domElement.addEventListener('click',() => {
    controls.lock();
});



// Move Controller
let keys:Record<string, boolean> = {};
const moveSpeed:number = 300;
window.addEventListener('keydown', ({code}) => {

    keys[code] = true;
});
window.addEventListener('keyup', e => {
    delete keys[e.code];
});


function work(delta: number){
    const deltaMoveSpeed = moveSpeed  * delta;
    if(keys['KeyW'] === true || keys['ArrowUp'] === true){

        controls.moveForward(deltaMoveSpeed);
    }
    if(keys['KeyS'] === true || keys['ArrowDown'] === true){
        controls.moveForward(-deltaMoveSpeed);
    }

    if(keys['KeyD'] === true || keys['ArrowRight'] === true){
        controls.moveRight(deltaMoveSpeed);
    }
    if(keys['KeyA'] === true  || keys['ArrowLeft'] === true){
        controls.moveRight(-deltaMoveSpeed);
    }
}


// 그리기
const clock = new THREE.Clock();
function draw() {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    let cannonStepTime = 1/60;
    if (delta < 0.01) cannonStepTime = 1/120;
    world.step(cannonStepTime);

    // // 위치 카피
    // floorMesh.position.copy(
    //     threeVector3FromCannonVec3(floorBody.position)
    // );


    // 캐릭터 이동
    work(delta);

    // cannon-js update



    camera.updateMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 사이즈 변경될때마다 업데이트
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}

// raycaster
// Raycater
const raycaster = new Raycaster();
const mouse = new Vector2();


// events
document.addEventListener('mousemove',onMouseMove,false);
document.addEventListener('click',onClick,false);

function onMouseMove(event: MouseEvent){
    // event.preventDefault(); // 기존 동작 중지

    // mouse.x = (event.clientX/ window.innerWidth) * 2 - 1;
    // mouse.y = (event.clientX/ window.innerWidth) * 2 + 1;
    // console.log(mouse.x, mouse.y);
    mouse.x = crossHairMesh.position.x;
    mouse.y = crossHairMesh.position.y;
    // raycaster update
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    // 교차된 객체 하이라이트
    for (let i = 0; i < intersects.length; i++) {
        // @ts-ignore
        // intersects[i].object.material.color.set(0xff0000);
    }

}

function onClick(event: MouseEvent){
    event.preventDefault(); // 기존 동작 중지

    // raycaster update
    raycaster.setFromCamera(mouse, camera);

    // 객체 감지
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    for(const intersect of intersects){


        // 임시
        if(intersect.object.name === 'croos-hair-name'){
            continue;
        }
        
        console.log(intersect.object.name);
        break;
    }
}






draw();
