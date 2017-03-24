const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

//Here is where the main componend of the express back end will start
var express = require("express");
var localApp = express();
var httpServer = require('http').createServer(localApp);
var fs = require("fs");
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var db = require('./src/config/db.js');

localApp.use(express.static(path.join(__dirname, 'webroot')));

var router = require('./src/router/index.js');
// var session = require('express-session');
// var flash = require('connect-flash');

// require('passport');
// require('./config/passport').init(passport);

// localApp.use(cookieParser());
// get information from html forms
localApp.use(bodyParser.json());

// required for passport
// localApp.use(session({ secret: 'asdfhasdlkjfhasdkfhasdlkfhsljh' })); // session secret
// localApp.use(passport.initialize());
// localApp.use(passport.session()); // persistent login sessions
// localApp.use(flash()); // use connect-flash for flash messages stored in session

localApp.use(morgan('tiny')); //prints useful info the terminal
router(localApp,db);



localApp.get('*', (req, res) =>{
  res.sendfile('webroot/index.html');
});

// Catch any routes not already handed with an error message
// localApp.use((request, response) => {
//   var message = 'Error, did not understand path' + request.path;
//   response.status(404).end(message);
// });

db.connection.sync().then(() => {
  httpServer.listen(3000, function() {
    console.log('listening on port 3000');
  });
});
