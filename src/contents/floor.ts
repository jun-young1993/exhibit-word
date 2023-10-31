import BaseContent from "lib/base-content";
import { Mesh, textureLoader } from "lib/common";
import { BoxGeometry, Mesh as ThreeMesh, MeshPhongMaterial, RepeatWrapping } from "three";

export default class Floor extends BaseContent {
	createMesh(): Mesh {
		const height = 1;
		const width = 10000;
		const depth = 10000;
		const x = 0;
		const y = 0;
		const z = 0;

		const marbleTexture = textureLoader.load('./image/marble-640.jpg');
		marbleTexture.wrapS = RepeatWrapping;
		marbleTexture.wrapT = RepeatWrapping;
		marbleTexture.repeat.set(width/20, depth/20); // 스케일 조절 (반복 수)

		const geometry = new BoxGeometry(width, height, depth);
		const material = new MeshPhongMaterial({
			map:marbleTexture,
			color: 0xffffff, // 바닥 기본 색상
			shininess: 10, // 빛을 반사하는 정도 (조절 가능)
			reflectivity: 0.3, // 빛을 얼마나 반사할지 (조절 가능)
		});
		const mesh = new ThreeMesh(geometry, material);
		mesh.position.set(x, y, z);
		return mesh;
	}
}