import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class ThreeObjectsService {
  private container: ElementRef | undefined;

  constructor() { }

  activeScene(container: ElementRef) {
    this.container = container

    this.displayCube2()
  }

  displayCube(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

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
    /* BASIC */
    // camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 4)

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaa9);

    // renderer
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio) // avoid blur
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.container?.nativeElement.appendChild(renderer.domElement);

    /* LIGHTING */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xBBBBFF, 0.3)
    const light = new THREE.DirectionalLight()
    light.position.set(0.2, 1, 1);

    scene.add(ambient)
    scene.add(light)

    /* COMPONENTS */
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({color: 0xff0000})
    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    /* CONTROL */
    const controls = new OrbitControls(camera, renderer.domElement)

    // animation
    renderer.setAnimationLoop(() => {
      mesh.rotateY(0.01)
      mesh.rotateX(0.001)
      renderer.render(scene, camera)
    })
  }
}
