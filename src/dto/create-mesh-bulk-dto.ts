import {Mesh} from "three";
import MeshInfo from "lib/mesh-info";

export default class CreateMeshBulkDto {
    constructor(mesh: Mesh) {
     Object.assign(this,new MeshInfo(mesh).getJson());
    }
}