const cp = require('child_process');
 
async function spawn_app() {
  
  const testAppPath = "start \"\"  \"spawned_app\\updater.exe\" && echo update_started_fine_app_can_be_closed"  
  const updaterDir = __dirname;

  const updaterArgs = [
    '--base-url', `"c:\\work\\"`,
    '--version', `"123"`,
    '--exec', `"calc"`,
    '--cwd', `"cal"`,
    '--app-dir', `"calc"`,
    '--force-temp'
  ];

  const app_spawned = cp.spawn(`${testAppPath}`, updaterArgs, {
    cwd: updaterDir,
    detached: false,  //we have to be attached to launched process at least until we decide that it to do next 
    //detached: true, 
    //stdio: 'ignore',
    //stdio: 'inherit',  //looks like I get data from stdio only when it is not manualy set
    //stdoi: 'pipe',
    shell: true
  });

  //print pid and catch data from stdio
  console.log('SPAWN: child process ' + `pid ${app_spawned.pid}`);  
  app_spawned.stdout.on('data', (data) => {
    console.log(`SPAWN: child stdout:\n${data}`);
  });


  //make promises for app exit , error , data and some timeout
  const primiseExit = new Promise(resolve => {
    app_spawned.on('exit', resolve);
  });

  const primiseError = new Promise(resolve => {
    app_spawned.on('error', resolve);
  });
  
  const primiseDataError = new Promise(resolve => {
    app_spawned.stderr.on('data', resolve);
  });

  const primiseDataOut = new Promise(resolve => {
    app_spawned.stdout.on('data', resolve);
  });

  // const primiseTimeout = new Promise(resolve => {
  //   setTimeout(() => resolve("timer on timeout"), 15000);  //5 seconds maybe to much its just for test 
  // });
  
  //wait for something to happen
  var promise = await Promise.race([primiseError, primiseExit, primiseDataOut, primiseDataError]);  //primiseTimeout
  //print what happen
  console.log('SPAWN: promise ' + `result \"${promise}\"`);
  
  app_spawned.unref();

  if(`${promise}`.startsWith("timer") || `${promise}`.startsWith("update_started_fine_app_can_be_closed") )  //hardcoded string "tests" . app have to send it console at start to indicate that it successfuly launched
  {
    return true;  //we get output from app or timeout. so there is at least was no fail to start app 
  } else {
    return false;  //we failed to start app 
  }
}

module.exports = async (test_text) => {
    return spawn_app(test_text).then(status => {
        return Promise.resolve(status);
    }).catch((error) => {
        //catch exception what was not catched by promises 
        console.log('SPAWN: error spawning catch. Error : ' + error);

        return Promise.resolve(false);
    });
};