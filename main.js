const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
var os = require('os');
var ifaces = os.networkInterfaces();




function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'electron/index.html'),
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

//This is the event handeler for when the electron render 
//process asks for the paswords to display
electron.ipcMain.on('passwords', (event,arg) => {
  console.log(arg);
  db.user.findAll().then((users) => {
    var responseJSON = users.map((user) => {
        const name = user.name;

        if (user.name === 'admin') {
          return {
            admin: user.password
          }
        } else if (user.name === 'teacher') {
          return {
            teacher: user.password
          }
        } else{
          return {}
        }
      });

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          //console.log(ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          if (ifname == 'en0') {
            responseJSON.push({'en0': iface.address});
          }
        }
        ++alias;
      });
    });

    event.sender.send('passwords', responseJSON);
  });
});

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

// get information from html forms
localApp.use(bodyParser.json());
localApp.use(bodyParser.urlencoded({ extended: true })); 


localApp.use(morgan('tiny')); //prints useful info the terminal
router(localApp,db);

localApp.get('*', (req, res) =>{
  res.sendfile('webroot/index.html');
});


//creates a password
var createPassword = () => {
  const randomstring = Math.random().toString(36).slice(-6);
  console.log('Password created to:' + randomstring);
  return randomstring
}

//checks if there are users, if not, it creates the two main users.
var createUsers = () => {
  //Check users and see if users exists
  db.user.findAndCountAll().then((users) => {
    console.log( users.count);
    if (users.count === 0) {
      db.user.bulkCreate([
      {'name': 'admin', 'role': 'admin', 'password': createPassword() },
      {'name': 'teacher', 'role': 'teacher', 'password': createPassword() } ]).then(() => {
        console.log('Users are created for the first time');
      });
    } else {
      console.log("Starting Application");
    }
  });
}

//starts the main server, and checks the database is set up.
db.connection.sync().then(() => {
  createUsers()
  httpServer.listen(3000, function() {
    console.log('listening on port 3000');
  });
});
