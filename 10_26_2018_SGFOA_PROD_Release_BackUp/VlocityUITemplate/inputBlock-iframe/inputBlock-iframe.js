vlocity
    .cardframework
    .registerModule
    .controller('iframeBlockController', iframeBlockController);

iframeBlockController.$inject = ['$scope', '$sce', '$interpolate']
function iframeBlockController($scope, $sce, $interpolate)  {
    var vm = this;

    // Public Fields
    vm.iframeSrc = '';
    // Private Fields
    // Public Methods
    vm.init = init;
    // Method Definitions
    function init() {
        vm.iframeSrc = $sce.trustAsResourceUrl(parseIframeSrc($scope.control.propSetMap.iframeSrc));
    }
    
    function parseIframeSrc(urlVal) {
        var url = $interpolate(urlVal)($scope);
        
        return url;
    }
}