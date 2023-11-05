import {BoxGeometry, Group, Mesh, MeshBasicMaterial, Raycaster, Vector2, Vector3} from "three";
import {camera, scene} from "lib/common";

export default class Menu{


    private readonly size: Vector3 = new Vector3(20,20,5);
    private group: Group | undefined;
    constructor() {




    }

    isGroup(){
        return this.group === undefined ? false : true;
    }



    create(){
        if(this.group === undefined){
            const cameraDirection = new Vector3();
            camera.getWorldDirection(cameraDirection);
            const distance = 3; // Mesh를 카메라 앞으로 얼마나 떨어뜨릴 것인지 설정


            const geometry = new BoxGeometry(this.size.x, this.size.y, this.size.z);
            const material = new MeshBasicMaterial({color: 0x00ff00});

            const menuMesh = new Mesh(geometry, material);

            const menus = [
                [
                    'edit',
                    'test',
                    'test'
                ],
                [
                    'test',
                    'test',
                    'test'
                ],
                [
                    'test',
                    'test',
                    'test'
                ],
            ];
            const group = new Group();
            menus.forEach((menuGroup,row) => {

                menuGroup.forEach((menu,col) => {
                    const mesh = menuMesh.clone();
                    mesh.name = menu;
                    mesh.position.x = ((this.size.x + 3) * row);
                    mesh.position.y = ((this.size.y + 3) * col);
                    // mesh.position.z = this.position.z - 100;
                    // console.log(mesh.name,mesh.position)
                    group.add(mesh);
                })
            })


            this.group = group;
            // this.group.position.set(
            //     (group.position.y += this.size.y),
            //     (group.position.x -= this.size.x),
            //     position.z - (this.size.y*6)
            //
            // )
            this.group.position.y -= this.size.y + 3
            this.group.position.x -= this.size.x + 3;
            this.group.position.z -= 100;
            camera.add(this.group);

        }
    }

    remove(){
        if(this.group){
            scene.remove(this.group);
            this.group = undefined;
        }
    }
}