import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from './three-js/utils/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Stats from 'three/examples/jsm/libs/stats.module';

@Injectable({
  providedIn: 'root',
})
export class ThreeObjectsService {
  private cameraFov: number = 60;
  private cameraNear: number = 0.1;
  private cameraFar: number = 1000;

  private container: ElementRef | undefined;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private control: TransformControls;
  private stats: Stats;

  constructor() {}

  activeScene(container: ElementRef) {
    this.container = container;

    this.initScene();
    this.displayCube2();
  }

  initScene() {
    /* BASIC */

    // camera
    this.camera = new THREE.PerspectiveCamera(
      this.cameraFov,
      window.innerWidth / window.innerHeight,
      this.cameraNear,
      this.cameraFar,
    );
    this.camera.position.set(0, 0, 10);
    // this.camera.lookAt(0, 0, 0);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio); // avoid blur
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container?.nativeElement.appendChild(this.renderer.domElement);

    /* LIGHTING */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.2);
    const light = new THREE.DirectionalLight();
    light.position.set(5, 5, 5);

    this.scene.add(ambient);
    this.scene.add(light);

    /* HELPERS */
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
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

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    /* WINDOW */
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  displayCube2() {
    /* COMPONENTS */
    // const geometry = new THREE.CircleGeometry(1, 32, 0, 2* Math.PI)
    const geometry = this.getStarGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);

    this.loadGLTF().then((glt) => {
      glt.scene.scale.set(0.5, 0.5, 0.5);
      glt.scene.rotateY(-Math.PI / 2);
      // glt.scene.position.set(10, 10, 10);
      this.scene.add(glt.scene);
    });

    // this.scene.add(mesh);

    // animation
    this.renderer.setAnimationLoop(() => {
      mesh.rotateY(0.01);
      mesh.rotateX(0.001);
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  getStarGeometry(innerRadius = 0.4, outerRadius = 0.8, points = 5) {
    const shape = new THREE.Shape();

    const PI2 = Math.PI * 2;
    const inc = PI2 / (points * 2);

    shape.moveTo(outerRadius, 0);
    let inner = true;

    for (let theta = inc; theta < PI2; theta += inc) {
      const radius = inner ? innerRadius : outerRadius;

      shape.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
      inner = !inner;
    }

    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: true,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  async loadGLTF(): Promise<GLTF> {
    const loader = new GLTFLoader().setPath('../../assets');
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('three/examples/jsm/libs/draco');

    loader.setDRACOLoader(dracoLoader);

    return loader.loadAsync('/core_from_portal_2.glb', (e) => {
      console.log('asdfsafa', e.loaded / e.total);
    });
  }

  setEnvironment() {
    const loader = new RGBELoader();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      '../../assets/hdr/venice_sunset_1k.hdr',
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        self.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error('An error occurred setting the environment');
      },
    );
  }

  // startCameraAnimation() {
  //   setInterval();
  // }
}
