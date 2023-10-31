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
import {threeVector3FromCannonVec3} from "utills/convert";
import { camera, canvas, initialValue, renderer, scene, textureLoader, world } from 'lib/common';
import BaseContent from 'lib/base-content';
import Floor from 'contents/floor';

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

initialValue();





// ================ Light
// spotLight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;









// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
ambientLight.position.set(0,1000, 0);
scene.add(ambientLight);

// ===========MESHES

// Floor


    // ===========MESHES
    // Floor
const floor = new Floor();
floor.cannon();

// const boxShape = new CANNON.Box(new CANNON.Vec3(floorWidth/2, floorHeight/2, floorDepth/2));
// const boxBody = new CANNON.Body({mass: 1});

// boxBody.addShape(boxShape);
// boxBody.position.set(floorPositionX,floorPositionY,floorPositionZ);
// world.addBody(boxBody);

interface wallInterface {
    height?: number,
    width?: number,
    depth?: number,
    x?: number,
    z?: number
}
function wall(info?: wallInterface){
    const marbleTexture = textureLoader.load('./image/marble-640.jpg');
    
    const height = info?.height ?? 50;
    const width = info?.width ?? 200;
    const depth = info?.depth ?? 20;
    const x =  info?.x ?? 0;
    const y = height/2;
    const z = info?.z ?? 0;

    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshPhongMaterial({
        map: marbleTexture,
        color: 0xffffff, // 바닥 기본 색상
        shininess: 10, // 빛을 반사하는 정도 (조절 가능)
        reflectivity: 0.3, // 빛을 얼마나 반사할지 (조절 가능)
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    dotGuiAdd(mesh.position, '');
    scene.add(mesh);
}

wall({
    z: -50
});

wall({
    z: -100
});






























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






    // 캐릭터 이동
    work(delta);

    // cannon-js update
    world.step(1/60);
    // floorMesh.position.copy(threeVector3FromCannonVec3(boxBody.position));


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
