/*
* Primary root file for the API
*
*/

// dependencies
const http = require('node:http');
const path = require('node:path');
const url = require('node:url');
const StringDecoder = require('node:string_decoder').StringDecoder;
const config = require('./config')
const fs = require('fs');


// instantiating http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// start the server
httpServer.listen(config.httpPort, (err, res) => {
  console.log(`HTTP server listening on port ${config.httpPort} now ...`)
})


//instantiating https server
const options = {
  key: fs.readFileSync('./https/key.pem', 'utf8'),
  cert: fs.readFileSync('./https/cert.pem', 'utf8'),
}

const httpsServer = http.createServer(options, (req, res) => {
  unifiedServer(req, res)
})

// start the server
httpsServer.listen(config.httpsPort, (err, res) => {
  console.log(`HTTPS server listening on port ${config.httpsPort} now ...`)
})


// server for both http and https
const unifiedServer = (req, res) => {
  // get the url
  const reqUrl = url.parse(req.url, true).pathname.replace(/^\/|\$/g, '')
  // get the HTTP method
  const reqMethod = req.method.toUpperCase()
  // get the queryString
  const queryString = url.parse(req.url, true).query
  // get the headers
  const reqHeaders = req.headers;

  // get the payload for Incoming requests
  const decoder = new StringDecoder('utf8');
  let buffer = '';

  req.on('data', (chunks) => {
    buffer += decoder.write(chunks)
  })
 
  req.on('end', () => {
    buffer += decoder.end()

    // choose handler for request, and if not specified fallback to notFound handler
    const chooseHandler = typeof(routers[reqUrl]) !== 'undefined' ? routers[reqUrl] : handlers.notFound;

    // data to be sent
    const dataToSend = {
      method: reqMethod,
      url: reqUrl,
      queryString: queryString,
      payload: buffer
    }

    // send the response
    chooseHandler(dataToSend, (status, pay) => {
      // use the status code from the handler if available, defualt to the specified
      const statusCode = typeof(status) === 'number' ? status : 200;
      // use the payload from the handler if available, defualt to the specified
      const payload = typeof(pay) === 'object' ? pay : {};
      const stringifyPayload = JSON.stringify(payload)

      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Max-Age": 2592000, // 30 days
      };
      
      // send the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode, headers);
      res.end(stringifyPayload);
    })
  })
}


// handlers
const handlers = {}

handlers.ping = (data, callback) => {
  callback(200, data)
},

handlers.notFound = (err, callback) => {
  callback(404, err)
}

// incoming requests routers
const routers = {
  'ping': handlers.ping,
  'connect': handlers.connect
}