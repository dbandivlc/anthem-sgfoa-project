vlocity.cardframework.registerModule.controller('SGActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
       
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var returnValue = true;
			 if(actionname == 'Create SG Quote - NY' && profileValue=='Anthem SG Broker (Non Quoting)')
                returnValue = false;
			if(actionname == 'Create Census Members' && profileValue == 'Anthem SG Broker (Non Quoting)')
                returnValue = false;
            return returnValue;
        }
    };
    
}]);