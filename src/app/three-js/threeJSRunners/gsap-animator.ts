import gsap from 'gsap';

export class GsapAnimatorService {
  private tl = gsap.timeline();

  constructor(
    private cameraPos: THREE.Vector3,
    private cameraRotation: THREE.Euler,
    private botPos: THREE.Vector3,
    private botLookAtCamera: () => void,
  ) {
    this.lookAway();
    this.lookAwayLeft();
    this.goDownWithBot();
  }

  // scene 1 camera start with bot very close but moves away a bit
  lookAway() {
    this.tl.to(this.cameraPos, {
      z: 50,
      ease: 'power2.out',
      // duration: 2.5,
      duration: 0.5,
      delay: 0.3,
    });
  }

  // scene 2 camera start get far and left to show my title
  lookAwayLeft() {
    this.tl.to(this.cameraPos, {
      z: 80,
      x: -30,
      y: 3,
      ease: 'power2.out',
      // duration: 2.5,
      // duration: 0.5,
      delay: 0.5,
    });

    this.tl.to(
      this.cameraRotation,
      {
        x: -0.02,
        y: 0.45,
        z: 0.01,
        ease: 'power1',
        // duration: 2.8,
        duration: 0.8,
        onUpdate: this.botLookAtCamera,
        // onUpdate: () => {
        //   this.botLookAtCamera();
        //   // if (this.bot) {
        //   //   this.bot.lookAt(this.cameraPos);
        //   // }
        // },
      },
      '<',
    );
  }

  // scene 3 bot start to descend and camera follow it
  goDownWithBot() {
    // pos: (-6.55, 3.85, 122.72)
    // rot: (-0.02, 0.45, 0.01)

    // scene three
    this.tl.to(this.botPos, {
      x: this.botPos.x - 80,
      z: this.botPos.z + 10,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: this.botLookAtCamera,
    });

    this.tl.to(
      this.botPos,
      {
        y: this.botPos.y - 80,
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

    // this.tl.to(
    //   this.camera.rotation,
    //   {
    //     x: -0.02,
    //     y: 0.45,
    //     z: 0.01,

    // pos: (-80.53, -38.30, 10.54)
    // rot: (-1.59, 0.02, 0.16)

    // pos: (-81.37, -47.07, 11.64)
    // rot: (-1.51, 0.01, 0.02)
    this.tl.to(
      this.cameraPos,
      {
        x: -81.37,
        y: -47.07,
        z: 11.64,
        ease: 'power2.out',
        // duration: 2.5,
        duration: 0.5,
        // delay: 0.5,
        // delay: 0,
      },
      '<',
    );

    this.tl.to(
      this.cameraRotation,
      {
        x: -1.59,
        y: 0.02,
        z: 0.16,
        ease: 'power2.out',
        // duration: 2.8,
        duration: 0.8,
        onUpdate: this.botLookAtCamera,
      },
      '<',
    );
  }
}
