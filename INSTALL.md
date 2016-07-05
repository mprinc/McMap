# BACKEND

```sh

cd backend

#Sasa (sasha)
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/models/ models
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/node_modules/ node_modules
# ln -s /Users/sasha/Documents/data/development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js

#Sasa (mprinc)
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/models/ models
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/mprinc/Documents/data/development/KnAllEdge/src/backend/node_modules/ node_modules

#Server:
ln -s /var/www/knalledge/src/backend/models/ models
ln -s /var/www/knalledge/src/backend/modules/ modules
ln -s /var/www/knalledge/src/backend/tools/ tools
ln -s /var/www/knalledge/src/backend/node_modules/ node_modules
# ln -s /var/www/knalledge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js

#Sinisa:
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/models/ models
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/modules/ modules
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/tools/ tools
ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/ node_modules
# ln -s /Users/sir/Documents/data/Development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js

cp -r /Users/sasha/Documents/data/development/KnAllEdge/src/backend/config .
cp /Users/sasha/Documents/data/development/KnAllEdge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js
cp /Users/sasha/Documents/data/development/KnAllEdge/src/backend/package.json package.json
```

# FRONTEND

## Sasha (sasha)

```sh
cd frontend/app/js
rm interaction
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
rm knalledge
ln -s /var/www/knalledge_frontend/dist/dev/js/knalledge knalledge

# COMPONENTS
cd frontend/app/components
rm collaboPlugins knalledgeMap login notify rima topiChat utils

# Sasha (sasha)
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

# Sasha (mprinc)
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

# Server
rm knalledgeMap rima notify topiChat collaboPlugins login

ln -s /var/www/knalledge_frontend/dist/dev/components/knalledgeMap knalledgeMap
ln -s /var/www/knalledge_frontend/dist/dev/components/rima rima
ln -s /var/www/knalledge_frontend/dist/dev/components/notify notify
ln -s /var/www/knalledge_frontend/dist/dev/components/topiChat topiChat
ln -s /var/www/knalledge_frontend/dist/dev/components/collaboPlugins collaboPlugins
ln -s /var/www/knalledge_frontend/dist/dev/components/login login
ln -s /var/www/knalledge_frontend/dist/dev/components/utils utils

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
