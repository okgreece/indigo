# Indigo User Guide
Indigo is the analysis and data mining frontend created for the OpenBudgets.eu research programme. If you have correctly installed and configured Indigo, you can use it to build analysis tasks and view or share visualizations of your budget and spending data.
## Datasets, algorithms, analysis tasks and executions
The essential component to analyze data, is your fiscal dataset. We assume that you have made your data available before you start analyzing it with Indigo. You don't have to upload or manipulate any dataset within Indigo. It can access your budget and spending data through an OpenSpending (OS) compatible data API. This means you can use Indigo with OpenSpending.org, your own instance of OpenSpending or your own instance of the OS-compatible Rudolf API. 

To analyze your data you should feed them into a data mining or analysis algorithm. Generally speaking, these algorithms try to provide you with more insight of your data, by combining and comparing them in a sophisticated manner and then visually presenting the results. You might find it useful to feed the data mining algorithms with a specific subset of a dataset. For that reason, some data mining algorithms support customized facts or aggregate subsets. 

When you define the input data, together with other parameters that an algorithm requires, you are actually building an analysis task. You can then execute this task and see the visualizations - this is an execution. An analysis task can also be shared with others, by copying the URL of the currently displayed task.

In the near future, Indigo is going to be backed by DAM, a service that can coordinate various data mining algorithms in a way that the end users only see algorithms applicable to their datasets. Currently, Indigo only offers two analysis and data mining algorithms: descriptive statistics and time series analysis. In the following sections you can get an overview of what you can do with Indigo.

## Search for a dataset
When you visit Indigo's home page, you are presented with a search box, where you can type a word that is contained in a dataset's name in order to filter the datasets:
 

<img src="resources/indigo_cube_find.gif" style="max-width: 100%" />
 
If you type nothing in the search box, you get all the datasets in the configured store. If you are using a Rudolf API store, you also get the Global dataset - you will use it in the following sections to build a time series analysis task.

