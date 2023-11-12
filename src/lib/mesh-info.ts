import {Box3, BoxGeometry, Mesh, Object3DEventMap, Vector3} from "three";



export default class MeshInfo {
    private width?: number;
    private height?: number;
    private depth?: number;
    private rotationX: number;
    private rotationY: number;
    private rotationZ: number;
    private positionX: number;
    private positionY: number;
    private positionZ: number;
    private quaternionX: number;
    private quaternionY: number;
    private quaternionZ: number;
    private quaternionW: number;
    private materialType: string;
    private geometryType: string;
    constructor(mesh: Mesh) {
        const {
            rotation : {x: rotationX , y: rotationY ,z: rotationZ},
            position : {x: positionX, y: positionY, z: positionZ},
            quaternion: {x: quaternionX, y: quaternionY, z: quaternionZ, w: quaternionW}
        } = mesh;

        const boundingBox = new Box3().setFromObject(mesh);
        const size = boundingBox.getSize(new Vector3());
        const { x: width, y: height, z: depth } = size;



        this.width = width;
        this.height = height;
        this.depth = depth;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.rotationZ = rotationZ;
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;
        this.quaternionX = quaternionX;
        this.quaternionY = quaternionY;
        this.quaternionZ = quaternionZ;
        this.quaternionW = quaternionW;
        this.materialType = mesh.material.constructor.name;
        this.geometryType = mesh.geometry.constructor.name;

    }

    getJson(){
        return {
            mesh: {
                positionX: this.positionX,
                positionY: this.positionY,
                positionZ: this.positionZ,
                rotationX: this.rotationX,
                rotationY: this.rotationY,
                rotationZ: this.rotationZ,
                quaternionX: this.quaternionX,
                quaternionY: this.quaternionY,
                quaternionZ: this.quaternionZ,
                quaternionW: this.quaternionW
            },
            material: {
                type: this.materialType,
                color: null,
                opacity: null,
                map: null
            },
            geometry: {
                type: this.geometryType,
                width: this.width,
                height: this.height,
                depth: this.depth
            }
        }
    }
}