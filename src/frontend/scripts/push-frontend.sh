#! /bin/bash -u

# Setting up paremeters
#http://linux.die.net/man/1/date
deploy_folder_base="/var/www/headsware/earthcube-test/src/frontend"
deploy_folder_sub="prod"

echo "[push] Command: $0"
if [ ! -z ${1+x} ] && [ $1 == "prod" ];  then
    echo "[push] Command parameter 1: $1"
    deploy_folder_sub="prod"
else
    deploy_folder_sub="beta"
fi

if [ ! -z ${2+x} ];  then
    echo "[push:$deploy_folder_sub] Command parameter 2: $2"
    zipname=$2
fi

echo "[push:$deploy_folder_sub] Zip file: $zipname"

remote_zip_path="$deploy_folder_base/$deploy_folder_sub/$zipname"
user="mprinc"

# http://askubuntu.com/questions/306851/how-to-import-a-variable-from-a-script
#  http://stackoverflow.com/questions/5228345/bash-script-how-to-reference-a-file-for-variables
export timestamp
export deploy_folder_base
export deploy_folder_sub
export zipname
export remote_zip_path
export user

# Loading script
my_dir="$(dirname "$0")"
"$my_dir/_push-frontend.sh"

echo "[push:$deploy_folder_sub] pushing finished"
