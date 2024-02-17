import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';

export class Bot implements SceneElement {
  addElement(scene: Scene): void {
    const bot = this.initBot();
    scene.add(bot);
  }

  initBot() {
    const bot = new THREE.Group();
    return bot;
  }
}
