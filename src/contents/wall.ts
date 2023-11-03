import { textureLoader } from "lib/common";
import { BoxGeometry, Mesh , MeshPhongMaterial, RepeatWrapping } from "three";
import Content from "lib/content";

export default class Wall extends Content {

	constructor() {

		super({
			height: 400,
			width: 600,
			depth: 20,
			mass: 0
		});

	}
	createMesh(): Mesh {

		const marbleTexture = textureLoader.load('./image/marble-640.jpg');

		const geometry = new BoxGeometry(this.width, this.height, this.depth);
		const material = new MeshPhongMaterial({
			map:marbleTexture,
			color: 0xffffff, // 바닥 기본 색상
			shininess: 10, // 빛을 반사하는 정도 (조절 가능)
			reflectivity: 0.3, // 빛을 얼마나 반사할지 (조절 가능)
		});
		const mesh = new Mesh(geometry, material);

		return mesh;
	}
}