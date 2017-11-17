/**
 * Created by larjo on 2/12/2016.
 */
import {Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import {
  AcfChartVisualizationRegular,
  AcfChartVisualizationResiduals, PacfChartVisualizationResiduals, PacfChartVisualizationRegular
} from './analysis/visualizations/acfChart';
import {
  LineChartTrends, LineChartRemainders, LineChartFittingResiduals,
  LineChartFittingTimeFitted, LineChartTimeSeriesForecast
} from './analysis/visualizations/lineChart';
import {
  ScatterPlotTimeseriesDecompositionFittedResiduals,
  ScatterPlotTimeseriesFittingFittedResiduals
} from './analysis/visualizations/scatterPlot';
import {FrequencyChartDescriptive} from './analysis/visualizations/frequencyChart';
import {HistogramDescriptive} from './analysis/visualizations/histogram';
import {BoxPlotDescriptive} from './analysis/visualizations/boxPlot';
import {ClusteringMedoidDiagram} from "./analysis/visualizations/medoidDiagram";
// http://blog.mgechev.com/2015/12/30/angular2-router-dynamic-route-config-definition-creation/


export const DynamicComponents = {
  'analytics-acf-chart-timeseries-regular': AcfChartVisualizationRegular,
  'analytics-acf-chart-timeseries-residuals': AcfChartVisualizationResiduals,
  'analytics-pacf-chart-timeseries-regular': PacfChartVisualizationRegular,
  'analytics-pacf-chart-timeseries-residuals': PacfChartVisualizationResiduals,
  'analytics-line-chart-timeseries-trends': LineChartTrends,
  'analytics-line-chart-timeseries-remainders': LineChartRemainders,
  'analytics-scatter-plot-timeseries-decomposition-fitted-residuals': ScatterPlotTimeseriesDecompositionFittedResiduals,
  'analytics-scatter-plot-timeseries-fitting-fitted-residuals': ScatterPlotTimeseriesFittingFittedResiduals,
  'analytics-line-chart-timeseries-fitting-residuals': LineChartFittingResiduals,
  'analytics-line-chart-timeseries-fitting-time-fitted': LineChartFittingTimeFitted,
  'analytics-line-chart-timeseries-forecast': LineChartTimeSeriesForecast,
  'analytics-frequency-chart-descriptive': FrequencyChartDescriptive,
  'analytics-histogram-chart-descriptive': HistogramDescriptive,
  'analytics-box-plot-descriptive': BoxPlotDescriptive,
  'analytics-clustering-medoid-diagram': ClusteringMedoidDiagram

};

@Component({
  selector: 'app-indigo-dynamic-component',
  entryComponents: [AcfChartVisualizationRegular, AcfChartVisualizationResiduals, LineChartTrends,
    LineChartRemainders, ScatterPlotTimeseriesDecompositionFittedResiduals, PacfChartVisualizationResiduals,
    PacfChartVisualizationRegular, ScatterPlotTimeseriesFittingFittedResiduals, LineChartFittingResiduals,
    LineChartFittingTimeFitted, LineChartTimeSeriesForecast, FrequencyChartDescriptive,
    HistogramDescriptive, BoxPlotDescriptive], // Reference to the components must be here in order to dynamically create them
  template: `
    <div #dynamicComponentContainer></div>
  `,
})
export class DynamicComponent {
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() set componentData(data: {component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    const inputProviders = Object.keys(data.inputs).map((inputName) => ({provide: inputName, useValue: data.inputs[inputName]}));
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

    // We create a factory out of the component we want to create
    const factory = this.resolver.resolveComponentFactory(data.component);

    // We create the component using the factory and the injector
    const component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(component.hostView);

    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }

  constructor(private resolver: ComponentFactoryResolver) {

  }
}
