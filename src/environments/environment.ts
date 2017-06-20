// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  searchSize: 50,
  apiUrl: 'http://localhost/rudolf/public',
  openCpuEndpoint: 'http://okfnrg.math.auth.gr/ocpu/',
  versionSuffix: '3',
  baseHref: 'indigo/',
  DAMUrl: 'http://dam-obeu.iais.fraunhofer.de',
  DAMretries: 12,
  DAMpollingInitialStep: 1000,
};
