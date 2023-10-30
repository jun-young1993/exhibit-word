import {Vec3} from "math/Vec3";
import {Vector3} from "three";

export const threeVector3FromCannonVec3 = (vec3: Vec3): Vector3 => {
    return vec3 as unknown as Vector3;
}