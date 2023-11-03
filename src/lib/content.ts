import BaseContent from "lib/base-content";
import {Mesh} from "lib/common";
import EventEmitter from "events";
import {Vec3} from "cannon-es";




export interface ContentParameterInterface {
    height?: number
    width?: number
    depth?: number
    x?: number
    y?: number
    z?: number
    mass?: number
}
export default class Content extends BaseContent{
    protected height: number = 0;
    protected width: number = 0;
    protected depth: number = 0;
    protected x: number = 0;
    protected y: number = 0;
    protected z: number = 0;
    protected mesh!: Mesh;

    constructor(contentParameter: ContentParameterInterface) {
        super();
        Object.assign(this, contentParameter);
        this.y = this.height/2 + 1;
        this.setScene(this.getMesh());
        this.cannon(
            this.scaleToObjectVec3(),
            {
                mass: contentParameter?.mass ?? 0,
                position: this.positionToCannonVec3()
            },
            this.getMesh()
        )
    }

    public scaleToObjectVec3(): Vec3
    {
        return new Vec3(this.width/2, this.height/2, this.depth/2);
    }

    public positionToCannonVec3(): Vec3
    {
        return new Vec3(this.x, this.y, this.z)
    }

    public getMesh(): Mesh
    {
        if(!this.mesh){
            this.mesh = this.createMesh();
        }

        return this.mesh;
    }

    createMesh(): Mesh
    {
        throw new Error("CreateMesh Method not implemented.");
    }
}

