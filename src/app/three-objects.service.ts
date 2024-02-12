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
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root',
})
export class ThreeObjectsService {
  private cameraFov: number = 75;
  private cameraNear: number = 0.1;
  private cameraFar: number = 1000;

  private container: ElementRef | undefined;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private control: TransformControls;
  private stats: Stats;
  private bot: THREE.Group<THREE.Object3DEventMap>;

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
    // this.camera.position.set(-50, 0, 80);
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

    this.bot = new THREE.Group();
    this.scene.add(this.bot);

    // TODO: REMOVE
    this.printCameraStats();
    setTimeout(() => this.printCameraStats(), 4000);
    this.fillSceneWithParticles(100);
    this.makeGround();

    /* HELPERS */

    // const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.addEventListener('change', () => this.printCameraStats());
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
      glt.scene.up.set(0, 1, 0);

      this.bot.add(glt.scene);
    });

    // this.scene.add(mesh);

    // todo: remove
    const controls = new FlyControls(this.camera, this.renderer.domElement);
    controls.movementSpeed = 150;
    controls.rollSpeed = Math.PI / 16;
    controls.autoForward = false;
    controls.dragToLook = true;
    controls.addEventListener('change', () => this.printCameraStats());

    // animation
    const clock = new THREE.Clock();
    this.renderer.setAnimationLoop(() => {
      // mesh.rotateY(0.01);
      // mesh.rotateX(0.001);

      this.stats.update();

      controls.update(clock.getDelta());

      this.renderer.render(this.scene, this.camera);
    });
    this.startCameraAnimation();
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

  fillSceneWithParticles(numParticles: number) {
    const particleGroup = new THREE.Group();

    // Generate random positions for particles within a volume
    for (let i = 0; i < numParticles; i++) {
      const particle = this.createParticle();
      particle.position.set(
        Math.random() * 1000 - 500, // X position (-5 to 5)
        Math.random() * 1000 - 500, // Y position (-5 to 5)
        Math.random() * 1000 - 500, // Z position (-5 to 5)
      );
      particleGroup.add(particle);
    }

    // Add particles to the scene
    this.scene.add(particleGroup);
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

  makeGround() {
    const geometry = new THREE.BoxGeometry(500, 10, 500, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ground = new THREE.Mesh(geometry, material);
    ground.position.set(0, -500, 0);
    this.scene.add(ground);
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

  startCameraAnimation() {
    // initial camera animation (move away)
    const tl = gsap.timeline();

    // scene one
    tl.to(this.camera.position, {
      z: 50,
      ease: 'power2.out',
      // duration: 2.5,
      duration: 0.5,
      delay: 0.3,
    });

    gsap.registerPlugin(ScrollTrigger);

    // scene two
    tl.to(this.camera.position, {
      z: 80,
      x: -30,
      y: 3,
      ease: 'power2.out',
      // duration: 2.5,
      // duration: 0.5,
      delay: 0.5,
    });

    tl.to(
      this.camera.rotation,
      {
        x: -0.02,
        y: 0.45,
        z: 0.01,
        ease: 'power1',
        // duration: 2.8,
        duration: 0.8,
        onUpdate: () => {
          if (this.bot) {
            this.bot.lookAt(this.camera.position);
          }
        },
      },
      '<',
    );

    // pos: (-6.55, 3.85, 122.72)
    // rot: (-0.02, 0.45, 0.01)

    // scene three
    tl.to(this.bot.position, {
      x: this.bot.position.x - 80,
      z: this.bot.position.z + 10,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: () => {
        this.bot.lookAt(this.camera.position);
      },
    });

    tl.to(
      this.bot.position,
      {
        y: this.bot.position.y - 80,
        duration: 0.8,
        ease: 'power1.in',
      },
      '<',
    );

    // z: 80,
    //   x: -30,
    //   y: 3,
    //   ease: 'power2.out',
    //   // duration: 2.5,
    //   // duration: 0.5,
    //   delay: 0.5,
    // });

    // tl.to(
    //   this.camera.rotation,
    //   {
    //     x: -0.02,
    //     y: 0.45,
    //     z: 0.01,

    // pos: (-80.53, -38.30, 10.54)
    // rot: (-1.59, 0.02, 0.16)

    // pos: (-81.37, -47.07, 11.64)
    // rot: (-1.51, 0.01, 0.02)
    tl.to(
      this.camera.position,
      {
        x: -81.37,
        y: -47.07,
        z: 11.64,
        ease: 'power2.out',
        duration: 2.5,
        delay: 0.5,
      },
      '<',
    );

    tl.to(
      this.camera.rotation,
      {
        x: -1.59,
        y: 0.02,
        z: 0.16,
        ease: 'power2.out',
        duration: 2.8,
        onUpdate: () => {
          if (this.bot) {
            this.bot.lookAt(this.camera.position);
          }
        },
      },
      '<',
    );
  }
}
