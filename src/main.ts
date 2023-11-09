import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import {
    AmbientLight,
    Color,
    GridHelper,
    Mesh, PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShadowMaterial,
    SpotLight, WebGLRenderer
} from "three";
import {camera, event as ExibitEvent, renderer, scene, world} from "lib/common";
import {EventNames} from "interfaces/content-parameter.interface";

class Editor {
    private canvas: HTMLCanvasElement | undefined;
    private scene: Scene | undefined;
    private camera: PerspectiveCamera | undefined;
    private renderer: WebGLRenderer | undefined;

    public show(){
        this.canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

        this.scene = new Scene();
        this.scene.background = new Color( 0xf0f0f0 );

        this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.set( 0, 250, 1000 );

        this.scene.add( this.camera );

        this.scene.add(new AmbientLight(0xf0f0f0, 3));
        const light = new SpotLight(0xffffff, 4.5);
        light.position.set( 0, 1500, 200 );
        light.angle = Math.PI * 0.2;
        light.decay = 0;
        light.castShadow = true;
        light.shadow.camera.near = 200;
        light.shadow.camera.far = 2000;
        light.shadow.bias = - 0.000222;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene.add( light );

        const planeGeometry = new PlaneGeometry( 2000, 2000 );
        planeGeometry.rotateX( - Math.PI / 2 );
        const planeMaterial = new ShadowMaterial( { color: 0x000000, opacity: 0.2 } );

        const plane = new Mesh( planeGeometry, planeMaterial );
        plane.position.y = - 200;
        plane.receiveShadow = true;
        this.scene.add( plane );

        const helper = new GridHelper( 2000, 100 );
        helper.position.y = - 199;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this.scene.add( helper );


        this.renderer = new WebGLRenderer( {
            canvas: this.canvas,
            antialias: true
        } );



        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        controls.enableDamping = true;

        // controls.addEventListener( 'change', render );
        const transformControl = new TransformControls( this.camera, this.renderer.domElement );
        this.scene.add( transformControl );


    }

    render(){
        if(this.renderer){

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = PCFSoftShadowMap;
            if(editor.scene && editor.camera){
                renderer.render(editor.scene, editor.camera);
            }


            renderer.setAnimationLoop(animationLoop);
        }

    }
}



const editor = new Editor();
editor.show();

function animationLoop(){
    editor.render();
}
animationLoop();