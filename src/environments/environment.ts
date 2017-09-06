// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  apiUrl: 'http://ws307.math.auth.gr/rudolf/public',
  searchSize: 50,
  openCpuEndpoint: 'http://okfnrg.math.auth.gr/ocpu/',
  versionSuffix: '3',
  baseHref: '/',
  DAMUrl: 'https://apps.openbudgets.eu/dam',
  DAMretries: 12,
  DAMpollingInitialStep: 1000,
};
