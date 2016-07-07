#http://linux.die.net/man/1/date
timestamp=`(date +'%Y.%m.%d-%H.%M')`
#timestamp='2016.07.07-04.48'
cd frontend
zipname="prod-frontend-$timestamp.zip"
echo "Zip name: $zipname"

npm run build.prod

cp ./node_modules/ng2-material/font/MaterialIcons-Regular* dist/prod/css/

echo "Zip name: $zipname"
zipcommand="zip -r -X $zipname dist/prod"
# http://stackoverflow.com/questions/4668640/how-to-execute-command-stored-in-a-variable
eval "$zipcommand"

# http://unix.stackexchange.com/questions/105667/upload-file-to-ftp-server-using-commands-in-shell-script
# http://stackoverflow.com/questions/11744547/sftp-to-send-file-with-bash-script
# sftp
local_zip_path=$zipname
remote_zip_path='/var/www/headsware/earthcube-test/src/frontend/prod/'$zipname
# sftp -v -oIdentityFile=path mprinc@headsware.com <<EOF
sftp -v mprinc@headsware.com <<EOF
put $local_zip_path $remote_zip_path
EOF

ssh -v mprinc@headsware.com <<EOF
cd /var/www/headsware/earthcube-test/src/frontend/prod
rm -f ../done.txt
rm -rf components/ css/ data/ dist/ fonts/ img/ images/ js/ sass/ index.html
unzip $remote_zip_path

mv dist/prod/* .
rm -r dist/
cd /var/www/headsware/earthcube-test/src/frontend

sed -i 's/env\s*\=\s*envs\.localhost/env\=envs\.server/g' prod/js/shims_bundle.js
sed -i 's/base\ href\=\"\/\"/base\ href\=\"\/prod\/\"/' prod/index.html

cd /var/www/headsware/earthcube-test/src/frontend/prod
chmod -R o+rx .
chmod -R g+wrx .

touch done.txt
EOF

# local_fonts_path='node_modules/ng2-material/font/MaterialIcons-Regular*'
# remote_css_path='/var/www/headsware/earthcube-test/src/frontend/prod/css/'
# local_css_path='dist/prod/css/all.css'
# # sftp -v -oIdentityFile=path mprinc@headsware.com <<EOF
# sftp -v mprinc@headsware.com <<EOF
# put $local_fonts_path $remote_css_path
# put $local_css_path $remote_css_path
# EOF
