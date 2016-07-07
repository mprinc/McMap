# Assumptions

+ Service: `McmMapAssumptionService`
+ They are loaded from assumptions map from the server and parsed with parseDb()
+ Assumption categories are nodes of type: `assumptionCategory`
+ they contain nodes with assumptions and edges between them are of type 'containsAssumption'
+ parameters
    + itemsDescs: contains all assumptions, they are sorted by assumption category and then by name
    + itemCategoriesAll: contains assumptions by categories
+ methods
    + getAssumptionsCategories: returns itemCategoriesAll
