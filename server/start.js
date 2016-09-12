/*

 Using http://babeljs.io in case of use of ES6

 Our actual application code begins inside of
 server/main.js, but the process should be started
 from this file in order to enable ES6 translation.

 There is no boilerplate ES6 code in our application
 so if you choose not to use any ES6 features, you can
 start your application from main.js.

*/

require('babel-core/register');
require('./main');