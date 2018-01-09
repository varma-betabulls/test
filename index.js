// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
//  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  databaseURI: databaseUri || 'mongodb://admin:admin123@ds135747.mlab.com:35747/heroku_5qh6vx0c',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
//  appId: process.env.APP_ID || 'myAppId',
  appId: process.env.APP_ID || 'MLcbPuzJbmv1ZQcMjj9n',
  masterKey: process.env.MASTER_KEY || 'JzFFPgdDeW7lo5x9LXbN', //Add your master key here. Keep it secret!
   fileKey:process.env.FILE_KEY || 'RJDWhqKfMw0waWJji2Fk', 
  serverURL: process.env.SERVER_URL || 'https://egsd-app.herokuapp.com/parse',  // Don't forget to change to https if needed http://localhost:1337/parse
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
var fs = require('fs');
var path = require('path');
var pathSep = require('path').sep;

function FileSystemAdapter(options) {
  options = options || {};
  let filesSubDirectory = options.filesSubDirectory || '';
  this._filesDir = filesSubDirectory;
  this._mkdir(this._getApplicationDir());
  if (!this._applicationDirExist()) {
    throw "Files directory doesn't exist.";
  }
}

FileSystemAdapter.prototype.createFile = function(filename, data) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.writeFile(filepath, data, (err) => {
      if(err !== null) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

FileSystemAdapter.prototype.deleteFile = function(filename) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.readFile( filepath , function (err, data) {
      if(err !== null) {
        return reject(err);
      }
      fs.unlink(filepath, (unlinkErr) => {
      if(err !== null) {
          return reject(unlinkErr);
        }
        resolve(data);
      });
    });

  });
}

FileSystemAdapter.prototype.getFileData = function(filename) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.readFile( filepath , function (err, data) {
      if(err !== null) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

FileSystemAdapter.prototype.getFileLocation = function(config, filename) {
  return config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename);
}

/*
  Helpers
 --------------- */
 FileSystemAdapter.prototype._getApplicationDir = function() {
  if (this._filesDir) {
    return path.join('files', this._filesDir);
  } else {
    return 'files';
  }
 }

FileSystemAdapter.prototype._applicationDirExist = function() {
  return fs.existsSync(this._getApplicationDir());
}

FileSystemAdapter.prototype._getLocalFilePath = function(filename) {
  let applicationDir = this._getApplicationDir();
  if (!fs.existsSync(applicationDir)) {
    this._mkdir(applicationDir);
  }
  return path.join(applicationDir, encodeURIComponent(filename));
}

FileSystemAdapter.prototype._mkdir = function(dirPath) {
  // snippet found on -> https://gist.github.com/danherbert-epam/3960169
  let dirs = dirPath.split(pathSep);
  var root = "";

  while (dirs.length > 0) {
    var dir = dirs.shift();
    if (dir === "") { // If directory starts with a /, the first path will be an empty string.
      root = pathSep;
    }
    if (!fs.existsSync(path.join(root, dir))) {
      try {
        fs.mkdirSync(path.join(root, dir));
      }
      catch (e) {
        if ( e.code == 'EACCES' ) {
          throw new Error("PERMISSION ERROR: In order to use the FileSystemAdapter, write access to the server's file system is required.");
        }
      }
    }
    root = path.join(root, dir, pathSep);
  }
}

module.exports = FileSystemAdapter;
module.exports.default = FileSystemAdapter;
