import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';
import { getElectronicShader } from '../shaders/electronic';

export class GroundShards implements SceneElement {
  addElement(scene: Scene): void {
    const groundShards = this.initGroundShards();

    scene.add(...groundShards);
  }

  initGroundShards() {
    const shardsMaterial = this.createShardsMaterial();

    let x = -500,
      y = -500,
      z = -500;

    const shards = [];
    while (z < 500) {
      while (x < 500) {
        const ground = this.createShard({ x, y, z }, shardsMaterial);
        shards.push(ground);

        x += 150 + 10;
      }

      x = -500;
      z += 75 + 5;
    }

    return shards;
  }

  createShard(pos: THREE.Vector3Like, material: THREE.Material) {
    const geometry = new THREE.BoxGeometry(150, 4, 75);
    const shard = new THREE.Mesh(geometry, material);

    shard.name = 'shard';
    shard.position.copy(pos);

    return shard;
  }

  createShardsMaterial() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/assets/shardsMaterial.jpg');

    // const material = new THREE.MeshStandardMaterial({
    //   // color: [0xffffff, 0x942341, 0x979014, 0x78e945][
    //   //   Math.floor(Math.random() * 4)
    //   // ],s
    //   roughness: 0.4,
    //   metalness: 0.8,
    //   map: texture,
    //   // normalMap: texture,
    // }),;
    const material = new THREE.ShaderMaterial(getElectronicShader());

    setInterval(() => {
      material.uniforms['iTime'].value += 0.02;
    }, 20);

    return material;
  }
}
