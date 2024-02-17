import { Renderer } from './threeJSRunners/renderer';
import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';

@Component({
  selector: 'app-three-js',
  standalone: true,
  imports: [],
  templateUrl: './three-js.component.html',
  styleUrl: './three-js.component.scss',
})
export class ThreeJsComponent {
  @ViewChild('rendererContainer') rendererContainer: ElementRef | undefined;

  constructor() {
    afterNextRender(() => {
      this.runThreeJS();
    });
  }

  runThreeJS(): void {
    if (!this.rendererContainer) return;

    const renderer = new Renderer(this.rendererContainer);
    renderer.startAnimationLoop();
  }
}
