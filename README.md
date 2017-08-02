#Indigo: the Analysis and Data Mining frontend for OpenBudgets.eu

Indigo is a browser application written in TypeScript and based on Angular. With Indigo, users will be able to:
1. Leverage the data mining and analysis features developed for the OpenBudgets.eu project
2. Build expression-based fiscal indicators with aggregate requests as building blocks

Indigo was build to work with OpenSpending out of the box, at least for analysis processes that require just an aggregation request.
### Quick start

```bash
# clone the repo
git clone https://github.com/okgreece/indigo


# change directory to repo
cd indigo

# Use npm or yarn to install the dependencies:
npm install

# OR
yarn

# start the server
ng serve
```

Navigate to [http://localhost:4200/indigo](http://localhost:4200/indigo) in your browser

_NOTE:_ The above setup instructions assume you have added local npm bin folders to your path. 
If this is not the case you will need to install the angular-cli globally.

### Configuration
Indigo lets you set the following configuration options, by editing the `src/environments/environment.ts` file:

  1. `production`: Keep this value false, otherwise the environment.prod will be used instead,
  2. `apiUrl`: This is the cubes endpoint URL. For example, `http://yourserver/rudolf/public` or `http://next.openspending.org`,
  
  3. `DAMUrl`: The backend's URL. For the demo this is an OpenCPU instance at `http://okfnrg.math.auth.gr/ocpu/`,
  4. `versionSuffix`: Legacy support for rudolf that had "v3" instead of plain "3" in its API URL. For OpenSpending, use "3". This will be depreciated in next versions, as rudolf is also going to follow the same numbering scheme,
  5. `baseHref`: The path of the application. Defaults to "indigo/"
  
### Usage
Currently, Indigo offers two analysis functions: descriptive statistics and time series analysis. You can start [here](USERGUIDE.md) .  


### Attribution
Budget Planning by Creative Stall from the Noun Project

rubiks cube by Rflor from the Noun Project

rubiks cube by Rflor from the Noun Project

filter by alrigel from the Noun Project

jack hammer by mungang kim from the Noun Project

update order by Jenie Tomboc from the Noun Project

Aggregator by Stuart McMorris from the Noun Project

Settings by Pablo Rozenberg from the Noun Project

select coins by anbileru adaleru from the Noun Project

flow diagram by Creative Stall from the Noun Project

infographic by Rob Gill from the Noun Project

Repeat by Mood Design Studio from the Noun Project

Data Analysis by Becris from the Noun Project

table data by Trevor Dsouza from the Noun Project

column middle by amy morgan from the Noun Project

