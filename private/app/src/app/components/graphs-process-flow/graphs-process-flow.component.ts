import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  @Input() processFlow: any;
  @Input() key: number | undefined;
  @ViewChild('chartContainer', { static: false }) private chartContainer!: ElementRef;

  @Output() processFlowSelector: EventEmitter<string> = new EventEmitter();

  relationship: {[key: string]: {x: number, y: number, next_steps: string[], parent_steps: string[], display_name: string}} = {};

  ngOnInit(): void {
    this.createRelationship();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  handleNodeClick(event: MouseEvent, key: string): void {
    event.stopPropagation(); // Prevent the svg click event from firing
    this.processFlowSelector.emit(key);
  }

  handleSvgClick(): void {
    this.processFlowSelector.emit('__select_process_type');
  }

  createRelationship() {
    const stepIds: string[] = Object.keys(this.processFlow.steps);
    stepIds.forEach(stepId => {
      this.relationship[stepId] = {
        display_name: this.processFlow.steps[stepId].display_name,
        x: 0,
        y: 0,
        next_steps: [],
        parent_steps: []
      }
    })

    // create relationship object
    const steps = this.processFlow.steps;
    for (let stepKey in steps) {
      const step = steps[stepKey];

      if (step.next_step) {
        for (let conditionKey in step.next_step.conditions) {
          const condition = step.next_step.conditions[conditionKey];
          this.relationship[stepKey].next_steps.push(condition.next_step);
          this.relationship[condition.next_step].parent_steps.push(stepKey);
        }
      }
    }

    const connectedNodes = new Set<string>();
    Object.keys(this.relationship).forEach(key => {
      if (this.relationship[key].next_steps.length > 0) {
        connectedNodes.add(key);
        this.relationship[key].next_steps.forEach(nextStep => {
          connectedNodes.add(nextStep);
        });
      }
    });

    const unconnectedNodes = stepIds.filter(key => !connectedNodes.has(key));

    // identify start node
    let startStepId: string | undefined = undefined;
    connectedNodes.forEach(key => {
      if (this.relationship[key].parent_steps.length === 0) {
        startStepId = key;
      }
    })

    if (!startStepId) {
      startStepId = unconnectedNodes[0];
    }

    // calculate x and y for connected nodes
    const startStep = this.relationship[startStepId];
    const visited = new Set<string>(startStepId);
    if (startStep) {
      visited.add(startStepId);

      const queue: string[] = [startStepId];
      let currentY = 0;
      while (queue.length > 0) {
        currentY = currentY + 1;
        const current = queue.pop();
        const currentStep = this.relationship[current!];
        const nextSteps = currentStep.next_steps;
        nextSteps.forEach((nextStep, index) => {
          if (!visited.has(nextStep)) {
            visited.add(nextStep);
            queue.push(nextStep);
            this.relationship[nextStep].x = index;
            this.relationship[nextStep].y = currentY;
          }
        });
      }
    }
    

    // calculat x and y for unconnected nodes
    const maxy = Math.max(...stepIds.map(key => this.relationship[key].y));
    stepIds.forEach(key => {
      if(!visited.has(key)) {
        this.relationship[key].x = 0;
        this.relationship[key].y = maxy + 1;
      }
    })
  }

  private createChart(): void {
    const arrowheadSize = 5;
    if (!this.relationship) return;
  
    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
  
    d3.select(element).select('svg').remove(); // Clear any existing SVG
  
    const svg = d3.select<SVGSVGElement, unknown>(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .on('click', () => this.handleSvgClick());

    // Define the marker in the defs section of the SVG
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') // Coordinates of the viewBox
      .attr('refX', 5) // x position for the reference point of the marker
      .attr('refY', 0) // y position for the reference point of the marker
      .attr('orient', 'auto')
      .attr('markerWidth', arrowheadSize)
      .attr('markerHeight', arrowheadSize)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5') // Path for the arrowhead
      .attr('fill', 'black');
  
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const group = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 100])
      .on('zoom', (event) => {
      group.attr('transform', event.transform);
    });
  
    svg.call(zoom);
  
    // Update the scale to fit the SVG taking margins into account
    const maxX = Math.max(...Object.values(this.relationship).map(d => d.x).filter(x => x !== undefined)) || 1;
    const maxY = Math.max(...Object.values(this.relationship).map(d => d.y).filter(y => y !== undefined)) || 1;

    const xScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([0, innerHeight]);

    // Drawing adjusted lines
Object.entries(this.relationship).forEach(([key, value]) => {
  value.next_steps.forEach(childKey => {
    const child = this.relationship[childKey];
    if (child) {
      const centerX1 = xScale(value.x) + 25;
      const centerY1 = yScale(value.y) + 25;
      const topY1 = yScale(value.y);
      const bottomY1 = yScale(value.y) + 50;
      const centerX2 = xScale(child.x) + 25;
      const centerY2 = yScale(child.y) + 25;

      const isReverse = value.y > child.y; // Check if the line is going upwards
      const isSibling = value.y === child.y; // Check if the nodes are on the same level
      let pathD;

      if (isReverse) {
        // For reverse direction: step up before moving horizontally
        const horizontalOffset = 5; // Offset to avoid overlapping lines
        pathD = `M ${centerX1+horizontalOffset} ${topY1} V ${centerY2} H ${centerX2+25+arrowheadSize}`;
      } 
      // else if (isSibling) {
      //   // For siblings: step horizontally to differentiate
      //   const offsetX = Math.abs(centerX2 - centerX1) + 50; // Use a greater horizontal offset for siblings
      //   pathD = `M ${centerX1} ${centerY1} H ${centerX1 + offsetX} V ${centerY2} H ${centerX2}`;
      // } 
      else {
        // Normal downward connection: a simple step down, then over
        const midY = centerY1 + (centerY2 - centerY1) / 2;
        pathD = `M ${centerX1} ${bottomY1} V ${midY} H ${centerX2} V ${centerY2-25-arrowheadSize}`;
      }

      group.append('path')
        .attr('d', pathD)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');
    }
  });
});

          
    Object.entries(this.relationship).forEach(([key, value]) => {
      const nodeGroup = group.append('g'); // Create a group for each node and text

      // Rectangle for the node
      nodeGroup.append('rect')
          .attr('x', xScale(value.x))
          .attr('y', yScale(value.y))
          .attr('width', 50)  // Static size for now, but will be scaled by zoom
          .attr('height', 50)
          .attr('rx', 1) // Set the x-axis radius of the rectangle to 1px
          .attr('ry', 1) // Set the y-axis radius of the rectangle to 1px
          .style('stroke', 'black')
          .style('fill', 'transparent') // Set the fill color to none
          .on('click', (event) => this.handleNodeClick(event, key));

      // Text configuration
      const displayName = this.relationship[key].display_name;
      const charsPerLine = 10;
      const lineHeight = 20; // Line height in pixels
      const lines = []; // Array to hold lines of text
      for (let start = 0; start < displayName.length; start += charsPerLine) {
          lines.push(displayName.substring(start, start + charsPerLine));
      }

      // Background rectangle for the text, dynamically sized
      const textWidth = 8 * charsPerLine; // Example width based on character size
      const textHeight = lines.length * lineHeight;
      nodeGroup.append('rect')
          .attr('x', xScale(value.x) + 25 - (textWidth / 2))
          .attr('y', yScale(value.y) + 70 - textHeight / 2)
          .attr('width', textWidth + (8))
          .attr('height', textHeight + (8))
          .attr('rx', 5)
          .attr('ry', 5)
          .style('fill', 'white');

      // Text element with multiple tspan for each line
      const textElement = nodeGroup.append('text')
          .attr('x', xScale(value.x) + 25)
          .attr('y', yScale(value.y) + 70 - textHeight / 2 + lineHeight)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('pointer-events', 'none');

      lines.forEach((line, index) => {
          textElement.append('tspan')
              .attr('x', xScale(value.x) + 25)
              .attr('dy', `${index > 0 ? lineHeight : 0}px`)
              .text(line);
      });

      const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.1, 100])
          .on('zoom', (event) => {
              group.attr('transform', event.transform);
          });

      svg.call(zoom);
    });

  }
  
}
