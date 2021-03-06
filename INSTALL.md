# BACKEND

```sh
cd backend
rm models modules tools node_modules
```

+ open scripts/install.sh
+ set properly the cf_folder variable
+
```sh
./scripts/install.sh
```

# FRONTEND
```sh
cd frontend/app/js
rm knalledge interaction
```

## Sasha (sasha)

```sh
ln -s $cf_folder/frontend/app/js/interaction interaction
ln -s $cf_folder/frontend/app/js/knalledge knalledge
```

## Sasa (mprinc)

```sh
ln -s $cf_folder/frontend/app/js/interaction interaction
ln -s $cf_folder/frontend/app/js/knalledge knalledge
```

## Sinisha

```sh
ln -s $cf_folder/frontend/app/js/interaction interaction
ln -s $cf_folder/frontend/app/js/knalledge knalledge
```

## Server

```sh
cd /var/www/headsware/earthcube/src
cd frontend/app/js
rm knalledge interaction
ln -s $cf_folder/frontend/dist/dev/js/knalledge knalledge
ln -s $cf_folder/frontend/dist/dev/js/interaction interaction
```

# COMPONENTS

```sh
cd frontend/app/components
rm rima notify topiChat collaboPlugins login utils knalledgeMap topPanel request suggestion ontov
```

```sh

frontend/scripts/install.sh
 ```

## Server

```sh
rm knalledgeMap rima notify topiChat collaboPlugins login

ln -s $cf_folder/frontend/dist/dev/components/knalledgeMap knalledgeMap
ln -s $cf_folder/frontend/dist/dev/components/rima rima
ln -s $cf_folder/frontend/dist/dev/components/notify notify
ln -s $cf_folder/frontend/dist/dev/components/topiChat topiChat
ln -s $cf_folder/frontend/dist/dev/components/collaboPlugins collaboPlugins
ln -s $cf_folder/frontend/dist/dev/components/login login
ln -s $cf_folder/frontend/dist/dev/components/utils utils

cd backend/tools
node createDemoData.js ../../frontend/app/data/sample-small.json
node tools/createDemoData.js ../frontend/app/data/sample-small.json
```

# Problems

## Symbolic links and gulp copying assets

Gulp doesn't follow symlinks and folders, and it crashes with an ambigous error: ""

[The solution](http://stackoverflow.com/questions/28079374/gulp-giving-error-on-symlinks-in-gulp-src) is to use [vinyl-fs](https://www.npmjs.com/package/vinyl-fs).

## Temp:

```sh
# http://stackoverflow.com/questions/12699781/how-can-i-pass-multiple-source-files-to-the-typescript-compiler
cd frontend
tsc @tsc_compile.txt
```

# Installing new machine

## general

+ get backup of working machine
+ git clone ...
+ copy/overwrite folders/files
    + frontend
        + bower_components/
        + node_modules/
        + tools/manual_typings/
        + typings/
        + typings.json
    + backend
        + just symbolic linking
+ now you can do symbolic linking

## backend

```sh
cp -r $cf_folder/backend/config .
cp $cf_folder/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
cp $cf_folder/backend/package.json package.json
```

## Proxy forwarding

Add the `http://earthcube-api.headsware.com/` subdomain in the proxy script:

```sh
joe /var/www/web_fork/index.js
```

```js
case 'earthcube-api.headsware.com':
    proxy.web(req, res, { target: 'http://localhost:8042' });
    break;
```

restart:

```sh
start/status/stop knalledge-fork
```
