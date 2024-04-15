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
  @Input() processFlow: any;
  @ViewChild('chartContainer', { static: false }) private chartContainer!: ElementRef;

  relationship: {[key: string]: {x: number, y: number, next_steps: string[]}} = {};

  ngOnInit(): void {
    this.createRelationship();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createRelationship() {
    const stepIds: string[] = Object.keys(this.processFlow.steps);
    stepIds.forEach(stepId => {
      this.relationship[stepId] = {
        x: 0,
        y: 0,
        next_steps: []
      }
    })
    const steps = this.processFlow.steps;
    for (let stepKey in steps) {
      const step = steps[stepKey];
      if (step.next_step) {
        if (step.next_step.has_multiple_next_steps) {
          for (let conditionKey in step.next_step.conditions) {
            const condition = step.next_step.conditions[conditionKey];
            this.relationship[stepKey].next_steps.push(condition.next_step);
          }
        } else {
          this.relationship[stepKey].next_steps.push(step.next_step.next_step);
        }
      }
    }

    console.log(this.relationship);

    // calculate x and y for connected nodes
    const startStep = this.relationship['start'];
    const visited = new Set<string>();
    if (startStep) {
      visited.add('start');

      const queue: string[] = ['start'];
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
            this.relationship[nextStep].y = currentStep.y + currentY;
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

    console.log(this.relationship);
  }

  private createChart(): void {
    if (!this.relationship) return;
  
    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
  
    d3.select(element).select('svg').remove(); // Clear any existing SVG
  
    const svg = d3.select<SVGSVGElement, unknown>(element).append('svg')
      .attr('width', width)
      .attr('height', height);
  
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
  
      Object.entries(this.relationship).forEach(([key, value]) => {
        const nodeGroup = group.append('g'); // Create a group for each node and text
      
        nodeGroup.append('rect')
          .attr('x', xScale(value.x))
          .attr('y', yScale(value.y))
          .attr('width', 50)  // Static size for now, but will be scaled by zoom
          .attr('height', 50)
          .style('fill', 'steelblue');
      
        nodeGroup.append('text')
          .attr('x', xScale(value.x) + 25) 
          .attr('y', yScale(value.y) + 70) 
          .attr('text-anchor', 'middle') 
          .text(key) 
          .style('font-size', '16px'); 
      
        
        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.1, 100]) 
          .on('zoom', (event) => {
            group.attr('transform', event.transform);
          });
      
        svg.call(zoom);
      });
  }
  
}
