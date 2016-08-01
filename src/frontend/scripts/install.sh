cf_folder='/Users/sasha/Documents/data/development/KnAllEdge/src'
export cf_folder
components_folder='app/components'

## declare an array components
declare -a components=("puzzles.js" "bottomPanel" "mediaShow" "rima" "notify" "topiChat" "collaboPlugins" "login" "utils" "knalledgeMap" "request" "ontov" "mapsList" "gardening" "change")

## now loop through the above array
for component in "${components[@]}"
do
  # You can access them using echo "${components[0]}", "${components[1]}" also
  echo "checking $component"
  if [ ! -e "$components_folder/$component" ];  then
      echo "linking $component"
      ln -s $cf_folder/frontend/app/components/$component "$components_folder/$component"
  # else
  #   echo "unlinking $component"
  #   unlink "$components_folder/$component"
  fi
done
