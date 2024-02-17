import * as THREE from 'three';
import { SceneElement } from '../scene-manager';

export class Lights implements SceneElement {
  addElement(scene: THREE.Scene): void {
    const [ambient, light] = this.initLights();
    scene.add(ambient, light);
  }

  initLights() {
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.2);
    const light = new THREE.DirectionalLight();
    light.position.set(5, 5, 5);

    return [ambient, light];
  }
}
