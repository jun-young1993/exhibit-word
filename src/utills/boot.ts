import {initialValue} from "lib/common";
import KeyController from "lib/key.controller";
import {itemClient} from "lib/clients";
import {ItemResponse} from "interfaces/response.interface";
import {BoxGeometry} from "three";
import {ExhibitItem} from "contents/exhibit-item/exhibit-item";

export default function boot()  {
    /**
     * world, scene, camera, renderer setting
     */
    initialValue();

  



    KeyController.getInstance();

    // items setting
    itemClient.get()
    .then((response) => {
      return response.json();
    })
    .then((items) => {
        items.forEach((item: ItemResponse) => {
            new ExhibitItem(item);
        })
    })
    .catch((exception) => {

    })

}