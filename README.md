# Weather App

This app was originally built using callbacks and jQuery with JSONP requests for a project from [FreeCodeCamp.com](http://freecodecamp.com)

I expanded the scope of the project so that I could build it using more advanced ES6 async techniques. It now uses a secure node.js proxy server for requesting data from the darksky and google APIs which then is forwarded as JSON to the client browser. All async function are handled using manual ES6 promises to demonstrate promise functionality.

I tried to minimize the usage of libraries (most notable lack of a promise library) so that I could get my hands dirty and learn about the nit and grit of ES6 async. This would have been much easier as a single node app but I wanted to have asynchronous code running server and client-side to demonstrate the interaction between the two event loops.

## Callback Version
### Techniques
1. HTML
2. Vanilla CSS
3. jQuery with JSONP (for requesting from secure resources)

## Promises Version
### Client Script
1. HTML
2. Vue.js
3. Sass
4. Native ES6 Promises (XMLHttpRequest)

### Proxy Server
1. Node.js
2. Native ES6 Promises