var collaboPluginsServicesModule = angular.module('collaboPluginsServices');

collaboPluginsServicesModule
  .service('GlobalEmitterService', GlobalEmitterService)
  .service('GlobalEmitterServicesArray', GlobalEmitterServicesArray)

var knalledgeMapServicesModule = angular.module('knalledgeMapServices');

knalledgeMapServicesModule
  .service('KnalledgeMapPolicyService', KnalledgeMapPolicyService)
  .service('KnalledgeMapViewService', KnalledgeMapViewService)
