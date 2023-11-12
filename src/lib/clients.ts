import Item from "contents/items/item";
import {Box3, Mesh, Vector3} from "three";
import CreateMeshBulkDto from "../dto/create-mesh-bulk-dto";
import {MeshBulkInterface} from "../entities/mesh-bulk";

interface ClientInterface {
  domain?: string,
  prefix?: string
}

class Client {
  protected domain: string = 'http://localhost:3000'
  protected prefix: string = '/'

  constructor(clientInterface: ClientInterface) {
    this.domain = clientInterface.domain ?? this.domain;
    this.prefix = clientInterface.prefix ?? this.prefix;
  }

  fetch(endpoint: string, init?:  RequestInit){
    const url = this.domain+this.prefix+endpoint;
    return fetch(url, init);
  }
}

class MeshClient extends Client {
  constructor() {
    super({
      prefix: '/api/v1/meshes'
    });
  }

  public createBulk(mesh: Mesh){
    const dto = new CreateMeshBulkDto(mesh);
    return this.fetch('/bulk',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(dto)
    })
  }

  public findAll(): Promise<MeshBulkInterface[]>
  {
    return new Promise((resolve, reject) => {
      this.fetch('/bulk',{
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
      })
      .then((response) => {
        return response.json();
      })
      .then((response: MeshBulkInterface[]) => resolve(response))
      .catch((response) => reject(response));
    })

  }
}

export const meshClient = new MeshClient();

class ItemClient extends Client {
  constructor() {
    super({
      prefix: '/api/v1/items'
    });
  }

  post(item: Item){
    const { position }  = item;
    const { x, y, z } = position;


    const size = new Vector3();
    const box = new Box3().setFromObject(item);
    box.getSize(size);

    const {x: width, y: height, z: depth} = size;



    return this.fetch('',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({
        x,
        y,
        z,
        width,
        height,
        depth
      })
    })
  }

  get(){
    return this.fetch('',{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
     })
  }
}

export const itemClient = new ItemClient();