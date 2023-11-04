import Item, {ItemOptions} from "contents/items/item";
import * as THREE from "three";


export default class CrossHairItem extends Item {
    public name: string = 'cross-hair-item';

    constructor(options?: ItemOptions) {
        super(
            new THREE.CircleGeometry(0.02, 32),
            new THREE.MeshBasicMaterial({ color: '0x000000' }),
            options
        );

        this.position.z = -2;
    }

    move(e:MouseEvent){
        // this.mouse.x = this.position.x;
        // this.mouse.y = this.position.y;
    }

    click(e: MouseEvent) {
        const intersect = this.intersectObjects();

    }
}