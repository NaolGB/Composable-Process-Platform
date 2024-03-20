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

  private zoom!: d3.ZoomBehavior<Element, unknown>; // Add this line to define the zoom behavior

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
    this.zoom = d3.zoom().on('zoom', (event) => {
      zoomG.attr('transform', event.transform);
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
