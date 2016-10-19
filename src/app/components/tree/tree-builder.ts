import {Cube} from "../../models/cube";
import {Observable} from "rxjs/Rx";
import {ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import Timer = NodeJS.Timer;
import {ExpressionTree} from "../../models/expressionTree";
import {State,  getSelectedCube, getTree} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../models/expressionNode";
import {AggregateNode} from "../../models/aggregate/aggregateNode";
import {RudolfCubesService} from "../../services/rudolf-cubes";
import {TreeExecution} from "../../services/tree-execution";
import {FuncNode, FuncType} from '../../models/func/funcNode'
import * as _ from 'lodash';

import {ValueNode} from "../../models/value/valueNode";
import {Value} from "../../models/value/val";
import * as $ from 'jquery'
import {ReplaceAction} from "../../actions/tree";
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
  //template: `<div></div>`,
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
      stroke-width: 1.5px;
    }

    .node text {
      font-size:10px;
      font-family:sans-serif;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 1.5px;
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
      min-width:auto!important;
    
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

  @Input() expressionTree:Observable<ExpressionTree>;
  expressionTreeInstance:ExpressionTree;
  length:number;
  @ViewChild('drawingCanvas') drawingCanvas;
  @ViewChild('jsonModal') jsonModal : ModalDirective;

  constructor(@Inject(ElementRef) elementRef:ElementRef,
              @MetadataAttribute('width') width:number,
              @MetadataAttribute('height') height:number,
              private store:Store<State>,
              private rudolfCubesService:RudolfCubesService,
              private treeExecution:TreeExecution, private zone: NgZone, private ref: ChangeDetectorRef) {

    this.width = width;
    this.height = height;
    this.expressionTree =    store.let(getTree);

    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


  _cube:Cube;

  public get cube(){
    return this._cube;
  }

  @Input()

  public set cube(value:Cube){
    let that = this;
    that._cube = value;
  }

  width:number;
  height:number;


  aggregates = [];


  ngAfterViewInit() {

    window.setTimeout(() =>{
      this.baseSvg = d3.select(this.drawingCanvas.nativeElement).append("svg").attr("width", this.viewerWidth)
        .attr("height", this.viewerHeight)
        .call(this.zoomListener);
      let that = this;
      this.expressionTree.subscribe(function (expressionTree_) {
        let expressionTree = new ExpressionTree().deserialize(JSON.parse(JSON.stringify(expressionTree_)));

        if (that.tree && that.expressionTreeInstance.root == expressionTree.root) {
          that.expressionTreeInstance = expressionTree;
          that.update(expressionTree.root);
        }
        else {
          that.expressionTreeInstance = expressionTree;

          that.baseSvg.html("");

          that.init();

        }


      });
    });



  }



  init() {

    this.viewerWidth = $(this.drawingCanvas.nativeElement).width();
    this.viewerHeight = $(this.drawingCanvas.nativeElement).height();


    let treeData = this.expressionTreeInstance.root;


    // Call visit function to establish maxLabelLength
    let that = this;
    this.tree = d3.layout.tree()
      .size([this.viewerHeight, this.viewerWidth]);

    this.visit(treeData,
      function (d:ExpressionNode) {
        that.totalNodes++;
        that.maxLabelLength = Math.max(d.label.length, that.maxLabelLength);
      },
      function (d:ExpressionNode) {
        return d.children && d.children.length > 0 ? d.children : null;
      }
    );

    // Sort the tree initially incase the JSON isn't in a sorted order.
    this.sortTree();
    // Append a group which holds all nodes and which the zoom Listener can act upon.
    this.svgGroup = this.baseSvg.append("g");
    // Define the root
    this.root = treeData;
    this.root.x0 = this.viewerHeight / 2;
    this.root.y0 = 0;


    this.dragListener = d3.behavior.drag()
      .on("dragstart", function (d: ExpressionNode) {
        if (d == that.root) {
          return;
        }
        that.dragStarted = true;
        that.nodes = that.tree.nodes(d);
        d3.event.sourceEvent.stopPropagation();
        // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
      })
      .on("drag", function (d: ExpressionNode) {
        if (d == that.root) {
          return;
        }
        if (that.dragStarted) {
          let domNode = this;
          that.initiateDrag(d, domNode);
        }

        // get coords of mouseEvent relative to svg container to allow for panning
        if (typeof($) == 'undefined')return;
        let relCoords = d3.mouse($('svg').get(0));
        if (relCoords[0] < this.panBoundary) {
          that.panTimer = true;
          that.pan(this, 'left');
        } else if (relCoords[0] > ($('svg').width() - that.panBoundary)) {

          that.panTimer = true;
          that.pan(this, 'right');
        } else if (relCoords[1] < that.panBoundary) {
          that.panTimer = true;
          that.pan(this, 'up');
        } else if (relCoords[1] > ($('svg').height() - that.panBoundary)) {
          that.panTimer = true;
          that.pan(this, 'down');
        } else {
          try {
            clearTimeout(that.panTimer);
          } catch (e) {

          }
        }

        d.x0 += d3.event.dy;
        d.y0 += d3.event.dx;
        let node = d3.select(this);
        node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
        that.updateTempConnector();
      }).on("dragend", function (d) {
        if (d == that.root) {
          return;
        }
        that.domNode = this;
        if (that.selectedNode) {
          // now remove the element from the parent, and insert it into the new elements children
          let index = that.draggingNode.parent.children.indexOf(that.draggingNode);
          if (index > -1) {
            that.draggingNode.parent.children.splice(index, 1);
          }
          if (typeof that.selectedNode.children !== 'undefined') {
            that.selectedNode.children.push(that.draggingNode);

          } else {
            that.selectedNode.children = [];
            that.selectedNode.children.push(that.draggingNode);
          }
          // Make sure that the node being added to is expanded so user can see added node is correctly moved
          //that.expand(that.selectedNode);
          that.sortTree();
          that.endDrag();
        } else {
          that.endDrag();
        }
      });

    // Layout the tree initially and center on the root node.
    this.activeNode = this.root;

    this.update(this.root);
    this.centerNode(this.root);

  }
  centerActiveNode(){
    this.centerNode(this.activeNode);
    d3.behavior.zoom().scale(1);

  }

  //Following code to be uncommented when we are trying to observe changes. Then we might not render onint.
  /*ngDoCheck()
   {
   // alert("check called");

   if(this.length!=this.bardata.length)
   {this.length= this.bardata.length;
   this.render(this.bardata);
   }
   }
   ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {

   for (let propName in changes) {
   let prop = changes[propName];
   let cur  = JSON.stringify(prop.currentValue);
   let prev = JSON.stringify(prop.previousValue);
   //  alert(prev+","+cur);
   let num :Array<number>= prop.currentValue;
   this.render(num);

   }}*/

  tree:any;
  svgGroup:any;

  // Calculate total nodes, max label length
  totalNodes:number = 0;
  maxLabelLength:number = 0;
  // variables for drag/drop
  selectedNode:any = null;
  draggingNode:any = null;
  // panning variables
  panSpeed:number = 200;
  panBoundary:number = 15; // Within 20px from edges will pan when dragging.
  // Misc. variables
  i:number = 0;
  duration:number = 750;
  root:any;

  // size of the diagram
  @Input()
  viewerWidth:number;// $(document).width();
  @Input()

  viewerHeight:number;// $(document).height();


  // define a d3 diagonal projection for use by the node paths later on.
  diagonal = d3.svg.diagonal()
    .projection(function (d) {
      return [d.y, d.x];
    });

  // A recursive helper function for performing some setup by walking through all nodes

  panTimer:any;

  visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    let children = childrenFn(parent);
    if (children) {
      let count = children.length;
      for (let i = 0; i < count; i++) {
        this.visit(children[i], visitFn, childrenFn);
      }
    }
  }


  // sort the tree according to the node names

  sortTree() {
    this.tree.sort(function (a, b) {
      return a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1;
    });
  }


  // TODO: Pan function, can be better implemented.

  pan(domNode, direction) {
    let speed = this.panSpeed;
    if (this.panTimer) {
      clearTimeout(this.panTimer);
      let translateCoords = d3.transform(this.svgGroup.attr("transform"));
      let translateX = 0;
      let translateY = 0;
      if (direction == 'left' || direction == 'right') {
        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == 'up' || direction == 'down') {
        translateX = translateCoords.translate[0];
        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
      }
      let scaleX = translateCoords.scale[0];
      let scaleY = translateCoords.scale[1];
      let scale = this.zoomListener.scale();
      this.svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
      d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
      let that = this;
      this.zoomListener.scale(this.zoomListener.scale());
      this.zoomListener.translate([translateX, translateY]);
      this.panTimer = setTimeout(function () {
        that.pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  zoom() {
    this.svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }


  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", ()=> this.zoom());

  initiateDrag(d, domNode) {
    this.draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(domNode).attr('class', 'node activeDrag');
    let that = this;
    this.svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
      if (a.id != that.draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (this.nodes.length > 1) {
      // remove link paths
      let links = this.tree.links(this.nodes);
      let nodePaths = this.svgGroup.selectAll("path.link")
        .data(links, function (d) {
          return d.target.id;
        }).remove();
      // remove child nodes
      let nodesExit = this.svgGroup.selectAll("g.node")
        .data(this.nodes, function (d) {
          return d.id;
        }).filter(function (d, i) {
          return d.id != that.draggingNode.id;

        }).remove();
    }

    // remove parent link
    let parentLink = this.tree.links(this.tree.nodes(this.draggingNode.parent));
    this.svgGroup.selectAll('path.link').filter(function (d, i) {
      if (d.target.id == that.draggingNode.id) {
        return true;
      }
      return false;
    }).remove();

    this.dragStarted = null;
  }

  dragStarted:boolean;
  domNode:Node;
  // define the baseSvg, attaching a class for styling and the zoomListener
  baseSvg:any;

  nodes:any[];
  // Define the drag listeners for drag/drop behaviour of nodes.
  dragListener:any;

  endDrag() {
    this.selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    d3.select(this.domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(this.domNode).select('.ghostCircle').attr('pointer-events', '');
    this.updateTempConnector();
    if (this.draggingNode !== null) {
      this.update(this.root);
      this.centerNode(this.draggingNode);
      this.draggingNode = null;
    }
  }

  // Helper functions for collapsing and expanding nodes.

  /*collapse(d) {
   if (d.expanded) {
   if(d.children )
   d.children.forEach(this.collapse);
   d.expanded = false;
   }
   }

   expand(d) {
   if (!d.expanded) {
   if(d.children)
   d.children.forEach(this.expand);
   d.expanded = true;
   }
   }*/

  overCircle(d) {
    if(!(d instanceof AggregateNode)){
      this.selectedNode = d;

    }
    this.updateTempConnector();
  };

  outCircle(d) {
    this.selectedNode = null;
    this.updateTempConnector();
  };

  // Function to update the temporary connector indicating dragging affiliation
  updateTempConnector() {
    let data = [];

    if (this.draggingNode !== null && this.selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: this.selectedNode.y0,
          y: this.selectedNode.x0
        },
        target: {
          x: this.draggingNode.y0,
          y: this.draggingNode.x0
        }
      }];
    }
    let link = this.svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  centerNode(source) {
    let scale = this.zoomListener.scale();
    let x = -source.y0;
    let y = -source.x0;
    x = x * scale + this.viewerWidth / 2;
    y = y * scale + this.viewerHeight / 2;
    d3.select('g').transition()
      .duration(this.duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    this.zoomListener.scale(scale);
    this.zoomListener.translate([x, y]);
  }

  // Toggle children function

  /*
   toggleChildren(d) {
   if (d.expanded) {
   d.expanded = false;
   } else if (!d.expanded) {
   d.expanded = true;
   }
   return d;
   }
   */


  // Toggle children on click.

  private activeNode:ExpressionNode;

  click(d) {
    this.zone.run(()=>{
      this.activeNode = d;
      this.ref.markForCheck();


    });
    this.activeNode = d;

    if (d3.event.defaultPrevented) return; // click suppressed
    //d = this.toggleChildren(d);
    this.update(d);
    this.centerNode(d);

  }

  update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    let levelWidth = [1];
    let childCount = function (level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
          childCount(level + 1, d);
        });
      }
    };

    childCount(0, this.root);
    let newHeight = d3.max(levelWidth) * 35; // 25 pixels per line
    this.tree = this.tree.size([newHeight, this.viewerWidth]);

    // Compute the new tree layout.
    let nodes = this.tree.nodes(this.root).reverse(),
      links = this.tree.links(nodes);
    nodes.forEach(function (node) {
      if (!node.children) node.children = [];
    });
    // Set widths between levels based on maxLabelLength.
    let that = this;
    nodes.forEach(function (d) {
      d.y = (d.depth * (that.maxLabelLength * 10)); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    let node = this.svgGroup.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++that.i);
      });
    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
      .call(this.dragListener)
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', (d)=>this.click(d));

    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function (d) {
        return !d.expanded ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children ? -15 : 15;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d: ExpressionNode) {
        return d.label;
      })
      .style("fill-opacity", 0);




    nodeEnter.append("circle")
      .attr('class', 'zombieCircle')
      .attr("r", 15)
      .style("fill", "green")
      .attr("opacity", function (d: ExpressionNode) {
        return d == that.activeNode ? 0.2 : 0.0;
      });

    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
      .attr('class', 'ghostCircle')
      .attr("r", 15)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "indigo")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", function (node: ExpressionNode) {
        that.overCircle(node);
      })
      .on("mouseout", function (node: ExpressionNode) {
        that.outCircle(node: ExpressionNode);
      });


    nodeEnter.append("text")

      .attr('class', 'nodeSymbol')
      .attr("text-anchor", "middle" )
      .attr("alignment-baseline", "central" )
      .text(function (d: ExpressionNode) {
        return d.symbol;
      })
      .style("fill-opacity", 1);

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function (d: ExpressionNode) {
        return d.children ? -15 : 15;
      })
      .attr("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d: ExpressionNode) {
        return d.label;
      });


    node.select('circle.zombieCircle')
      .attr("opacity", function (d: ExpressionNode) {
        return d == that.activeNode ? 0.2 : 0.0;
      });


    // Change the circle fill depending on whether it has children and is expanded
    node.select("circle.nodeCircle")
      .attr("r", 10)
      .style("fill", function (d: ExpressionNode) {
        return !d.executed ? "lightsteelblue" : "indigo";
      });

    // Transition nodes to their new position.
    let nodeUpdate = node.transition()
      .duration(this.duration)
      .attr("transform", function (d: ExpressionNode) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d: ExpressionNode) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    let link = this.svgGroup.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d: ExpressionNode) {
        let o = {
          x: source.x0,
          y: source.y0
        };
        return that.diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr("d", that.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr("d", function (d: ExpressionNode) {
        let o = {
          x: source.x,
          y: source.y
        };
        return that.diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d: ExpressionNode) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }







  removeNode() {

    if (!this.activeNode)return;
    if(!this.activeNode == this.root) return;


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

  addValueChild(){
    if (!this.activeNode)return;

    let valueNode = new ValueNode();
    let val = new Value();
    val.cells = [{value:this.newCustomValue}];

    valueNode.element = val;


    if(this.activeNode instanceof FuncNode){
      this.activeNode.children.push(valueNode);

    }
    else{
      this.activeNode.parent.children.push(valueNode);
    }

    this.activeNode.executed = false;

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));


  }
  execute() {


    this.treeExecution.execute(this.expressionTreeInstance, this.activeNode).subscribe(()=>{
      this.ref.markForCheck();

    });


  }





  public funcType = FuncType;

  addFuncChild(funcType: FuncType){
    if (!this.activeNode)return;
    let funcNode = new FuncNode(funcType);

    if(this.activeNode instanceof FuncNode){
      this.activeNode.children.push(funcNode);

    }
    else{
      this.activeNode.parent.children.push(funcNode);
    }

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));


  }

  clearAll(){
    this.root.children = [];
    this.update(this.root);
    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));

  }
  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal():void {
    this.editableExpressionTreeInstance = JSON.stringify(this.expressionTreeInstance);
    this.childModal.show();
  }


  public showSerializationModal():void {
    this.editableExpressionTreeInstance = JSON.stringify(this.expressionTreeInstance);
    this.jsonModal.show();
  }


  public saveSerializationModal():void {

    this.jsonModal.hide();
    let tree = new ExpressionTree().deserialize(JSON.parse(this.editableExpressionTreeInstance));

    this.store.dispatch(new ReplaceAction(tree));

  }


  public onRequestBuilt($request):void{
    if (!this.activeNode)return;

    let aggregateNode = new AggregateNode();
    aggregateNode.element = $request;

    if(this.activeNode instanceof FuncNode){
      this.activeNode.children.push(aggregateNode);

    }
    else{
      this.activeNode.parent.children.push(aggregateNode);
    }

    this.activeNode.executed = false;

    this.store.dispatch(new ReplaceAction(this.expressionTreeInstance));


  }

  editableExpressionTreeInstance: string;

}
