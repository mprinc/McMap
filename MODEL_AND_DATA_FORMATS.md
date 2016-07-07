# Assumptions

+ Service: `McmMapAssumptionService`
+ They are loaded from `assumptions` map from the server and parsed with parseDb()
+ Assumption categories are nodes of type: `assumptionCategory`
+ they contain nodes with assumptions and edges between them are of the type 'containsAssumption'
+ parameters
    + itemsDescs: contains all assumptions, they are sorted by assumption category and then by name
    + itemCategoriesAll: contains assumptions by categories
+ methods
    + getAssumptionsCategories: returns itemCategoriesAll

# Variables

+ Variables are complex entities consisting of object(s), pure-variable, operator, and quantity
+ Service `McmMapObjectService` loads them from the server and provides to other sub components (operators, ...)

## Objects

+ Service: `McmMapObjectService`
+ They are loaded from `variables` map from the server (with queryItemsDb() method) and parsed with parseDb()
    + `variables` map contains nodes with variables and edges between them are of the type `containsVariable`
    + Each variable conains quantities as a part of `KNode.dataContent.mcm.quantities` parameter which is array of object applicable quantities
    + during parsing hash-array `quantitiesAll` gets built with keys refering all possible quantities, and value telling in how many objects the same quantity has been used
        + for example the variable `degrees-per-hour_speed` has been used 38 times, and `depth` 45 times
    + hash array `objectsDescsById` contains all objects indexed by mcm id
    + hash array `objectsDescsByLabel`contains all objects indexed by mcm name
    + array objectsDescs contains all objects sorted by name
