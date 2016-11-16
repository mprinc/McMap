echo "[push:$deploy_folder_sub] pushing to server started."
echo "[push:$deploy_folder_sub] zip name: $zipname"
echo "[push:$deploy_folder_sub] remote_zip_path: $remote_zip_path"

# http://www.gabrielserafini.com/blog/2008/08/19/mac-os-x-voices-for-using-with-the-say-command/
say -v Whisper "provide password!"&

local_zip_path=$zipname
# http://unix.stackexchange.com/questions/105667/upload-file-to-ftp-server-using-commands-in-shell-script
# http://stackoverflow.com/questions/11744547/sftp-to-send-file-with-bash-script
# http://stackoverflow.com/questions/4937792/using-variables-inside-a-bash-heredoc
# sftp
# sftp -v -oIdentityFile=path "$user@knalledge.org" <<EOF
echo "[push:$deploy_folder_sub] SFTP login as $user"
sftp -v "$user@knalledge.org" <<EOF
put $local_zip_path $remote_zip_path
EOF

say -v Whisper "project uploaded! provide password!"&
echo "[push:$deploy_folder_sub] Terminal login as $user"
ssh -v "$user@knalledge.org" <<EOF
cd $deploy_folder_base/$deploy_folder_sub
rm -f ../done.txt
rm -rf components/ css/ data/ dist/ fonts/ img/ images/ js/ sass/ index.html
unzip $remote_zip_path

mv dist/prod/* .
rm -r dist/

sed -i 's/env\s*\=\s*envs\.localhost/env\=envs\.server_$deploy_folder_sub/g' js/shims_bundle.js
sed -i 's/base\ href\=\"\/\"/base\ href\=\"\/$deploy_folder_sub\/\"/' index.html

chmod -R o+rx .
chmod -R g+wrx .

touch done.txt
echo "[push:$deploy_folder_sub:remote] pushing to server finished. Pushed file: $zipname"
EOF

echo "[push:$deploy_folder_sub] pushing to server finished. Pushed file: $zipname"

say -v Whisper "I finished deploying oh master!"&
