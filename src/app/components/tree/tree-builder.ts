import {Cube} from "../../models/cube";
import {Observable} from "rxjs/Rx";
import {ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Attribute as MetadataAttribute, ElementRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';

import Timer = NodeJS.Timer;
import {ExpressionTree} from "../../models/expressionTree";
import {State, getTree} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../models/expressionNode";
import {AggregateNode} from "../../models/aggregate/aggregateNode";
import {ApiCubesService} from "../../services/api-cubes";
import {TreeExecution} from "../../services/tree-execution";
import {FuncNode, FuncType} from '../../models/func/funcNode'
import * as _ from 'lodash';

import * as d3 from 'd3';
import {ValueNode} from "../../models/value/valueNode";
import {Value} from "../../models/value/val";
import * as $ from 'jquery';
import {ReplaceAction} from "../../actions/tree";
import {AggregateRequest} from "../../models/aggregate/aggregateRequest";
import {HierarchyPointNode} from "d3-hierarchy";
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Tree Builder` component loaded asynchronously');

@Component({
  selector: 'bc-tree-builder',
  changeDetection: ChangeDetectionStrategy.OnPush, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  template: require('./tree-builder.html'),
  styles: [`
     .node {
      cursor: pointer;
    }

    .overlay{
      background-color:#EEE;
    }
    
    .nodeSymbol{
      fill:white;
      font-weight:bold;
    
    }

    .node circle {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 2px;
    }

    .node text {
      font-size:10px;
      font-family:sans-serif;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }

    .templink {
      fill: none;
      stroke: indigo;
      stroke-width: 3px;
    }

    .ghostCircle.show{
      display:block;
    }

    .ghostCircle, .activeDrag .ghostCircle{
      display: none;
    }
    
    .expanded-indicator{
      cursor: pointer;
    }
    
    #drawingCanvas svg{
      width:100%;
      height: 600px;
    }
    
    a.action-anchor{
      cursor:pointer;
      margin: auto 10px ;
    
    }
    
    .md-tab-label{
      min-width:100%!important;
    
    }
    
    md-toolbar-row [md-mini-fab]{
      margin:2px;
    
    }
    
    .md-tab-body-wrapper{
    
      max-height:700px;
      overflow-y:auto!important;
    
    }
    
    span.node-key {
      cursor: pointer;
    }
    
    md-toolbar.md-primary {
    color: rgba(0, 0, 0, 0.87); 
}
  `]
})
export class TreeBuilder implements AfterViewInit {

  @Input() expressionTree: Observable<ExpressionTree>;
  expressionTreeInstance: ExpressionTree;
  length: number;
  @ViewChild('drawingCanvas') drawingCanvas;
  @ViewChild('jsonModal') jsonModal: ModalDirective;

  constructor(@Inject(ElementRef) elementRef: ElementRef,
              @MetadataAttribute('width') width: number,
              @MetadataAttribute('height') height: number,
              private store: Store<State>,
              private rudolfCubesService: ApiCubesService,
              private treeExecution: TreeExecution, private zone: NgZone, private ref: ChangeDetectorRef) {

    this.width = width;
    this.height = height;
    this.expressionTree = store.let(getTree);

    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


  _cube: Cube;

  public get cube() {
    return this._cube;
  }

  @Input()

  public set cube(value: Cube) {
    let that = this;
    that._cube = value;
  }

  width: number;
  height: number;

  // size of the diagram
  @Input()
  viewerWidth: number;// $(document).width();
  @Input()

  viewerHeight: number;// $(document).height();
  root:any;


  aggregates = [];
  duration = 750;


  ngAfterViewInit() {

    window.setTimeout(() => {
      /*  this.baseSvg = d3.select(this.drawingCanvas.nativeElement).append("svg").attr("width", this.viewerWidth)
       .attr("height", this.viewerHeight)
       .call(this.zoomListener);*/
      let that = this;
      this.expressionTree.subscribe(function (expressionTree_) {
        let expressionTree = new ExpressionTree().deserialize(JSON.parse(JSON.stringify(expressionTree_)));

        if (that.tree && that.expressionTreeInstance.root == expressionTree.root) {
          that.expressionTreeInstance = expressionTree;
          //   that.update(expressionTree.root);
        }
        else {
          that.expressionTreeInstance = new ExpressionTree().deserialize(JSON.parse(JSON.stringify(expressionTree_)));

          //that.baseSvg.html("");

          that.init();

        }


      });
    });


  }

  tree: any;

  activeNode: any;


  treemap: any;

  g:any;

  init() {



    let treeData = this.expressionTreeInstance.root;
    let margin = {top: 20, right: 90, bottom: 30, left: 90},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    d3.select(this.drawingCanvas.nativeElement).html("");
    let svg = d3.select(this.drawingCanvas.nativeElement).append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom);

    this.g = svg

        .append("g")
      .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");



    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

    let that = this;

    function zoomed() {
      let transform = d3.event.transform;
      that.g.attr("transform", function() {
        return transform.translate(margin.left,margin.top).toString();
      });
    }


// declares a tree layout and assigns the size
    this.treemap = d3.tree<ExpressionNode>().size([height, width]);

// Assigns parent, children, height, depth
    this.root = d3.hierarchy(treeData, function (d) {
      return d.children;
    });
    this.root.x0 = height / 2;
    this.root.y0 = 0;

// Collapse after the second level
    if (this.root.children)
      this.root.children.forEach(collapse);

    this.activeNode = this.root;

    this.update(this.root);

// Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null
      }
    }




  }
  update(source) {



    // Assigns the x and y position for the nodes
    let treeData = this.treemap(this.root);

    // Compute the new tree layout.
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = this.g.selectAll('g.node')
      .data(nodes, function (d: HierarchyPointNode<ExpressionNode>) {
        return d.id ;
      });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function (d: HierarchyPointNode<ExpressionNode>) {
        return d.children ? "lightsteelblue" : "#fff";
      });


    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children ? -15 : 15;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function (d:HierarchyPointNode<ExpressionNode>) {
        return d.children ? "end" : "start";
      })
      .text(function (d: HierarchyPointNode<ExpressionNode>) {
        return d.data.label;
      });

    // UPDATE
    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d:HierarchyPointNode<ExpressionNode>) {
        return "translate(" + source.y + "," + source.x + ")";
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
    let link = this.g.selectAll('path.link')
      .data(links, function (d: HierarchyPointNode<ExpressionNode>) {
        return d.data.id;
      });

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function (d) {
        let o = {x: source.x0, y: source.y0};
        return diagonal(o, o)
      });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', function (d) {
        return diagonal(d, d.parent)
      });

    // Remove any exiting links
    let linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', function (d) {
        let o = {x: source.x, y: source.y};
        return diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d: HierarchyPointNode<ExpressionNode>) {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

      let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

      return path
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
      this.update(d);
    }
  }
  removeNode() {

    if (!this.activeNode)return;
    if (!this.activeNode == this.root) return;


    if (this.activeNode.parent) {
      let parent: ExpressionNode = this.activeNode.parent;

      let index = this.activeNode.parent.children.indexOf(this.activeNode);
      if (index > -1) {
        this.activeNode.parent.children.splice(index, 1);
      }

      parent.executed = false;


      this.activeNode = parent;
    }

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));

  }


  newCustomValue: any;

  addValueChild() {
    if (!this.activeNode)return;

    let valueNode = new ValueNode;
    let val = new Value();
    val.cells = [{value: this.newCustomValue}];

    valueNode.element = val;


    if (this.activeNode instanceof FuncNode) {
      this.activeNode.children.push(valueNode);

    }
    else {
      this.activeNode.parent.children.push(valueNode);
    }

    this.activeNode.executed = false;

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));


  }

  execute() {


    this.treeExecution.execute(this.expressionTreeInstance, this.activeNode).subscribe(() => {
      this.ref.markForCheck();

    });


  }


  public funcType = FuncType;

  addFuncChild(funcType: FuncType) {
    if (!this.activeNode)return;
    let funcNode = new FuncNode(funcType);

    if (this.activeNode instanceof FuncNode) {
      this.activeNode.children.push(funcNode);

    }
    else {
      this.activeNode.parent.children.push(funcNode);
    }

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));


  }

  clearAll() {
    this.root.children = [];
    this.update(this.root);
    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));

  }

  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.editableExpressionTreeInstance = JSON.stringify(this.expressionTreeInstance);
    this.childModal.show();
  }


  public showSerializationModal(): void {
    this.editableExpressionTreeInstance = JSON.stringify(this.expressionTreeInstance);
    this.jsonModal.show();
  }


  public saveSerializationModal(): void {

    this.jsonModal.hide();
    let tree = new ExpressionTree().deserialize(JSON.parse(this.editableExpressionTreeInstance));

    this.store.dispatch(new ReplaceAction(tree));

  }


  public buildAggregateRequestNode(): void {

    if (!this.activeNode)return;
    this.newAggregateRequest.cube = this.cube;
    let aggregateNode = new AggregateNode();
    aggregateNode.element = this.newAggregateRequest;

    if (this.activeNode.data instanceof FuncNode) {
      this.activeNode.data.children.push(aggregateNode);

    }
    else {
      this.activeNode.data.parent.children.push(aggregateNode);
    }

    this.activeNode.data.executed = false;

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));

    this.newAggregateRequest = new AggregateRequest;
  }

  editableExpressionTreeInstance: string;


  newAggregateRequest = new AggregateRequest;

}
