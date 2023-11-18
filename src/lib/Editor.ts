import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
    AmbientLight, AxesHelper, Box3, BoxGeometry,
    Color, CylinderGeometry,
    GridHelper, IcosahedronGeometry,
    Material,
    Mesh, MeshBasicMaterial, Object3DEventMap, OctahedronGeometry,
    PerspectiveCamera,
    PlaneGeometry,
    Raycaster, RingGeometry,
    Scene, SphereGeometry,
    SpotLight, TetrahedronGeometry, TextureLoader, TorusKnotGeometry, TubeGeometry, Vector2, WebGLRenderer
} from "three";
import {CSS3DObject, CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import dat from 'dat.gui';
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import MeshInfo from "lib/mesh-info";
import {imageClient, meshClient} from "lib/clients";
import {constants} from "http2";
import MeshBulk from "../entities/mesh-bulk";
import TextureItemInterface from "interfaces/texture-item.interface";
import ImageInterface from "interfaces/texture-item.interface";



export interface UiButtonInterface {
    geometry_list : HTMLDivElement
}
export interface UiBodyInterface {
    geometry_list: HTMLElement
    material_list: HTMLElement
    texture_list: HTMLDivElement
}

export interface UiItemInterface {
    material_color: HTMLInputElement
    material_opacity: HTMLInputElement
}
export interface UiInterface {
    button : UiButtonInterface
    body: UiBodyInterface
    item: UiItemInterface
}
export default class Editor {
    private readonly canvas!: HTMLCanvasElement;
    private modalContainer!: HTMLDivElement;
    private readonly scene!: Scene;
    private readonly camera!: PerspectiveCamera;
    private readonly renderer!: WebGLRenderer;
    private readonly cssRenderer!: CSS3DRenderer;
    private raycaster!: Raycaster;
    private readonly pointer!: Vector2;
    private rollOverMaterial!: MeshBasicMaterial;
    private rollOverMesh!: Mesh<BoxGeometry, any, Object3DEventMap>;
    private objects: any[] = [];
    private items: any[] = []
    private editing: Mesh | undefined;
    private axesHelper: AxesHelper;
    // private datGui: dat.GUI;
    private transformControls: TransformControls;
    private ui: UiInterface;
    private textureLoader:TextureLoader =  new TextureLoader();
    constructor() {
        this.canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;
        this.modalContainer = document.querySelector('#modal-container') as HTMLDivElement;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        this.renderer = new WebGLRenderer( {
            canvas: this.canvas,
            antialias: true
        });
        this.cssRenderer = new CSS3DRenderer();



        this.raycaster = new Raycaster();
        this.pointer = new Vector2();

        this.axesHelper = new AxesHelper(100);
        // this.datGui = new dat.GUI();

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.ui = {
            button: {
                geometry_list: document.getElementById('geometry-list-button') as HTMLDivElement
            },
            body: {
                geometry_list: document.getElementById('geometry-list') as HTMLElement,
                material_list: document.getElementById('material-list') as HTMLElement,
                texture_list: document.getElementById('texture-list') as HTMLDivElement
            },
            item: {
                material_color: document.getElementById('material-color') as HTMLInputElement,
                material_opacity: document.getElementById('material-opacity') as HTMLInputElement
            }
        }
        this.ui.item.material_color.addEventListener('input',() => {
            if (this.editing && this.editing.material instanceof MeshBasicMaterial) {

                    this.editing.material.color.set(this.ui.item.material_color.value)
            
            }
            
        })

        this.ui.item.material_opacity.addEventListener('input',()=>{
            if(this.editing && this.editing.material instanceof MeshBasicMaterial){

                this.editing.material.opacity = parseFloat(this.ui.item.material_opacity.value);
                this.editing.material.needsUpdate = true;
            }
        })


    }

    public initialize(){

        // this.scene.add(this.axesHelper);

        this.scene.background = new Color( 0xf0f0f0 );

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

        // const rollOverGeo = new BoxGeometry(50, 50, 50)
        // this.rollOverMaterial = new MeshBasicMaterial( {
        //     color: 0xff0000,
        //     opacity: 0.5,
        //     transparent: true
        // } );
        // this.rollOverMesh = new Mesh( rollOverGeo, this.rollOverMaterial );
        // this.scene.add( this.rollOverMesh );

        const helper = new GridHelper( 2000, 100 );
        this.scene.add( helper );

        const orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
        orbitControls.update();
        orbitControls.enableDamping = true;


        this.transformControls.addEventListener('dragging-changed',(event) => {
            console.log(event.value);
            orbitControls.enabled = ! event.value;
        })
        this.scene.add(this.transformControls);

        const geometry = new PlaneGeometry( 2000, 2000 );
        geometry.rotateX( - Math.PI / 2 );
        const plane = new Mesh( geometry, new MeshBasicMaterial( { visible: false } ) );
        this.scene.add( plane );
        this.objects.push( plane );

        this.addEvents();


        this.findAll();
        // this.item();

        this.createInventoryModal();
    }

    private createInventoryModal() {
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // 여기에 모달 내용을 추가 (예: 아이템 목록, 버튼 등)
        // const modalTitle = document.createElement('h2');
        // modalTitle.innerText = 'Inventory';

        // const closeModalButton = document.createElement('button');
        // closeModalButton.innerText = 'Close';
        // closeModalButton.addEventListener('click', () => {
        //     this.modalContainer.className = "modal-container";
        // });

        // modalContent.appendChild(modalTitle);
        // modalContent.appendChild(closeModalButton);

        // 모달을 3D 객체로 변환
        const modalObject = new CSS3DObject(modalContent);
        modalObject.position.set(0, 0, -500); // 적절한 위치로 설정

        // 모달을 모달 컨테이너에 추가
        this.modalContainer.appendChild(modalContent);

        // 모달 객체를 scene에 추가
        this.scene.add(modalObject);

        // 모달 컨테이너를 three.js와 연결
        this.cssRenderer.domElement.style.position = 'absolute';
        this.modalContainer.appendChild(this.cssRenderer.domElement);

        // // 모달 컨테이너의 위치를 계산하여 맨 왼쪽 상단에 배치
        // const width = window.innerWidth/6;
        // const height = window.innerHeight/4.5;
        // console.log(width, height);
        //
        // this.modalContainer.style.left = `${width / 2}px`;
        // this.modalContainer.style.top = `${height / 2}px`;



        const geometryItems = [
            {
                type : 'geometry',
                name : 'Box',
                path: "./image/test.png"
            }
            // ,{
            //     type : 'geometry',
            //     name : 'Sphere'
            // },{
            //     type : 'geometry',
            //     name : 'Cylinder'
            // },{
            //     type : 'geometry',
            //     name : 'Plane'
            // },
            // {
            //     type : 'geometry',
            //     name : 'TorusKnot'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Cone'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Dodecahedron'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Octahedron'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Icosahedron'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Tetrahedron'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Ring'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Tube'
            // },
            // {
            //     type : 'geometry',
            //     name : 'Text'
            // }
        ];

        imageClient.getImages('geometry')
            .then((response) => response.json())
            .then((geometryItems: ImageInterface[]) => {
                this.ui.body.geometry_list.className = "item-grid active";
                geometryItems.forEach((geometryItem) => {
                    this.ui.body.geometry_list.appendChild(this.item(geometryItem));
                });
            })
        


        imageClient.getImages('texture')
            .then((response) => {
                return response.json();
            })
            .then((textureItems:ImageInterface[]) => {

                textureItems.forEach((textureItem) => {
                    this.ui.body.texture_list.appendChild(this.item(textureItem));
                })
            })


    }

    private item(item: object) {
        const itemBox = document.createElement( 'div' );
        itemBox.className = "item-box";

        const itemImage = document.createElement('img');
        itemImage.className = 'item-img';
        itemImage.alt = '아이템 이미지';
        // @ts-ignore
        itemImage.src = imageClient.getFileUrl(item.id);


        // @ts-ignore
        itemImage.dataset.id = item.id;

        // @ts-ignore
        itemImage.dataset.type =item.type ?? item.purpose;
        // @ts-ignore
        itemImage.dataset.name = item.name;

        itemBox.appendChild(itemImage);


        // const objectCss = new CSS3DObject(itemBox);
        // objectCss.position.set(0,150,0 );
        // this.scene.add(objectCss);
        // this.items.push(objectCss);

        return itemBox;
    }

    private addEvents() : void
    {
        this.setAnimationLoop = this.setAnimationLoop.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
        document.addEventListener( 'pointermove', this.onPointerMove );
        document.addEventListener( 'pointerdown', this.onPointerDown );
        document.addEventListener( 'keydown', this.onDocumentKeyDown );
        document.addEventListener( 'keyup', this.onDocumentKeyUp );
    }

    public removeEvents(): void
    {
        document.removeEventListener('pointermove',this.onPointerMove);
        document.removeEventListener('pointerdown',this.onPointerDown);
        document.removeEventListener('keydown',this.onDocumentKeyDown);
        document.removeEventListener('keyup',this.onDocumentKeyUp);
    }


    private render(): void
    {

        if(this.scene && this.camera){
            
            this.renderer?.render(this.scene, this.camera);             
        }   
    }

    private onDocumentKeyUp( event: KeyboardEvent ): void
    {

        switch(event.code){
            case 'KeyI':
                if(this.modalContainer.className === 'modal-container' || this.modalContainer.className === ''){
                    this.modalContainer.className = 'modal-container active';
                }else{
                    this.modalContainer.className = 'modal-container';
                }
                break;
        }
    }

    private onDocumentKeyDown( event: KeyboardEvent ): void
    {

        switch(event.code){
            case 'KeyW': // W
                this.transformControls.setMode( 'translate' );
                break;

            case 'KeyE': // E
                this.transformControls.setMode( 'rotate' );
                break;

            case 'KeyR': // R
                this.transformControls.setMode( 'scale' );
                break;
            case 'Escape':
                this.removeEditing();
                break;
            case 'Enter':
                this.itemApply();
                break;

        }
    }

    private findAll() {
        meshClient.findAll()
        .then((meshBulkInterfaces) => {

            meshBulkInterfaces.forEach((meshBulkInterface) => {

                this.scene.add(
                    new MeshBulk(meshBulkInterface).mesh()
                )
            })

            // this.scene.add(mesh);
        });

    }

    private async itemApply() {

        if (this.editing) {

            const create = await meshClient.createBulk(this.editing);
            if(create.status === 201){
                const clone = this.editing.clone();
                this.objects.push(clone);
                this.scene.add(clone);
                this.removeEditing();
            }

        }

    }

    private removeEditing(): void
    {
        if(this.editing){
            this.transformControls.detach();
            this.scene.remove(this.editing);
        }
    }

    private onPointerDown(event: PointerEvent): void
    {
        const element = event.target;

        if(event.target instanceof HTMLCanvasElement){

        }else if(event.target instanceof HTMLDivElement){

        }else if(event.target instanceof HTMLButtonElement){
            const buttonElement = element as HTMLButtonElement;
            const type = buttonElement.dataset.type;
            const category = buttonElement.dataset.category;
            const subCategory = buttonElement.dataset.subcategory;
            switch (type){
                case 'ui':
                        switch (category){
                            case 'item-list':
                                    switch (subCategory){
                                        case 'geometry':
                                            this.ui.body.geometry_list.className = "item-grid active";
                                            this.ui.body.material_list.className = "item-list";
                                            break;
                                        case 'material':
                                            this.ui.body.geometry_list.className = "item-grid";
                                            this.ui.body.material_list.className = "item-list active";
                                            break;
                                        case 'apply':
                                            this.itemApply();
                                            break;
                                        case 'cancel':

                                            this.removeEditing();

                                            break;
                                    }
                                break;
                        }
                    break;
            }
        }else if(event.target instanceof HTMLImageElement){
            const imageElement = element as HTMLImageElement;
            console.log(imageElement.dataset);
            const type = imageElement.dataset.type;
            const name = imageElement.dataset.name;

            if(type === 'geometry'){
                let geometry = null;
                if(name === 'BoxGeometry'){
                    geometry = new BoxGeometry(50, 50, 50)

                }
                if(name === 'Sphere'){
                    geometry = new SphereGeometry(50, 50, 50);
                }
                if(name === 'Cylinder'){
                    geometry = new CylinderGeometry(50, 50, 50);
                }

                if(name === 'Plane'){
                   geometry =  new TorusKnotGeometry();
                }


                if(name === 'Ring'){
                    geometry = new RingGeometry();
                }

                if(name === 'Octahedron'){
                    geometry = new OctahedronGeometry();
                }

                if(name === 'Icosahedron'){
                    geometry = new IcosahedronGeometry();
                }

                if(name === 'Tetrahedron'){
                    geometry = new TetrahedronGeometry();
                }
                if(name === 'Ring'){
                    geometry = new RingGeometry();
                }
                if(name === 'Tube'){
                    geometry = new TubeGeometry();
                }








                if(geometry){
                    const mesh = new Mesh(
                        geometry,
                        new MeshBasicMaterial()
                    )
                    this.removeEditing();

                    this.editing = mesh;
                    this.transformControls.attach(this.editing);
                    this.ui.item.material_color.value = '#ffffff';
                    this.scene.add(this.editing);
                }
            }
            if(type === 'texture'){


                if(this.editing && this.editing.material){
                    // @ts-ignore


                    // 이미지 소스를 텍스처로 로드
                    const texture = this.textureLoader.load(imageElement.src);
                    // @ts-ignore
                    texture.uuid = imageElement.dataset.id as string;
                    // 텍스처를 메테리얼의 맵에 할당
                    // @ts-ignore
                    this.editing.material.map = texture;

                    // 텍스처 변경을 적용하기 위해 업데이트
                    // @ts-ignore
                    this.editing.material.needsUpdate = true;
                }
            }

        }




        // this.pointer?.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
        //
        //
        //     this.raycaster?.setFromCamera(this.pointer, this.camera);
        //
        //
        // const intersects = this.raycaster.intersectObjects( this.objects, false );
        // if ( intersects.length > 0 ) {
        //     const intersect = intersects[ 0 ];
        //     const voxel = this.rollOverMesh?.clone();
        //     if(intersect.face){
        //         voxel?.position.copy( intersect.point ).add( intersect.face.normal );
        //         voxel?.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        //         this.scene.add( voxel );
        //
        //         this.objects.push( voxel );
        //     }
        //
        // }


    }

    private onPointerMove(event: PointerEvent): void
    {

        // this.pointer?.set(
        //     ( event.clientX / window.innerWidth ) * 2 -1,
        //     -( event.clientY / window.innerHeight ) * 2 + 1,
        // );
        // if(this.pointer && this.camera){
        //     this.raycaster?.setFromCamera( this.pointer, this.camera );
        //
        //     const intersects = this.raycaster?.intersectObjects( this.objects, false );
        //
        //     if (intersects) {
        //         if (intersects.length > 0) {
        //
        //             const {face, point} = intersects[0];
        //             if(face){
        //
        //                 this.rollOverMesh?.position.copy(point).add(face.normal);
        //                 this.rollOverMesh?.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        //
        //
        //             }
        //             ;
        //
        //         }
        //     }
        //
        // }


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