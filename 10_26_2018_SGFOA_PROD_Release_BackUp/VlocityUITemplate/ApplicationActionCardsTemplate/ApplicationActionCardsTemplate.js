vlocity.cardframework.registerModule.controller('SGActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionId) {
       
        if(!obj.hasOwnProperty('Account_State__c')) {
            return true;
        }else{
            //var profileValue = obj['LoggedInUserProfile__c'];
            var physicalState = obj['Account_State__c'];
            var appStatus = obj['%vlocity_namespace%__Status__c'];
            console.log(physicalState);
            console.log(appStatus);
            var returnValue = true;
			if(actionId == 'AddPointOfContact')
                returnValue = true;
            if(actionId == 'Custom-CRMId-Creation')
                returnVaue = true;
            if(actionId == 'CACO-ResendDocusign' && (physicalState != 'CA' && physicalState != 'CO'))
                returnValue = false;
            if(actionId == 'resend-docusign' && physicalState != 'NY')
                returnValue = false;
            if(actionId == 'AllStates-Resend-DocuSign' && (physicalState == 'NY' || physicalState == 'CA' || physicalState == 'CO'))
                returnValue = false;
            if(actionId == 'custom-uploads-docs' && appStatus == 'Enrollment Complete')
                returnValue = false;
            if(actionId == 'All-States-Payment' && physicalState == 'CT')
                returnValue = false;
            return returnValue;
        }
    };
    
}]);