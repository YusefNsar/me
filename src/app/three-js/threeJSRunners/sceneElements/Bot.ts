import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class Bot implements SceneElement {
  private botContainer: THREE.Object3D;

  addElement(scene: Scene): void {
    this.botContainer = new THREE.Group();
    this.botContainer.name = 'bot';
    scene.add(this.botContainer);

    this.loadBotAsync();
  }

  loadBotAsync() {
    this.loadBotGLTF().then((glt) => {
      glt.scene.scale.set(0.5, 0.5, 0.5);
      glt.scene.rotateY(-Math.PI / 2);
      // glt.scene.position.set(10, 10, 10);
      glt.scene.up.set(0, 1, 0);

      this.botContainer.add(glt.scene);
    });
  }

  async loadBotGLTF(): Promise<GLTF> {
    const loader = new GLTFLoader().setPath('../../assets');

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('three/examples/jsm/libs/draco');
    loader.setDRACOLoader(dracoLoader);

    return loader.loadAsync('/core_from_portal_2.glb', (e) => {
      console.log('Loading bot progress...', e.loaded / e.total);
    });
  }
}
