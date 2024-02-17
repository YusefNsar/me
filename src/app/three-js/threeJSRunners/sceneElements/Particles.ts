import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';

export class Particles implements SceneElement {
  addElement(scene: Scene): void {
    const particles = this.initParticles();
    scene.add(particles);
  }

  initParticles() {
    const numParticles = 100;
    const spreadRange = [500, 1000];
    const particleGroup = new THREE.Group();

    // Generate random positions for particles within a volume
    for (let i = 0; i < numParticles; i++) {
      const particle = this.createParticle();

      particle.position.set(
        Math.random() * spreadRange[1] - spreadRange[0], // X position (-5 to 5)
        Math.random() * spreadRange[1] - spreadRange[0], // Y position (-5 to 5)
        Math.random() * spreadRange[1] - spreadRange[0], // Z position (-5 to 5)
      );

      particleGroup.add(particle);
    }

    return particleGroup;
  }

  createParticle() {
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff0000,
      emissiveIntensity: 1,
    });
    const particle = new THREE.Mesh(geometry, material);

    return particle;
  }
}
