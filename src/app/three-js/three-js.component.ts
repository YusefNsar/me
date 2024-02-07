import { AfterRenderRef, AfterViewInit, Component, ElementRef, OnInit, ViewChild, afterNextRender } from '@angular/core';
import { ThreeObjectsService } from '../three-objects.service';

@Component({
  selector: 'app-three-js',
  standalone: true,
  imports: [],
  templateUrl: './three-js.component.html',
  styleUrl: './three-js.component.scss'
})
export class ThreeJsComponent {
  @ViewChild('rendererContainer') rendererContainer: ElementRef | undefined;

  constructor(private th3: ThreeObjectsService) {
    afterNextRender(() => {
      console.log('sdfds')
      this.runThreeJS()
    })
  }

  runThreeJS(): void {

    if (!this.rendererContainer) return;

    this.th3.activeScene(this.rendererContainer)
  }
}
