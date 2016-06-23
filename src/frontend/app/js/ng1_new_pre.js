exports = {};
function require(module){
    var modules = {};
    if(module === './globalEmitterService') modules.GlobalEmitterService = GlobalEmitterService;
    return modules;
}
