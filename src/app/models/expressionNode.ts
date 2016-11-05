import {Inject} from "@angular/core";
import {Observer} from "rxjs/Rx";
import * as _ from 'lodash';
import {AggregateNode} from "./aggregate/aggregateNode";
import {Component, forwardRef} from '@angular/core';
import {FuncNode} from "./func/funcNode";
import {Serializable} from "./iserializeable";
import {UUID} from "angular2-uuid";

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionNode   implements Serializable<ExpressionNode>,Node{
  attributes: NamedNodeMap;
  baseURI: string|any;
  childNodes: NodeList;
  firstChild: Node;
  lastChild: Node;
  localName: string|any;
  namespaceURI: string|any;
  nextSibling: Node;
  nodeName: string;
  nodeType: number;
  nodeValue: string|any;
  ownerDocument: Document;
  parentElement: HTMLElement;
  parentNode: Node;
  previousSibling: Node;
  textContent: string|any;
  ATTRIBUTE_NODE: number;
  CDATA_SECTION_NODE: number;
  COMMENT_NODE: number;
  DOCUMENT_FRAGMENT_NODE: number;
  DOCUMENT_NODE: number;
  DOCUMENT_POSITION_CONTAINED_BY: number;
  DOCUMENT_POSITION_CONTAINS: number;
  DOCUMENT_POSITION_DISCONNECTED: number;
  DOCUMENT_POSITION_FOLLOWING: number;
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
  DOCUMENT_POSITION_PRECEDING: number;
  DOCUMENT_TYPE_NODE: number;
  ELEMENT_NODE: number;
  ENTITY_NODE: number;
  ENTITY_REFERENCE_NODE: number;
  NOTATION_NODE: number;
  PROCESSING_INSTRUCTION_NODE: number;
  TEXT_NODE: number;

  appendChild(newChild: Node): Node {
    return undefined;
  }

  cloneNode(deep?: boolean): Node {
    return undefined;
  }

  compareDocumentPosition(other: Node): number {
    return undefined;
  }

  contains(child: Node): boolean {
    return undefined;
  }

  hasAttributes(): boolean {
    return undefined;
  }

  hasChildNodes(): boolean {
    return undefined;
  }

  insertBefore(newChild: Node, refChild: Node|any): Node {
    return undefined;
  }

  isDefaultNamespace(namespaceURI: string|any): boolean {
    return undefined;
  }

  isEqualNode(arg: Node): boolean {
    return undefined;
  }

  isSameNode(other: Node): boolean {
    return undefined;
  }

  lookupNamespaceURI(prefix: string|any): string|any {
    return undefined;
  }

  lookupPrefix(namespaceURI: string|any): string|any {
    return undefined;
  }

  normalize(): void {
  }

  removeChild(oldChild: Node): Node {
    return undefined;
  }

  replaceChild(newChild: Node, oldChild: Node): Node {
    return undefined;
  }

  addEventListener(type: string, listener?: EventListenerOrEventListenerObject, useCapture?: boolean): void {
  }

  dispatchEvent(evt: Event): boolean {
    return undefined;
  }

  removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, useCapture?: boolean): void {
  }
  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  deserialize(input:any):ExpressionNode {


    return input;

  }

  serialize(input: ExpressionNode): Object {
    return this;
  }

  public constructor(name:string){
    this._label = name;

  }


  public id = UUID.UUID();

  private _element:any;

  public _value:any;

  public parent:ExpressionNode;

  public _children: ExpressionNode[] = [];

  private _label;

  public get element (){
    return this._element;
  }

  public get label(){
    return this._label;
  }

  public get value(){
    return this._label;
  }

  private _symbol:string;

  public executed: boolean = false;

  public toJSON = function () {

    return _.extend({__type:this.constructor.name, element:this.element, symbol:this.symbol},_.omit(this, [ "parent", "toJSON" ]));
  };

  get children(): any {
    return this._children;
  }

  set children(value: any) {
    this._children = value;
  }
  get y0(): number {
    return this._y0;
  }

  set y0(value: number) {
    this._y0 = value;
  }
  get x0(): number {
    return this._x0;
  }

  set x0(value: number) {
    this._x0 = value;
  }

  private _x0:number;
  private _y0:number;


  public x:number;
  public y:number;

}
