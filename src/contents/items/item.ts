import {Intersection, Mesh, Raycaster, Vector2} from "three";
import {camera, mouse, raycaster, scene} from "lib/common";

export interface ItemOptions {
    autoCameraAdd: boolean
}
export default class Item extends Mesh {
    private raycaster: Raycaster = raycaster;
    protected mouse: Vector2 = mouse;
    protected camera = camera;
    private options: ItemOptions = {
        autoCameraAdd : true
    }

    
    constructor(geometry: Mesh["geometry"], material: Mesh["material"], options?: ItemOptions) {

        super(geometry, material);
        if(options){
            this.options = {...this.options, ...options};
        }
        this.init();


    }

    private init(){
        if(this.options.autoCameraAdd){
            this.viewItem();
        }
    }

    public viewItem(){
        this.moveEvent();
        this.clickEvent();
        this.camera.add(this);
    }

    public clearItem(){
        this.cleared();
        this.removeEventListeners();
        this.camera.remove(this);
    }

    cleared(): void
    {
        // throw new Error('cleared method not implemented');
    }

    move(e: MouseEvent): void
    {
        throw new Error('move method not implemented');
    }

    click(e: MouseEvent): void
    {
        throw new Error('click method not implemented');
    }

    private moveEventListener = (e: MouseEvent) => {
        e.preventDefault();

        // mouse 좌표 계산
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.move(e);
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }


    private moveEvent(): void
    {

        document.addEventListener('mousemove',this.moveEventListener);
    }

    private clickEventListener = (e: MouseEvent) => {
        e.preventDefault();

        this.click(e);

        this.raycaster.setFromCamera(this.mouse, this.camera);
    }
    private clickEvent(): void
    {
        document.addEventListener('click',this.clickEventListener);

    }

    private removeEventListeners(): void
    {
        document.removeEventListener('mousemove',this.moveEventListener);
        document.removeEventListener('click',this.clickEventListener);
    }


    intersectObjects(): Intersection | undefined
    {
        const intersects = this.raycaster.intersectObjects(scene.children);
        for(const intersect of intersects){
            if(intersect.object.uuid === this.uuid){
                continue;
            }
            return intersect;
        }
    }


}