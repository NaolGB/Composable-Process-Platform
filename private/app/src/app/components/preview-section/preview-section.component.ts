import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview-section',
  standalone: true,
  imports: [],
  templateUrl: './preview-section.component.html',
  styleUrl: './preview-section.component.scss'
})
export class PreviewSectionComponent {
  @ViewChild('zoomContainer') zoomContainer!: ElementRef;

  zoomLevel: number = 1;

  constructor() { }

  ngOnInit() {
    this.zoomContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault(); // Prevent default scrolling behavior
      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1; // Adjust as needed
      this.zoomLevel = Math.max(0.1, Math.min(this.zoomLevel + zoomDelta, 3)); // Limit zoom level
      this.updateZoom();
    });
  }

  private updateZoom() {
    this.zoomContainer.nativeElement.style.transform = `scale(${this.zoomLevel})`;
  }
}
