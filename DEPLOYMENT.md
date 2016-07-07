# Deployment

## Production deployment - frontend

### New way

Now you can use deploy command:

```sh
cdd
cd EarthCube/McMap/src/
./scripts/deploy-frontend.sh
```

### Host prod build on local server

First be sure you have instaled [local web server](https://www.npmjs.com/package/http-server):
```sh
npm install http-server -g
```

build production:
```sh
cdd
cd EarthCube/McMap/src/frontend
npm run build.prod
```

run local server and open it:
```sh
cd dist/prod
http-server
```

Navigate to [the localhost](http://localhost:8080/)

### Old way
There are two groups of actions to be done. First on local machine, then on the server

### Build system on the local machine:

```sh
cdd
cd EarthCube/McMap/src/frontend
npm run build.prod
zip -r -X prod-frontend-2016.07.07-1.zip dist/prod
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
unzip prod-frontend-2016.07.07-1.zip
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

Upload all the 'font files' (MaterialIcons-Regular...) from the folder `src/frontend/node_modules/ng2-material/font` to the `/var/www/headsware/earthcube-test/src/frontend/prod/css/` folder

Upload `KnAllEdge/src/frontend/dist/prod/css/all.css` to the same folder on the server

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

## Production deployment - backend

Start a SFTP client and navigate to the backend folder on server:  `/var/www/headsware/earthcube/src/backend`

upload:

+ EarthCubeBackend.js

zip -r -X prod-backend-2016.07.05-2.zip EarthCubeBackend.js
Login to the server and unpack CF system and configure it:

open on server ssh and do:


```sh
cd /var/www/headsware/earthcube/src/backend

su

/usr/bin/nodejs /var/www/headsware/earthcube/src/backend/EarthCubeBackend.js 8042

start mcm-b
restart mcm-b
stop mcm-b
status mcm-b
exit

```
