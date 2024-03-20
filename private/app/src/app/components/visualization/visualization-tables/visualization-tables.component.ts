import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-visualization-tables',
  standalone: true,
  imports: [],
  templateUrl: './visualization-tables.component.html',
  styleUrl: './visualization-tables.component.scss',
})
export class VisualizationTablesComponent {
  @ViewChild('chartContainer', { static: false }) private chartContainer!: ElementRef;
  @ViewChild('chart') private chartElement!: ElementRef;

  private zoom!: d3.ZoomBehavior<Element, unknown>; 
  zoomLevel = '1';


  constructor() {}

  ngAfterViewInit() {
    this.createChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.createChart(); // TODO: Optimize this to not fully recreate the chart on resize
  }

  resetZoom() {
    const svg = d3.select(this.chartElement.nativeElement);
    svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity); // Reset zoom
  }

  updateZoomLevel(scale: number) {
    this.zoomLevel = scale.toFixed(2);
  }

  get zoomLevelFormatted() {
    const zoomLevelNumber = Number(this.zoomLevel) * 100;
    let formattedZoomLevel = '';

    if (zoomLevelNumber >= 1000000000) {
      formattedZoomLevel = (zoomLevelNumber / 1000000000).toFixed(2) + 'B';
    } else if (zoomLevelNumber >= 1000000) {
      formattedZoomLevel = (zoomLevelNumber / 1000000).toFixed(2) + 'M';
    } else if (zoomLevelNumber >= 1000) {
      formattedZoomLevel = (zoomLevelNumber / 1000).toFixed(2) + 'K';
    } else {
      formattedZoomLevel = zoomLevelNumber.toFixed(0);
    }

    return formattedZoomLevel + '%';
  }

  createChart() {
    const container = this.chartContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Initialize the SVG and zoom behavior
    const svg = d3.select(this.chartElement.nativeElement)
      .attr('width', width)
      .attr('height', height);
    svg.selectAll('*').remove(); // Clear previous SVG elements

    // Initialize zoom behavior
    this.zoom = d3.zoom()
      .scaleExtent([0.01, 100]) // Limit zoom extent
      .on('zoom', (event) => {
          zoomG.attr('transform', event.transform);
          this.updateZoomLevel(event.transform.k);
      });
    svg.call(this.zoom); // Apply zoom behavior to the SVG

    // Background pattern that doesn't scale on zoom
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#dot-pattern)');

    // Group for zoomable elements
    const zoomG = svg.append('g'); // This group will be transformed by zoom

    zoomG
      .append('defs')
      .append('pattern')
      .attr('id', 'dot-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('circle')
      .attr('cx', 1)
      .attr('cy', 1)
      .attr('r', 1)
      .style('fill', 'gray');

    // Example zoomable shape
    zoomG
      .append('rect')
      .attr('x', width / 4)
      .attr('y', height / 4)
      .attr('width', width / 2)
      .attr('height', height / 2)
      .style('fill', 'steelblue');
  }
  
}
