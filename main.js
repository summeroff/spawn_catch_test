const {app, BrowserWindow} = require('electron')
const bootstrap = require('./spawn_app.js');

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  
  //
  bootstrap("test_text_str").then((updating) => {
    if (updating) {
      console.log('MAIN: App started  ');
      mainWindow.loadFile('index.html')
      //app.exit();
    } else {
      console.log('MAIN: App failed to started  ');
      mainWindow.loadFile('index_error.html')
    }
  });
 
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
 