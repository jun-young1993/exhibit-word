import Item, {ItemOptions} from "contents/items/item";

import {Box3, BoxGeometry, FrontSide, Mesh, MeshBasicMaterial, Object3D, Object3DEventMap, Vector3} from "three";
import {gltfLoader, scene, textureLoader} from "lib/common";
import upload from "lib/upload";


export default class BoxItem extends Item {
    public name: string = 'box-item';
    private clicked: boolean = false;


    constructor(options?: ItemOptions) {

        super(
            new BoxGeometry(10, 10, 10),
            new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
            options
        );

        this.sizeEvent();
    }



    move(e:MouseEvent){

        const intersect = this.intersectObjects();
        if(intersect){



            // 카메라와 매쉬의 상대 위치 계산
            const cameraPosition = this.camera.position.clone();
            const meshPosition = this.position.clone();
            const relativePosition = meshPosition.sub(cameraPosition);

            // 카메라와 매쉬의 상대 위치에 따라 z 값을 조정
            const diff = relativePosition.z <= 0 ? 15 : -15;

            this.position.set(
                intersect.point.x,
                intersect.point.y,
                intersect.point.z  + (diff)
            );

            scene.add(this);

        }


    }


    private sizeEventListener = (e: KeyboardEvent) => {
        e.preventDefault();
        const {code} = e;

        if(code === 'KeyI') {
            this.scale.y += 0.1;
        }
        if(code === 'KeyJ') {
            this.scale.x += 0.1;
        }
        if(code === 'KeyL') {
            this.scale.x -= 0.1;
        }
        if(code === 'KeyK') {
            this.scale.y -= 0.1;
        }

        if(code === 'KeyY'){
            this.rotation.x += 0.1;
        }

        if(code === 'KeyU'){
            this.rotation.x -= 0.1;
        }

        if(code === 'KeyO'){
            this.rotation.y += 0.1;
        }

        if(code === 'KeyP'){
            this.rotation.y -= 0.1;
        }



        // if(code === 'Comma'){
        //     this.position.z += 0.1;
        // }
        // if(code === 'Period'){
        //     this.position.z -= 0.1;
        // }



        if(code === 'KeyM') {

            const boundingBox = new Box3().setFromObject(this);



            const fileInput = document.createElement('input');


            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.click();
            fileInput.addEventListener('change', (event: Event) => {
                // @ts-ignore
                const file = event.target.files[0]; // 선




                const size = new Vector3();
                boundingBox.getSize(size);


                const mesh = new Mesh(
                    new BoxGeometry(
                        boundingBox.max.x - boundingBox.min.x,
                        boundingBox.max.y - boundingBox.min.y,
                        20
                    ),
                    new MeshBasicMaterial({
                        // color: 0x00ff00,
                        map: textureLoader.load('./image/github_logo.png'),
                        side: FrontSide
                    }),
                )
                mesh.position.copy(this.position);
                mesh.rotation.copy(this.rotation);
                scene.add(mesh);

            });





        }

    }

    private sizeEvent(): void
    {
        document.addEventListener('keydown',this.sizeEventListener);
    }

    private removeSizeEvent(): void {document.removeEventListener('keydown',this.sizeEventListener)}



    click(e: MouseEvent) {
        // this.clicked = true;
        // const box = this.clone();
        // scene.add(box);

    }



    cleared(){

    }
}