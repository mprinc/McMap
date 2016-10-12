#cf_folder='/Users/sasha/Documents/data/development/KnAllEdge/src'
cf_folder='/Users/mprinc/Documents/data/development/KnAllEdge/src'
export cf_folder
linking_folder='.'

## declare an array components
declare -a components=("models" "modules" "tools" "node_modules")

## now loop through the above array
for component in "${components[@]}"
do
  # You can access them using echo "${components[0]}", "${components[1]}" also
  echo "checking $component"
  if [ ! -e "$linking_folder/$component" ];  then
      echo "linking $component"
      ln -s $cf_folder/backend/$component "$linking_folder/$component"
  # else
  #   echo "unlinking $component"
  #   unlink "$linking_folder/$component"
  fi
done
