# rm -rf /var/www/headsware/earthcube/frontend/*
# mkdir /tmp/headsware/earthcube
# rm -rf /tmp/headsware/earthcube/*
# rm -rf /tmp/headsware/earthcube/.[^.]*

cd /var/www/headsware/earthcube

# checking out selected folders
# http://stackoverflow.com/questions/600079/is-there-any-way-to-clone-a-git-repositorys-sub-directory-only
# http://stackoverflow.com/questions/2416815/how-to-git-pull-all-but-one-folder/2416991#2416991
git init
# git config core.sparsecheckout true
# echo frontend >> .git/info/sparse-checkout
git remote add -f origin https://github.com/mprinc/McModelar
git pull origin master

cp /var/www/headsware/earthcube/src/frontend/app/js/config/config.env.js /var/www/headsware/earthcube/config.env.js
cp /var/www/headsware/earthcube/config.env.js /var/www/headsware/earthcube/src/frontend/app/js/config/config.env.js

# BACKEND
cd backend
ln -s /var/www/knalledge/src/backend/models/ models
ln -s /var/www/knalledge/src/backend/modules/ modules
ln -s /var/www/knalledge/src/backend/tools/ tools
ln -s /var/www/knalledge/src/backend/node_modules/ node_modules
ln -s /var/www/knalledge/src/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js

# COMPONENTS
cd frontend/components
ln -s /var/www/knalledge/src/frontend/components/knalledgeMap knalledgeMap
ln -s /var/www/knalledge/src/frontend/components/rima rima
ln -s /var/www/knalledge/src/frontend/components/notify notify

# git clone https://bitbucket.org/mPrinC/headsware/earthcube

# cd /tmp/headsware/earthcube
# mkdir -p /var/www/headsware/earthcube/frontend