import {initialValue} from "lib/common";
import KeyController from "lib/key.controller";

export default function boot()  {
    /**
     * world, scene, camera, renderer setting
     */
    initialValue();

    KeyController.getInstance();



}