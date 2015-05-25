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

# Server:
cd backend
ln -s /var/www/knalledge/backend/models/ models
ln -s /var/www/knalledge/backend/modules/ modules
ln -s /var/www/knalledge/backend/tools/ tools
ln -s /var/www/knalledge/backend/node_modules/ node_modules
ln -s /var/www/knalledge/backend/KnAllEdgeBackend.js KnAllEdgeBackend.js

cd frontend/components
ln -s /var/www/knalledge/frontend/components/knalledgeMap knalledgeMap
ln -s /var/www/knalledge/frontend/components/rima rima
ln -s /var/www/knalledge/frontend/components/notify notify

# git clone https://bitbucket.org/mPrinC/headsware/earthcube

# cd /tmp/headsware/earthcube
# mkdir -p /var/www/headsware/earthcube/frontend