import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export class BeamRings implements SceneElement {
  addElement(scene: Scene): void {
    const ring = this.initBeamRings();
    scene.add(ring);
  }

  initBeamRings() {
    // const g = new THREE.RingGeometry(28, 30, 30, 2);
    const g = this.makeRingGeometry();

    const m = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.4,
      // dashed: true,
      // dashSize: 1,
      // gapSize: 2,
      // dashOffset: 30,
      transparent: true,
      opacity: 0.2,
      worldUnits: true,
      // alphaToCoverage: true,
    });

    const ring = new Line2(g, m);

    ring.computeLineDistances();
    ring.rotateX(Math.PI / 2);

    ring.scale.set(7, 7, 7);
    ring.position.setY(300);

    const r2 = ring.clone();
    r2.scale.set(4, 4, 4);
    r2.position.setY(500);

    const r3 = ring.clone();
    r3.scale.set(1, 1, 1);
    r3.position.setY(750);

    const r4 = ring.clone();
    r4.scale.set(2, 2, 2);
    r4.position.setY(-250);

    const rings = new THREE.Group();
    rings.add(ring, r2, r3, r4);

    return rings;
  }

  makeRingGeometry() {
    const radius = 50;
    const segments = 64 * 2;
    const vertices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      vertices.push(x, y, 0);
    }

    const g = new LineGeometry();
    g.setPositions(vertices);

    return g;
  }
}
