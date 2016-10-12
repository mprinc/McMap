#cf_folder='/Users/sasha/Documents/data/development/KnAllEdge/src'
cf_folder='/Users/mprinc/Documents/data/development/KnAllEdge/src'
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

## declare an array components
declare -a otherRefs=("app/js/knalledge" "app/js/interaction")

## now loop through the above array
for otherRef in "${otherRefs[@]}"
do
  echo "checking $otherRef"
  if [ ! -e "./$otherRef" ];  then
      echo "linking $otherRef"
      ln -s $cf_folder/frontend/$otherRef "./$otherRef"
  # else
  #   echo "unlinking $otherRef"
  #   unlink "$otherRefs_folder/$otherRef"
  fi
done
