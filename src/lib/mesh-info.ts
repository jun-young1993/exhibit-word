import {Box3, BoxGeometry, Material, Mesh, MeshBasicMaterial, Object3DEventMap, Texture, Vector3} from "three";



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
    private materialColor: string = '#ffffff';
    private materialOpacity: number = 1;
    private materialTexture: any = null;
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

        
        
        if(mesh.material instanceof MeshBasicMaterial){
            this.materialColor = `#${mesh.material.color.getHexString()?? 'ffffff'}`;
            this.materialOpacity = mesh.material.opacity;
            console.log(mesh.material);
            if(mesh.material.map instanceof Texture){
                
                
                
                
                
                this. materialTexture = {
                    wrapT: mesh.material.map.wrapT,
                    wrapS: mesh.material.map.wrapS,
                    repeatX: mesh.material.map.repeat.x,
                    repeatY: mesh.material.map.repeat.y,
                    src: mesh.material.map.source.data.src
                }
            }
            
        }
        
        

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
                color: this.materialColor,
                opacity: this.materialOpacity,
            },
            geometry: {
                type: this.geometryType,
                width: this.width,
                height: this.height,
                depth: this.depth
            },
            texture: this. materialTexture
        }
    }
}