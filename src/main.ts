import * as THREE from 'three'
import {
    Box3,
    BoxGeometry, Clock,
    Material,
    MathUtils,
    Mesh,
    MeshPhongMaterial, MeshStandardMaterial,
    Raycaster,
    Scene,
    TextureLoader,
    Vector2, Vector3
} from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import dat from 'dat.gui';
import * as CANNON from 'cannon-es';
import {threeVector3FromCannonVec3} from "utills/convert";
import {
    camera,
    canvas,
    initialValue,
    renderer,
    scene,
    textureLoader,
    world,
    event as ExibitEvent,
    mouse, gltfLoader
} from 'lib/common';


import {EventNames} from "interfaces/content-parameter.interface";

import Floor from 'contents/floor';
import Player from "contents/player";
import boot from "utills/boot";
import Wall from "contents/wall";


const isDev = true;



boot();





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

const player = new Player();

// const wall = new Wall();

gltfLoader.load(
    './gltf/exhibit.glb',
    glb => {
        const mesh = glb.scene.children[0];

        // const boundingBox = new Box3().setFromObject(mesh);
        //
        // const size = new Vector3();
        // boundingBox.getSize(size);
        // console.log(size);
        // mesh.position.set(0,10, 0);

        glb.scene.scale.set(20,5,20);
        scene.add(glb.scene);

    }
)







































// // 그리기
// const clock = new THREE.Clock();
// function draw() {
//     const delta = clock.getDelta();
//     const time = clock.getElapsedTime();
//
//
//
//
//
//
//     // 캐릭터 이동
//     work(delta);
//
//     // cannon-js update
//     world.step(1/60);
//     // floorMesh.position.copy(threeVector3FromCannonVec3(boxBody.position));
//
//
//     camera.updateMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 사이즈 변경될때마다 업데이트
//     renderer.render(scene, camera);
//     renderer.setAnimationLoop(draw);
// }


















const clock: Clock = new Clock();
function animationLoop(){
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    let cannonStepTime = 1/60;
    if (delta < 0.012) cannonStepTime = 1/120;
    world.step(cannonStepTime);

    ExibitEvent.emit(EventNames.AnimationLoop, delta, time);



    camera.updateMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 사이즈 변경될때마다 업데이트
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animationLoop);
}
animationLoop();