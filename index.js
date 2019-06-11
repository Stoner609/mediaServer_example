const HLSServer = require('hls-server')
const http = require('http')
const express = require('express');
var fs = require('fs')

var app = express();
app.use(express.static('public'));

const server = http.createServer(app)
const hls = new HLSServer(server, {
  path: '/streams',     // Base URI to output HLS streams
  dir: 'source-m3u8',   // Directory that input files are stored
  provider: {
    exists: function (req, callback) { // check if a file exists (always called before the below methods)
      callback(null, true)                 // File exists and is ready to start streaming
      // callback(new Error("Server Error!")) // 500 error
      // callback(null, false)                // 404 error
    },
    getManifestStream: function (req, callback) { // return the correct .m3u8 file
      // "req" is the http request
      // "callback" must be called with error-first arguments
      callback(null, fs.createReadStream(req.filePath))
      // or
      // callback(new Error("Server error!"), null)
    },
    getSegmentStream: function (req, callback) { // return the correct .ts file
      console.log('--------------------')
      console.log(req.headers);
      callback(null, fs.createReadStream(req.filePath, { bufferSize: 64 * 1024 }))
    }
  }
});

server.listen(8000, () => {
  console.log('success');
});
