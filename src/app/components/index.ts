import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BookAuthorsComponent } from './book-authors';
import { BookDetailComponent } from './book-detail';
import { BookPreviewComponent } from './book-preview';
import { BookPreviewListComponent } from './book-preview-list';
import { BookSearchComponent } from './book-search';
import { LayoutComponent } from './layout';
import { NavItemComponent } from './nav-item';
import { SidenavComponent } from './sidenav';
import { ToolbarComponent } from './toolbar';

import { PipesModule } from '../pipes';
import {CubeDetailComponent} from "./cube/cube-detail";
import {CubePreviewComponent} from "./cube/cube-preview";
import {CubePreviewListComponent} from "./cube/cube-preview-list";
import {CubeSearchComponent} from "./cube/cube-search";
import {TreeBuilder} from "./tree/tree-builder";
import {BarChartVisualization} from "./tree/visualizations/barchart";
import {AggregateRequestBuilder} from "./request/aggregate-request-builder";
import {JsonTreeComponent} from "../lib/json-tree/json-tree";
import {ModalModule} from "ng2-bootstrap";
import {JsonNodeComponent} from "../lib/json-tree/json-node";
import {CubeAnalyticsDetailComponent} from "./cube/analytics/cube-analytics-detail";
import {LineChartVisualization} from "./analysis/visualizations/lineChart";
import {TimeSeriesOutputComponent} from "./analysis/timeseries/timeseries";
import {AcfChartVisualization} from "./analysis/visualizations/acfChart";
import { CubeAnalyticsIndexComponent} from "../containers/cube/cube-analytics-index-page";
import {CubeAnalyticsListComponent} from "./cube/analytics/cube-analytics-list";
import {CubeAnalyticsPreviewComponent} from "./cube/analytics/cube-analytics-preview";
import {ScatterPlotVisualization} from "./analysis/visualizations/scatterPlot";
import {DescriptiveStatisticsOutputComponent} from "./analysis/descriptive/descriptive";
import {FactRequestBuilder} from "./request/fact-request-builder";
import {FrequencyVisualization} from "./analysis/visualizations/frequencyChart";
import {BoxPlotVisualization} from "./analysis/visualizations/boxPlot";
import {HistogramVisualization} from "./analysis/visualizations/histogram";


export const COMPONENTS = [
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
  CubeDetailComponent,
  CubePreviewComponent,
  CubePreviewListComponent,
  CubeSearchComponent,
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
  TreeBuilder,
  HistogramVisualization,
  BarChartVisualization,
  AggregateRequestBuilder,
  FactRequestBuilder,
  JsonTreeComponent,
  CubeAnalyticsDetailComponent,
  CubeAnalyticsIndexComponent,
  FrequencyVisualization,
  BoxPlotVisualization,
  LineChartVisualization,
  ScatterPlotVisualization,
  JsonNodeComponent,
  TimeSeriesOutputComponent,
  DescriptiveStatisticsOutputComponent,
  AcfChartVisualization,
  CubePreviewListComponent,
  CubePreviewComponent,
  CubeAnalyticsListComponent,
  CubeAnalyticsPreviewComponent
];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    PipesModule,
    FormsModule,
    ModalModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ComponentsModule { }
