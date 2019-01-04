# spawn_catch_test
Test app to catch failed spawn

## To Use
There is test batch file in `spawned_app` dir. You can put some app in it and change `updaterPath` in `spawn_app.js`

```
npm install
npm start
```

`main.js` will try to call an sync function which try to spawn test app in function `spawn_app`. After spawn it will load `index.html` or `index_error.html`. 

 `spawn_app` function creates promises for spawn error, spawn exit, stdio data from app and for timeout. And wait for any promise to happen. If it data or timeout it returns true to `main.js` and false otherwise. Also any exception will return false. 

Ways to test spawn fail:
* change app name in var `updaterPath` to some wrong name
* change app name in var `updaterPath` to some file name that is not executable
* change permission on app to restrict its execution

