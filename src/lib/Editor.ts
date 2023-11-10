import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import {
    AmbientLight,
    Color,
    GridHelper,
    Mesh, MeshBasicMaterial, PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    Raycaster,
    Scene,
    ShadowMaterial,
    SpotLight, Vector2, WebGLRenderer
} from "three";



export default class Editor {
    private canvas: HTMLCanvasElement | undefined;
    private scene: Scene | undefined;
    private camera: PerspectiveCamera | undefined;
    private renderer: WebGLRenderer | undefined;
    private raycaster: Raycaster | undefined;
    private pointer: Vector2 | undefined;
    

    public initialize(){
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

        

        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
        
        const geometry = new PlaneGeometry( 1000, 1000 );
        geometry.rotateX( - Math.PI / 2 );

        const plane = new Mesh( geometry, new MeshBasicMaterial( { visible: false } ) );
        this.scene.add( plane );


        this.setAnimationLoop = this.setAnimationLoop.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
        document.addEventListener( 'pointermove', this.onPointerMove );
        document.addEventListener( 'pointerdown', this.onPointerDown );
        document.addEventListener( 'keydown', this.onDocumentKeyDown );
        document.addEventListener( 'keyup', this.onDocumentKeyUp );

        // window.addEventListener('resize', this.onWindowResize);
    }


    private render(): void
    {
        if(this.scene && this.camera){
            
            this.renderer?.render(this.scene, this.camera);             
        }   
    }

    private onDocumentKeyUp( event: KeyboardEvent ): void
    {

    }

    private onDocumentKeyDown( event: KeyboardEvent ): void
    {

    }

    private onPointerDown(event: PointerEvent): void
    {
        
    }

    private onPointerMove(event: PointerEvent): void
    {

        this.pointer?.set(
            ( event.clientX / window.innerWidth ) * 2 -1,
            -( event.clientY / window.innerHeight ) * 2 + 1,         
        );
        if(this.pointer && this.camera){
            this.raycaster?.setFromCamera( this.pointer, this.camera );
        }
        
        
    }


    private onWindowResize(): void
    {
        this.renderer?.setSize(window.innerWidth, window.innerHeight);
        this.renderer?.setPixelRatio( window.devicePixelRatio );
        if(this.camera){
            this.camera.aspect = (window.innerWidth / window.innerHeight) as number;
        }
        this.camera?.updateMatrix();
        
    }


    setAnimationLoop(): void
    {
	
        this.render();
        this.onWindowResize();
        
        if(this.renderer){
            this.renderer.setAnimationLoop(this.setAnimationLoop);
        }
	
    }
}