import {Vec3} from "cannon-es";
import {Vector3} from "three";

export const threeVector3FromCannonVec3 = (vec3: Vec3): Vector3 => {
    return vec3 as unknown as Vector3;
}

export const cannonVec3FromThreeVector3 = (vector3: Vector3) => {
    return vector3 as unknown as Vec3;
}
