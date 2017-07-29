import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';


import { LayoutComponent } from './layout';
import { NavItemComponent } from './nav-item';
import { SidenavComponent } from './sidenav';
import { ToolbarComponent } from './toolbar';

import { PipesModule } from '../pipes';
import {CubeDetailComponent} from './cube/cube-detail';
import {CubePreviewComponent} from './cube/cube-preview';
import {CubePreviewListComponent} from './cube/cube-preview-list';
import {CubeSearchComponent} from './cube/cube-search';
import {AggregateRequestBuilder} from './request/aggregate-request-builder';

import {
  AggregatePreviewDialogComponent, CubeAnalyticsDetailComponent,
  FactsPreviewDialogComponent
} from './cube/analytics/cube-analytics-detail';
import {
  LineChartVisualization, LineChartTrends, LineChartRemainders,
  LineChartFittingResiduals, LineChartFittingTimeFitted, LineChartTimeSeriesForecast
} from './analysis/visualizations/lineChart';
import {TimeSeriesOutputComponent} from './analysis/timeseries/timeseries';
import {
  AcfChartVisualization, AcfChartVisualizationRegular,
  AcfChartVisualizationResiduals, PacfChartVisualizationRegular, PacfChartVisualizationResiduals
} from './analysis/visualizations/acfChart';
import { CubeAnalyticsIndexComponent} from '../containers/cube/cube-analytics-index-page';
import {CubeAnalyticsListComponent} from './cube/analytics/cube-analytics-list';
import {CubeAnalyticsPreviewComponent} from './cube/analytics/cube-analytics-preview';
import {
  ScatterPlotVisualization, ScatterPlotTimeseriesDecompositionFittedResiduals,
  ScatterPlotTimeseriesFittingFittedResiduals
} from './analysis/visualizations/scatterPlot';
import {DescriptiveStatisticsOutputComponent} from './analysis/descriptive/descriptive';
import {FactRequestBuilder} from './request/fact-request-builder';
import {FrequencyVisualization, FrequencyChartDescriptive} from './analysis/visualizations/frequencyChart';
import {BoxPlotVisualization, BoxPlotDescriptive} from './analysis/visualizations/boxPlot';
import {HistogramVisualization, HistogramDescriptive} from './analysis/visualizations/histogram';
import {DynamicComponent} from './dynamic-component';
import {MasonryModule} from 'angular2-masonry';
import {CubeAnalyticsEmbedComponent} from './cube/analytics/embed/embed';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UserGuidePageComponent} from "./user-guide";
import {MarkdownComponent, MarkdownModule} from "angular2-markdown";
import {OutliersDetectionOutputComponent} from "./analysis/outlier/outlier_detection";
import {
  MdButtonModule, MdCheckboxModule, MdInputModule, MdSidenavModule, MdChipsModule, MdButtonToggleModule,
  MdTooltipModule, MdProgressBarModule, MdCardModule, MaterialModule, MdIconModule, MdDialogModule,
  MdProgressSpinnerModule, MdSelectModule, MdOptionModule, MdAutocompleteModule,
} from '@angular/material';
import {InfiniteScrollerDirective} from "../infinite-scroller.directive";
import {RuleMiningOutputComponent} from "./analysis/rulemining/rulemining";
import {ClusteringOutputComponent} from "./analysis/clustering/clustering";
import {ClusteringTreeDiagram, TreeDiagramVisualization} from "./analysis/visualizations/treeDiagram";
import {OutlierPlotVisualization, OutliersHeatmapDiagram} from "./analysis/visualizations/outlierPlot";
import {UploadPageComponent} from "../containers/cube/upload";
import {LinkedPipesPageComponent} from "../containers/cube/linkedpipes";
import {AnalysisVisualization} from "./analysis/visualization";



export const COMPONENTS = [
  CubeDetailComponent,
  CubePreviewComponent,
  CubePreviewListComponent,
    CubeSearchComponent,
    DynamicComponent,
    LayoutComponent,
    OutlierPlotVisualization,
    NavItemComponent,
    SidenavComponent,
    ToolbarComponent,
    HistogramVisualization,
    AggregateRequestBuilder,
    FactRequestBuilder,
    UserGuidePageComponent,
    UploadPageComponent,
    LinkedPipesPageComponent,
    CubeAnalyticsDetailComponent,
    CubeAnalyticsIndexComponent,
    FrequencyVisualization,
    BoxPlotVisualization,
    LineChartVisualization,
    ScatterPlotVisualization,
    TreeDiagramVisualization,
    TimeSeriesOutputComponent,
    RuleMiningOutputComponent,
    ClusteringOutputComponent,
    DescriptiveStatisticsOutputComponent,
    AcfChartVisualization,
    AcfChartVisualizationRegular,
    AcfChartVisualizationResiduals,
    LineChartTrends,
    LineChartRemainders,
    ScatterPlotTimeseriesDecompositionFittedResiduals,
    ScatterPlotTimeseriesFittingFittedResiduals,
    LineChartFittingResiduals,
    OutliersDetectionOutputComponent,
    LineChartFittingTimeFitted,
    PacfChartVisualizationRegular,
    PacfChartVisualizationResiduals,
    BoxPlotDescriptive,
    CubePreviewListComponent,
    CubePreviewComponent,
    CubeAnalyticsListComponent,
    CubeAnalyticsPreviewComponent,
    CubeAnalyticsEmbedComponent,
    LineChartTimeSeriesForecast,
    FrequencyChartDescriptive,
    HistogramDescriptive,
    InfiniteScrollerDirective,
  AnalysisVisualization,
  ClusteringTreeDiagram,
  OutliersHeatmapDiagram,

];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
    FormsModule,
    MasonryModule,
    FlexLayoutModule,
    MarkdownModule,
    MdProgressBarModule,
    MdInputModule,
    MdSidenavModule,
    MdButtonModule,
    MdChipsModule,
    MdButtonToggleModule,
    MdTooltipModule,
    MdCardModule,
    MdIconModule,
    MdDialogModule,
    MdProgressSpinnerModule,
    MdOptionModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export  class ComponentsModule {

}
