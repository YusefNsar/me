import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { SceneManager } from './scene-manager';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GsapAnimatorService } from './gsap-animator';

// control Three renderer and all dom related events & logic
export class Renderer {
  private renderer: THREE.WebGLRenderer;
  private sceneManager: SceneManager;
  private animator: GsapAnimatorService;
  private controls: FlyControls;
  private stats: Stats;

  constructor(container: ElementRef) {
    this.sceneManager = new SceneManager();
    this.initRenderer(container);
  }

  private initRenderer(container: ElementRef) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio); // avoid blur
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.nativeElement.appendChild(this.renderer.domElement);

    this.handleWindowResizing();
    this.addControls();
  }

  startAnimationLoop() {
    const clock = new THREE.Clock();

    this.renderer.setAnimationLoop(() => {
      this.stats.update();
      this.controls.update(clock.getDelta());

      this.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
    });
    this.setUpGsapAnimation();
  }

  private setUpGsapAnimation() {
    const cameraPos = this.sceneManager.camera.position;
    const cameraRotation = this.sceneManager.camera.rotation;

    const bot = this.sceneManager.scene.getObjectByName('bot');
    if (!bot) return;

    const botPos = bot.position;
    const botLookAtCamera = () => {
      bot.lookAt(cameraPos);
    };

    this.animator = new GsapAnimatorService(
      cameraPos,
      cameraRotation,
      botPos,
      botLookAtCamera,
    );

    this.animator.start();
  }

  private handleWindowResizing() {
    window.addEventListener('resize', () => {
      this.sceneManager.camera.aspect = window.innerWidth / window.innerHeight;
      this.sceneManager.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private addControls() {
    const controls = new FlyControls(
      this.sceneManager.camera,
      this.renderer.domElement,
    );
    controls.movementSpeed = 150;
    controls.rollSpeed = Math.PI / 16;
    controls.autoForward = false;
    controls.dragToLook = true;

    controls.addEventListener('change', () =>
      this.sceneManager.printCameraStats(),
    );

    this.controls = controls;

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }
}
