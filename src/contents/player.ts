import Content from "lib/content";
import {BoxGeometry, Mesh, MeshPhongMaterial, Raycaster, Vector2, Vector3} from "three";
import {camera, event as ExibitEvent, mouse, renderer, scene} from "lib/common";
import KeyController from "lib/key.controller";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import * as THREE from "three";
import {cannonVec3FromThreeVector3, threeVector3FromCannonVec3} from "utills/convert";
import {Vec3} from "cannon-es";
import CrossHairItem from "contents/items/cross-hair.item";
import Swap from "contents/items/swap";
import Menu from "contents/items/menu";
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
        camera.add(this as Mesh);


    }

    move(){
        document.addEventListener('mousemove', (e:MouseEvent) => {
            e.preventDefault();
            console.log(mouse.x, mouse.y);
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

                console.log('clicked point', intersect.object);
                break;
            }


        });
    }
}

export default class Player extends Content {
    private controls: PointerLockControls = new PointerLockControls(camera, renderer.domElement);
    // private items: Swap = new Swap();
    private crossHair: CrossHair = new CrossHair();
    private moveSpeed: number = 100;
    private menu!: Menu;
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
        this.menu = new Menu();

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