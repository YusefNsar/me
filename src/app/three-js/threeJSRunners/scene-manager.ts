import * as THREE from 'three';
import { Lights } from './sceneElements/Lights';
import { Bot } from './sceneElements/Bot';
import { Particles } from './sceneElements/Particles';
import { GroundShards } from './sceneElements/GroundShards';
import { Octahedron } from './sceneElements/Octahedron';
import { BeamRings } from './sceneElements/BeamRings';

export class SceneManager {
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;

  constructor() {
    this.initCamera();
    this.initScene();
    this.initElements();
    this.initHelpers();
  }

  initCamera() {
    const cameraFov = 75;
    const cameraNear = 0.1;
    const cameraFar = 2000;

    this.camera = new THREE.PerspectiveCamera(
      cameraFov,
      window.innerWidth / window.innerHeight,
      cameraNear,
      cameraFar,
    );
    this.hotReloadCamera();
    // this.camera.position.set(-50, 0, 80);
    // this.camera.lookAt(0, 0, 0);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
  }

  initElements() {
    const elements: SceneElement[] = [
      new Lights(),
      new Bot(),
      new Particles(),
      new GroundShards(),
      new Octahedron(),
      new BeamRings(),
    ];

    elements.forEach((ele) => ele.addElement(this.scene));
  }

  initHelpers() {
    // this.control = new TransformControls(this.camera, this.renderer.domElement);

    // this.control.addEventListener('dragging-changed', function (event) {
    //   orbit.enabled = !event.value;
    // });
    // this.scene.add(this.control);
    // this.control.attach(light);

    this.scene.add(new THREE.AxesHelper(100));
    // this.scene.add(new THREE.CameraHelper(this.camera));
    this.scene.add(new THREE.GridHelper(49, 49));
    // this.scene.add(new THREE.DirectionalLightHelper(light, 5));
    // this.scene.add(new THREE.HemisphereLightHelper(ambient, 5));

    // this.scene.add(new THREE.PointLightHelper(pointLight, 1));
    // this.scene.add(new THREE.SpotLightHelper(spotLight));
  }

  printCameraStats() {
    const px = this.camera.position.x.toFixed(2);
    const py = this.camera.position.y.toFixed(2);
    const pz = this.camera.position.z.toFixed(2);

    const rx = this.camera.rotation.x.toFixed(2);
    const ry = this.camera.rotation.y.toFixed(2);
    const rz = this.camera.rotation.z.toFixed(2);

    console.log(`pos: (${px}, ${py}, ${pz})`);
    console.log(`rot: (${rx}, ${ry}, ${rz})`);
  }

  hotReloadCamera() {
    const cameraParams = localStorage.getItem('camera');

    if (!cameraParams) {
      this.camera.position.set(0, 0, 10);
      setInterval(() => this.saveCameraParams(), 1000);
      return;
    }

    const camParams = JSON.parse(cameraParams) as CameraSave;
    this.camera.position.set(...camParams.pos);
    this.camera.rotation.set(...camParams.rot);

    setInterval(() => this.saveCameraParams(), 1000);
  }

  saveCameraParams() {
    const cp = this.camera.position;
    const cr = this.camera.rotation;

    const params: CameraSave = {
      pos: [cp.x, cp.y, cp.z],
      rot: [cr.x, cr.y, cr.z],
    };

    localStorage.setItem('camera', JSON.stringify(params));
  }
}

export interface SceneElement {
  addElement(scene: THREE.Scene): void;
}

export interface CameraSave {
  pos: THREE.Vector3Tuple;
  rot: THREE.Vector3Tuple;
}

export interface Shader extends THREE.ShaderMaterialParameters {}
