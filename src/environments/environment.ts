// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: "http://127.0.0.1:5001/ok-doutor-agendamentos-dev/southamerica-east1/api/v1",
  baseUrl: "https://southamerica-east1-ok-doutor-agendamentos-dev.cloudfunctions.net/api/v1",
  baseUrlOkDoutor: "https://southamerica-east1-cartao-tudo-ok-dev-7dbbb.cloudfunctions.net/api/v1",
  okDoutorWeb: "cartao-tudo-ok-homol.web.app"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
