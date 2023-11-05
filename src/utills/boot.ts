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

    // 매뉴 버튼 동작
    const menuButton = document.getElementById('menuIcon');
    const menu = document.getElementById('menu');
    const closeButton = document.getElementById('closeButton');
    const menu1 = document.getElementById('menu1');
    const menu1Sub = document.getElementById('menu1-sub');
    if(menuButton && menu && closeButton){
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('open');
                menu.classList.toggle('show');
                menuButton.style.display = "none";
        });
    }
    if(closeButton && menu && menuButton){
        closeButton.addEventListener('click', () => {
                menu.classList.remove('show');
                menuButton.classList.remove('open');
                menuButton.style.display = "";
        });
    }
    if(menu1){
        menu1.addEventListener('click', () => {
            if(menu1Sub){
                menu1Sub.style.display = "block";
                menu1Sub.style.opacity = "1";

            }

        });
    }




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