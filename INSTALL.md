# BACKEND

```sh
cd backend
```

## Sasa (sasha)
```sh
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/models/ models
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/node_modules/ node_modules
# ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
```

## Sasa (mprinc)
```sh
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/models/ models
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/node_modules/ node_modules
```

## Server:
```sh
ln -s /var/www/knalledge/src/backend/models/ models
ln -s /var/www/knalledge/src/backend/modules/ modules
ln -s /var/www/knalledge/src/backend/tools/ tools
ln -s /var/www/knalledge/src/backend/node_modules/ node_modules
# ln -s /var/www/knalledge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
```

## Sinisa:
```sh
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/models/ models
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/ node_modules
# ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
```

# FRONTEND

## Sasha (sasha)

```sh
cd frontend/app/js
rm knalledge interaction
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/js/interaction interaction
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/js/knalledge knalledge
```

#Sasa (mprinc)

```sh
cd frontend/app/js
rm knalledge interaction
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/js/interaction interaction
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/js/knalledge knalledge
```

## Server

```sh
cd /var/www/headsware/earthcube/src
cd frontend/app/js
rm knalledge interaction
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/js/knalledge knalledge
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/js/interaction interaction
```

# COMPONENTS

```sh
cd frontend/app/components
rm collaboPlugins knalledgeMap login notify rima topiChat utils
```

# Sasha (sasha)
```sh
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/rima rima
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/notify notify
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/topiChat topiChat
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/collaboPlugins collaboPlugins
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/login login
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/utils utils

ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/knalledgeMap knalledgeMap
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/topPanel topPanel
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/request request
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/suggestion suggestion
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/app/components/ontov ontov
```

# Sasha (mprinc)

```sh
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/rima rima
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/notify notify
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/topiChat topiChat
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/collaboPlugins collaboPlugins
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/login login
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/utils utils

ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/knalledgeMap knalledgeMap
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/topPanel topPanel
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/request request
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/suggestion suggestion
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/frontend/app/components/ontov ontov
```

# Server

```sh
rm knalledgeMap rima notify topiChat collaboPlugins login

ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/knalledgeMap knalledgeMap
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/rima rima
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/notify notify
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/topiChat topiChat
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/collaboPlugins collaboPlugins
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/login login
ln -s /var/www/headsware/earthcube-test/src/frontend/dist/dev/components/utils utils

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

## backend

```sh
cp -r /Users/sasha/Documents/data/development/KnAllEdge/src/backend/config .
cp /Users/sasha/Documents/data/development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
cp /Users/sasha/Documents/data/development/KnAllEdge/src/backend/package.json package.json
```

## problems

+ get backup of working machine
+ git clone ...
+ copy/overwrite folders/files
    + frontend
        + bower_components
        + node_modules
        + tools/manual_typings
        + typings
        + typings.json
    + backend
        + just symbolic linking
+ now you can do symbolic linking

## Production deployment

There are two groups of actions to be done. First on local machine, then on the server

### Build system on the local machine:

```sh
cdd
cd EarthCube/McMap/src/frontend
npm run build.prod
zip -r -X prod-2016.07.05-1.zip dist/prod
```

#### Upload on the server

Open the folder with zip file at your local machine:

```sh
open .
```
Start a SFTP client and upload the zip file to a production folder on server:  `/var/www/headsware/earthcube-test/src/frontend/prod`

Login to the server and unpack CF system and configure it:

```sh
ssh mprinc@knalledge.org
cd /var/www/headsware/earthcube-test/src/frontend/prod
rm -rf components/ css/ data/ dist/ fonts/ images/ js/ sass/
unzip prod-2016.07.05-1.zip
mv dist/prod/* .
rm -r dist/

cd /var/www/headsware/earthcube-test/src/frontend

# replace
# `env=envs.localhost` -> `env=envs.server`
sed -i 's/env\s*\=\s*envs\.localhost/env\=envs\.server/g' prod/js/shims_bundle.js
sed -i 's/base\ href\=\"\/\"/base\ href\=\"\/prod\/\"/' prod/index.html

#optional commenting:
joe prod/index.html
# var disableLog = true;

```

Copy angular-material fonts from the local machine to the server.

Back on the local machine:

```sh
open ./node_modules/ng2-material/font
```

Upload all the 'font files' (MaterialIcons-Regular...) from the folder `src/frontend/node_modules/ng2-material/font` to the `/var/www/headsware/earthcube-test/src/frontend/prod/css/`

Upload `KnAllEdge/src/frontend/dist/prod/css/all.css` to the `/var/www/headsware/earthcube-test/src/frontend/prod/css/` folder

```sh
cdd
cd KnAllEdge/src/frontend
open ./dist/prod/css/
```

and finally fix privileges on server:

```sh
cd /var/www/headsware/earthcube-test/src/frontend/prod
chmod -R o+rx .
chmod -R g+wrx .
```
