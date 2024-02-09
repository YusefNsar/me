import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from './three-js/utils/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

@Injectable({
  providedIn: 'root',
})
export class ThreeObjectsService {
  private container: ElementRef | undefined;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

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
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 4);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaa9);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio); // avoid blur
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container?.nativeElement.appendChild(this.renderer.domElement);

    /* LIGHTING */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    const light = new THREE.DirectionalLight();
    light.position.set(0.2, 1, 1);

    this.scene.add(ambient);
    this.scene.add(light);

    /* CONTROL */
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    /* WINDOW */
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  displayCube() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container?.nativeElement.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }

  displayCube2() {
    /* COMPONENTS */
    // const geometry = new THREE.CircleGeometry(1, 32, 0, 2* Math.PI)
    const geometry = this.getStarGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    // animation
    this.renderer.setAnimationLoop(() => {
      mesh.rotateY(0.01);
      mesh.rotateX(0.001);
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

    return loader.loadAsync('robotic_eye.glb', (e) => {
      console.log(e.loaded / e.total);
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
}
