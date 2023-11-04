import Item from "contents/items/item";
import CrossHairItem from "contents/items/cross-hair.item";
import BoxItem from "contents/items/box.item";

export default class Swap {
    public items: Item[] = [
        new CrossHairItem({
            autoCameraAdd: false
        }),
        new BoxItem({
            autoCameraAdd: false
        })
    ];
    private itemIndex = 0;
    private swapping = false;
    private nextKeyCode = 'BracketRight';
    private prevKeyCode = 'BracketLeft';
    private pressKey: string | 'BracketRight' | 'BracketLeft' | null = null;

    constructor() {
        this.getCurrentItem().viewItem();
        window.addEventListener('keydown',({code}) => {
            if(this.swapping === false && this.pressKey === null){
                this.pressKey = code;

                this.swapping = true;
            }
        });

        window.addEventListener('keyup',({code}) => {
            if(this.swapping === true && this.pressKey === code){

                this.getCurrentItem(this.getIndex()).clearItem();
                this.getCurrentItem(this.getIndex(code)).viewItem();

                this.pressKey = null;
                this.swapping = false;
            }

        });
    }

    getIndex(code?: string){
        if(code === this.nextKeyCode){
            (this.items.length -1 > this.itemIndex) ? this.itemIndex += 1 : this.itemIndex = 0;
        }else if (code === this.prevKeyCode){
            (0 >= this.itemIndex) ? this.itemIndex = this.items.length - 1 : this.itemIndex -= 1;
        }

        return this.itemIndex;
    }

    getCurrentItem(index?: number): Item
    {
        return this.items[index ?? this.getIndex()];
    }



}