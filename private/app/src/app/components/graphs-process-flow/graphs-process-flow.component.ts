import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-graphs-process-flow',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './graphs-process-flow.component.html',
  styleUrl: './graphs-process-flow.component.scss'
})
export class GraphsProcessFlowComponent {
  @ViewChild('diagram') private diagramRef!: ElementRef<SVGElement>;
  @Input() processFlow: any;

  // HostListener to react to window resize events
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.drawProcessMap(); // Redraw the graph on window resize to adjust to new size
  }

  ngAfterViewInit(): void {
    this.drawProcessMap();
  }

  drawProcessMap() {
    const svgElement = this.diagramRef.nativeElement;
    const width = svgElement.clientWidth; // Get the dynamic width of the SVG element
    const height = svgElement.clientHeight; // Get the dynamic height of the SVG element
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove(); // Clear any existing SVG content

    const nodes = this.processNodes();
    const links = this.processLinks();

    // Calculate optimal spacing based on the number of nodes and SVG dimensions
    const verticalSpacing = height / (nodes.length + 1);

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${width / 2}, ${verticalSpacing * (i + 1)})`);

    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', 'steelblue');

    nodeGroups.append('text')
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text(d => d.name);

    // Draw links
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', width / 2)
      .attr('x2', width / 2)
      .attr('y1', d => verticalSpacing * (nodes.findIndex(node => node.id === d.source) + 1))
      .attr('y2', d => verticalSpacing * (nodes.findIndex(node => node.id === d.target) + 1))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  }

  processNodes() {
    let nodes = [];
    const steps = this.processFlow.steps;
    for (let stepKey in steps) {
      const step = steps[stepKey];
      nodes.push({
        id: stepKey,
        name: step.display_name
      });
    }
    return nodes;
  }

  processLinks() {
    let links = [];
    const steps = this.processFlow.steps;
    for (let stepKey in steps) {
      const step = steps[stepKey];
      if (step.next_step) {
        if (step.next_step.has_multiple_next_steps) {
          for (let conditionKey in step.next_step.conditions) {
            const condition = step.next_step.conditions[conditionKey];
            links.push({
              source: stepKey,
              target: condition.next_step,
            });
          }
        } else {
          links.push({
            source: stepKey,
            target: step.next_step.next_step
          });
        }
      }
    }
    console.log(links);
    return links;
  }  
}
