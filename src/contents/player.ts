import Content from "lib/content";
import {BoxGeometry, Mesh, MeshPhongMaterial, Raycaster, Vector3} from "three";
import {camera, event as ExibitEvent, mouse, renderer, scene} from "lib/common";
import KeyController from "lib/key.controller";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import * as THREE from "three";
import {cannonVec3FromThreeVector3, threeVector3FromCannonVec3} from "utills/convert";
import {Vec3} from "cannon-es";
import CrossHairItem from "contents/items/cross-hair.item";
import Swap from "contents/items/swap";
// import {Mesh} from "lib/common";

class CrossHair extends Mesh {
    private raycaster: Raycaster = new Raycaster();
    public name: string = 'cross-hair';

    constructor() {
        super(
            new THREE.CircleGeometry(0.02, 32),
            new THREE.MeshBasicMaterial({ color: '0x000000' })
        );
        this.position.z = -2;
        this.move();
        this.click();
        camera.add(this);
    }

    move(){
        document.addEventListener('mousemove', (e:MouseEvent) => {
            e.preventDefault();

            mouse.x = this.position.x;
            mouse.y = this.position.y;
            this.raycaster.setFromCamera(mouse,camera);
        });

    }

    click(){
        document.addEventListener('click',(e: MouseEvent) => {
            e.preventDefault();

            // raycaster update
            this.raycaster.setFromCamera(mouse,camera);

            // 객체감지
            const intersects = this.raycaster.intersectObjects(scene.children);


            for(const intersect of intersects){
                // 임시
                if(intersect.object.uuid === this.uuid){
                    continue;
                }

                console.log('clicked point', intersect.point);


                // // 새로운 객체 생성
                // const newObjectGeometry = new THREE.BoxGeometry(10, 10, 10); // 예시로 상자 모양 객체를 생성
                // const newObjectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 예시로 빨간색 재질 사용
                // const newObject = new THREE.Mesh(newObjectGeometry, newObjectMaterial);
                //
                //
                //
                // // 새로운 객체의 위치를 클릭한 오브젝트 앞쪽으로 조정
                // const distance = 20; // 조정할 거리 (원하는 위치에 따라 조절)
                //
                // newObject.position.set(
                //     intersect.point.x,
                //     intersect.point.y,
                //     intersect.point.z + 10
                // );
                //
                // // 씬에 새로운 객체를 추가
                // scene.add(newObject);

                // 필요에 따라 새로운 객체를 회전 또는 크기를 조정할 수 있습니다.
                // newObject.rotation.set(0, 0, 0); // 회전 설정
                // newObject.scale.set(1, 1, 1); // 크기 설정
                // console.log(clickedObject.name);
                break;
            }


        });
    }
}

export default class Player extends Content {
    private controls: PointerLockControls = new PointerLockControls(camera, renderer.domElement);
    private items: Swap = new Swap();
    private moveSpeed: number = 100;
    constructor() {
        super({
            height: 50,
            width: 100,
            depth: 100,
            x: camera.position.x,
            z: camera.position.z,
            mass:500
        });
        this.playerControls();

        this.move()


    }

    playerControls(){

        this.controls.domElement.addEventListener('click',() => {

            this.controls.lock();
        });
        scene.add(this.controls.getObject());
    }

    move(){
        this.animationLoop((delta) => {
            const deltaMoveSpeed = this.moveSpeed  * delta;
            const keys = KeyController.getKeys();


            if(keys['KeyW'] === true || keys['ArrowUp'] === true){
                this.controls.moveForward(deltaMoveSpeed);
            }
            if(keys['KeyS'] === true || keys['ArrowDown'] === true){
                this.controls.moveForward(-deltaMoveSpeed);
            }

            if(keys['KeyD'] === true || keys['ArrowRight'] === true){
                this.controls.moveRight(deltaMoveSpeed);
            }
            if(keys['KeyA'] === true  || keys['ArrowLeft'] === true){
                this.controls.moveRight(-deltaMoveSpeed);
            }
            this.controls.camera.position.y = this.body.position.y;
            this.body.position.copy(
                cannonVec3FromThreeVector3(this.controls.camera.position)
            );
        })
    }

    createMesh(): Mesh {
        const geometry = new BoxGeometry(this.width, this.height, this.depth);
        const material = new MeshPhongMaterial({

        });

        const mesh = new Mesh(geometry, material);

        return mesh;
    }
}