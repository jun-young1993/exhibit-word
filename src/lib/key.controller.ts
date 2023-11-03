import {event as ExibitEvent} from "lib/common";
import {EventNames} from "interfaces/content-parameter.interface";

export default class KeyController {
    private static instance: KeyController;
    private static keys: Record<string, boolean> = {};
    private static toggles: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown',({code})=>{
            KeyController.keys[code] = true;

            if(KeyController.toggles[code] === undefined){
                KeyController.toggles[code] = true;
            }
            if(KeyController.toggles[code] === true){
                delete KeyController.toggles[code];
            }

        })

        window.addEventListener('keyup',({code}) => {
            delete KeyController.keys[code];

        })
    }

    public static getInstance(): KeyController {
        if (!KeyController.instance) {
            KeyController.instance = new KeyController();
        }
        return KeyController.instance;
    }

    public static getKeys(): Record<string, boolean>
    {
        return KeyController.keys;
    }
}