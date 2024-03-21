import { Scene } from 'three';
import { SceneElement } from '../scene-manager';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export class Octahedron implements SceneElement {
  cc: THREE.CubeCamera;

  addElement(scene: Scene): void {
    this.initReflectionCam(scene);
    const oct = this.initOctahedron();

    const scaleBy = 100;
    oct.position.set(0, 100, 0);
    this.cc.position.copy(oct.position);
    oct.scale.set(scaleBy, scaleBy, scaleBy);

    scene.add(oct);
  }

  initOctahedron() {
    const g = this.makeOctahedronGeometry();
    let m = this.octReflectionMaterial();

    let oct = new THREE.Mesh(g, m);
    oct.name = 'oct';
    return oct;
  }

  makeOctahedronGeometry() {
    let gPartTop = this.makePart([
      [0, 0.7, 1], // pinnacle
      [0, -1, 0], // bottom
      [2, 0, 0], // left
      [0, 7, 0], // top
      [-2, 0, 0], // right
    ]);

    let gPartBottom = this.makePart([
      [0, -1.25, 0.6], // pinnacle
      [0, -4, 0], // bottom
      [2, 0, 0], // left
      [0, -1, 0], // top
      [-2, 0, 0], // right
    ]);
    gPartBottom.translate(0, -0.3, 0);

    let gFront = BufferGeometryUtils.mergeGeometries([gPartTop, gPartBottom]);
    let gBack = gFront.clone();
    gBack.rotateY(Math.PI);

    let g = BufferGeometryUtils.mergeGeometries([gFront, gBack]);
    g = g.toNonIndexed();
    g.computeVertexNormals();

    return g;
  }

  makePart(pts: THREE.Vector3Tuple[]) {
    let g = new THREE.BufferGeometry().setFromPoints(
      pts.map((p) => {
        return new THREE.Vector3(p[0], p[1], p[2]);
      }),
    );

    let index = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1];
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }

  initReflectionCam(scene: Scene) {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024 * 2, {
      type: THREE.HalfFloatType,
      // generateMipmaps: true,
      // minFilter: THREE.LinearMipMapLinearFilter,
    });
    this.cc = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);

    this.cc.name = 'oct-cubecam';
    scene.add(this.cc);
  }

  octReflectionMaterial() {
    const m = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      emissive: 0xffffff,
      shininess: 0.6,
      emissiveIntensity: 0.4,
      combine: THREE.AddOperation,
      envMap: this.cc.renderTarget.texture,
    });

    return m;
  }
}
