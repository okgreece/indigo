/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, ElementRef,
  AfterViewInit, ViewChild, Injector
} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery'
import * as _ from 'lodash';
import {AnalysisVisualization} from '../visualization';


@Component({
  selector: 'analytics-medoid-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './medoidDiagram.html',
  styles: [`


    .node circle {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 3px;
    }

    .node text {
      font: 12px sans-serif;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }


  `]
})
export class MedoidDiagramVisualization implements AfterViewInit {
  get values(): any {
    return this._values;
  }

  @Input()
  set values(value: any) {
    this._values = value;


    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {

    if (this.values) {
      this.init(this.values);
    }

  }


  @ViewChild('vizCanvas') vizCanvas: any;

  private _values: any;
  @Input()
  public label_x: string;


  @Input()
  public label_y: string;

  private generateMedoidDiagram(data: any) {
    const margin = {top: 20, right: 40, bottom: 50, left: 75};


    const viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    const viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;

    const tooltip = d3.select(this.vizCanvas.nativeElement).append('div')
      .attr('id', 'tooltip');
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const x = d3.scaleLinear()
      .range([0, viewerWidth]);

    const y = d3.scaleLinear()
      .range([viewerHeight, 0]);

    const chart = d3.select(this.vizCanvas.nativeElement).append('svg')
      .attr('width', viewerWidth + margin.left + margin.right)
      .attr('height', viewerHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    chart.append('text')
      .attr('transform', `translate(${viewerWidth / 2},${margin.top - 54})`)
      .attr('id', 'title')
      .text('Doping in Professional Cycling: Le Tour de France at Alpe d\'Huez');


    x.domain([d3.min(data['data.pca'], (d) => Number(d[0])), d3.max(data['data.pca'], (d) => Number(d[0]))]);
    y.domain([d3.min(data['data.pca'], (d) => Number(d[1])), d3.max(data['data.pca'], (d) => Number(d[0]))]);

    chart.append('g')
      .attr('transform', `translate(0,${viewerHeight})`)
      .call(d3.axisBottom(x).ticks(7));


    chart.append('g')
      .call(d3.axisLeft(y).tickValues([1].concat(y.ticks())));


    chart.selectAll('.circle')
      .data(data['data.pca'])
      .enter().append('circle')
      .attr('class', 'circle')
      .attr('cx', (d) => x(d[0]))
      .attr('cy', (d) => y(d[1]))
      .attr('r', 5)
      .style('stroke', 'black')
      .style('stroke-width', '1')
      .style('fill', (d, i) => color(data['clusters'][i]))
      .on('mouseover', (d, i) => {
        tooltip.transition()
          .duration(100)
          .style('opacity', .9);
        tooltip.text(`${ Object.keys(data['raw.data'][i]).map(k => k + ': ' + data['raw.data'][i][k]).join(' - ')} `)
          .style('left', `${d3.event.pageX + 2}px`)
          .style('top', `${d3.event.pageY - 18}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(400)
          .style('opacity', 0);
      });


  }


  init(values: any) {


    const that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

    // this.vizCanvas = this.elementRef;

    this.generateMedoidDiagram(values);


  }


  static type(d: any) {
    d.amount = +d.amount;
    return d;
  }


  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) {
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}


@Component({
  selector: 'analytics-clustering-medoid-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-medoid-diagram [values]="data"></analytics-medoid-diagram>`,
  styles: [`


 .axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}

.line {
  fill: none;
  stroke: #82bf5e;
  stroke-width: 2px;
}

.lineUp80 {
  fill: none;
  stroke: orange;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineUp95 {
  fill: none;
  stroke: red;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineLow95 {
  fill: none;
  stroke: green;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineLow80 {
  fill: none;
  stroke: gold;
  stroke-width: 1.5px;
  stroke-dasharray: 5, 5;

}


svg text {
  font-family: monospace;
}



  `]
})
export class ClusteringMedoidDiagram extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


