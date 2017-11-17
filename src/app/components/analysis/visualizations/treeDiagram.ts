/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, ElementRef,
  AfterViewInit, ViewChild, Injector
} from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery'
import * as _ from 'lodash';
import * as d3tip from 'd3-tip';
import {AnalysisVisualization} from '../visualization';
import {AnalysisCall} from '../../../models/analysis/analysisCall';


@Component({
  selector: 'analytics-tree-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './treeDiagram.html',
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
export class TreeDiagramVisualization implements AfterViewInit {
  get values(): any {
    return this._values;
  }

  @Input()
  set values(value: any) {
    this._values = value;





    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {

    if (this.values)
      this.init(this.values);

  }


  @ViewChild('vizCanvas') vizCanvas: any;

  private _values: any;



  @Input()
  public analysisCall: AnalysisCall;

  @Input()
  public label_y: string;
  private generateTreeDiagram(data: any) {

    const margin = {top: 20, right: 40, bottom: 50, left: 75};
    const originalData = data;
    data = data.tree;

    const viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    const viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;


    const div = d3.select(this.vizCanvas.nativeElement).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .text(' ');

    const svg = d3.select(this.vizCanvas.nativeElement).append('svg')
      .attr('width', viewerWidth + margin.left + margin.right)
      .attr('height', viewerHeight + margin.top + margin.bottom);

    svg.append('rect')
      .attr('width', viewerWidth)
      .attr('height', viewerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', zoomed));

    const g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let i = 0,
      duration = 750,
      root;


    const that = this;

    function zoomed() {
      const transform = d3.event.transform;
      g.attr('transform', function() {
        return transform.translate(margin.left, margin.top).toString();
      });

    }



// declares a tree layout and assigns the size
    const treemap = d3.tree().size([viewerHeight, viewerWidth]);

// Assigns parent, children, height, depth
    root = d3.hierarchy(data, function(d) { return d.children; });
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

// Collapse after the second level
   // root.children.forEach(collapse);

    update(root);

// Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      const treeData = treemap(root);

      // Compute the new tree layout.
      const nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function(d){ d.y = d.depth * 180});

      // ****************** Nodes section ***************************

      // Update the nodes...
      const node = g.selectAll('g.node')
        .data(nodes, function(d: any) {return d.id || (d.id = ++i); });


      // Enter any new modes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click);


      nodeEnter.on('mouseover', function (event) {
        const a = that.analysisCall;
        if ((<any>event.data).leaf[0] === true) {
          div.style('opacity', 1);
          div.text(that.analysisCall.inputs.dimensions[0].fullLabel + ': ' + originalData['raw.data'][(<any>event.data).value[0] - 1][that.analysisCall.inputs.dimensions[0].ref]);
        }
      })
        .on('mouseout', function (event) {
          div.style('opacity', 0);
        });

      // Add Circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', function(d: any) {
          return d.children !== undefined ? 'lightsteelblue' : '#fff';
        });

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', function(d: any) {
          return d.children || d._children ? -13 : 13;
        })
        .attr('text-anchor', function(d: any) {
          return d.children || d._children ? 'end' : 'start';
        })
        .text(function(d: any) { if (!d.children) {
          return d.data.name ;
        } else {
          return '';
        } });

      // UPDATE
      const nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', function(d: any) {
          return d.children!==undefined ? 'lightsteelblue' : '#fff';
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      const link = g.selectAll('path.link')
        .data(links, function(d: any) { return d.id; });

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d){
          const o = {x: source.x0, y: source.y0};
          return diagonal(o, o)
        });

      // UPDATE
      const linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

      // Remove any exiting links
      const linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          const o = {x: source.x, y: source.y};
          return diagonal(o, o)
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d: any){
        d.x0 = d.x;
        d.y0 = d.y;
      });



      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }



  }


  init(values: any) {


    const that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

   // this.vizCanvas = this.elementRef;

    this.generateTreeDiagram(values);


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
  selector: 'analytics-clustering-tree-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-tree-diagram [values]="data"></analytics-tree-diagram>`,
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
export class ClusteringTreeDiagram  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


