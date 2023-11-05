import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";
import {ItemResponse} from "interfaces/response.interface";
import {scene} from "lib/common";

export class ExhibitItem {
    private depth!: number;
    private width!: number;
    private height!: number;
    private mesh!: Mesh;
    private z!: number;
    private y!: number;
    private x!: number;
    constructor(itemResponse: ItemResponse) {
        Object.assign(this,itemResponse);
        this.init();

    }

    getGeometry(){
        return new BoxGeometry(this.width, this.height, this.depth);
    }

    getMaterial(){
        return new MeshBasicMaterial()
    }

    getMesh(): Mesh
    {
        if(!this.mesh){
            const mesh = new Mesh(
                this.getGeometry(), this.getMaterial()
            );
            this.mesh = mesh;
        }

        return this.mesh;
    }

    init(): void
    {
        this.getMesh().position.set(this.x, this.y, this.z);
        scene.add(this.getMesh());

    }
}