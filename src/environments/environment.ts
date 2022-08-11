// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`. isa

export const environment = {
  production: false,
  PRIMAL_CLIENT_ID: "1_578hyffbaggskkgg0cg04g44g4c448gswkw0kk0ow44c000k04",
  PRIMAL_CLIENT_SECRET: "1is4zff5dtk0ks0oco4sw8oggwskg008sooo88cswgg04w480g",
  reportServerURL: "http://localhost:8080/jasperserver",
  serverURL: "http://ec2-13-40-194-58.eu-west-2.compute.amazonaws.com:8000",
  // serverURL: "http://192.168.1.165:8000",
  // serverURL: "http://localhost:8000",
  authURI: "/oauth/v2/token",
  STORAGE_SECRET: "SEC1234567890",
  USER_EMAIL: "postman@primal.com",
  USER_PASSWORD: "postman123",
  defaultAvatar: "/assets/images/avatars/profile.jpg",
  version: "V0.0",
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
// http://192.168.10.100:8000/api/boardingpass?paxId=$P{paxId}&bookingLegId=$P{bookingLegId}
