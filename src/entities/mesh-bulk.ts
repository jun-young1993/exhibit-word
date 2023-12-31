import {BoxGeometry, Mesh, MeshBasicMaterial, RepeatWrapping, SphereGeometry, TextureLoader} from "three";
import id from "ajv/lib/vocabularies/core/id";
import {BufferGeometry} from "three/src/core/BufferGeometry";


export interface BulkMaterialTextureInterface {
    wrapT: number
    wrapS: number
    repeatX: number
    repeatY: number
    src: string
}
export interface BulkMaterialInterface {
    id: string
    color?: string
    texture?: BulkMaterialTextureInterface
    opacity: number
    type: string
}

export interface BulkGeometryInterface {
    id: string
    width: number
    height: number
    depth: number
    radius: number
    segments: number
    type: string

}
export interface MeshBulkInterface {
    id: string
    positionX: number
    positionY: number
    positionZ: number
    quaternionX: number
    quaternionY: number
    quaternionZ: number
    quaternionW: number
    rotationX: number
    rotationY: number
    rotationZ: number
    type: string
    material: BulkMaterialInterface
    geometry: BulkGeometryInterface
}
export default class MeshBulk {
    private meshBulk: MeshBulkInterface;
    constructor(meshBulk: MeshBulkInterface) {
        this.meshBulk = meshBulk;
    }

    mesh(): Mesh
    {
        const meshBulk = this.meshBulk;
        const mesh = new Mesh(
            // @ts-ignore
         this.getGeometry(),
         this.getMaterial()
        );

        mesh.name = meshBulk.id;
        mesh.position.set(
            meshBulk.positionX,
            meshBulk.positionY,
            meshBulk.positionZ
        );
        mesh.quaternion.set(
            meshBulk.quaternionX,
            meshBulk.quaternionY,
            meshBulk.quaternionZ,
            meshBulk.quaternionW,
        );
        mesh.rotation.set(
            meshBulk.rotationX,
            meshBulk.rotationY,
            meshBulk.rotationZ
        );
        return mesh;
    }

    getGeometry()
    {
        const bulkGeometry = this.meshBulk.geometry;
        let geometry = null;

        switch(bulkGeometry.type){
            case BoxGeometry.name:
                geometry = new BoxGeometry(
                    bulkGeometry.width,
                    bulkGeometry.height,
                    bulkGeometry.depth
                );
                break;
            case SphereGeometry.name:
                    geometry = new SphereGeometry(
                        bulkGeometry.radius
                    )
                break;
        }
        if(geometry === null){
            throw Error('Geometry was not correctly generated')
        }
        geometry.name = bulkGeometry.id;
        return geometry;
    }

    getMaterial(){
        const bulkMaterial = this.meshBulk.material;
        let material = null;
        let texture = null;
        
        if(this.meshBulk.material.texture){
            const textureLoader = new TextureLoader();
            texture = textureLoader.load(this.meshBulk.material.texture.src);
                
            // texture.wrapS = this.meshBulk.material.texture.wrapS;
            // texture.wrapT = this.meshBulk.material.texture.wrapT;
            
            texture.repeat.set(this.meshBulk.material.texture.repeatX,this.meshBulk.material.texture.repeatY);
        }
        switch(bulkMaterial.type){
            case MeshBasicMaterial.name:
                    material = new MeshBasicMaterial({
                        color: bulkMaterial.color,
                        opacity: bulkMaterial.opacity,
                        map: texture
                    })
                break;
        }

        if(!material){
            throw Error('Material was not correctly generated')
        }
        material.name = bulkMaterial.id;
        return material;
    }


}