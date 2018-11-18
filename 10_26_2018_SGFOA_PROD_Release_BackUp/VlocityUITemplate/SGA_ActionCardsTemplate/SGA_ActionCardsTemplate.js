vlocity.cardframework.registerModule.controller('SGActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionId) {
       
        if(!obj.hasOwnProperty('Company_State__c')) {
            return true;
        }else{
            //var profileValue = obj['LoggedInUserProfile__c'];
            var physicalState = obj['Company_State__c'];
            var TechABFPendingStatus = obj['TechABFPendingSpecialty__c'];
            var returnValue = true;
            //&& physicalState != 'NY'
            //if(actionId == 'custom-enrollment')
            //   returnValue = false;
            
            //TechABFPendingStatus added for SMGR-19323- IDC Offshore
            if(actionId == 'Custom-AllStates-Enroll' && TechABFPendingStatus == 'ABF App Completed - Specialty Pending')
                returnValue = false;
            //if(actionId == 'AddPointOfContact')
            //    returnValue = true;
            //if(actionId == 'Custom-CRMId-Creation')
            //    returnVaue = true;
            //if(actionId == 'CACO-ResendDocusign' && (physicalState != 'CA' && physicalState != 'CO'))
            //    returnValue = false;
            //if(actionId == 'resend-docusign' && physicalState != 'NY')
            //    returnValue = false;
            //if(actionId == 'Custom-QuoteNY'  && physicalState != 'NY')
            //    returnValue = false;
            //if(actionId == 'custom-quote'  && physicalState == 'NY')
            //    returnValue = false;
            if(actionId == 'Custom-ABFQuote'  && (physicalState == 'NY' || physicalState == 'NH' || physicalState == 'OH' || physicalState == 'GA' || physicalState == 'CA' || physicalState == 'IN' || physicalState == 'WI'))
                returnValue = false; 
            if(actionId == 'Custom-ABFAllStates-Enroll'  && (physicalState == 'NY' || physicalState == 'NH' || physicalState == 'OH' || physicalState == 'GA' || physicalState == 'CA' || physicalState == 'IN' || physicalState == 'WI')) 
                returnValue = false;
                
            /*************SMGR-19323- IDC Offshore*************/
            if(actionId == 'Custom-ABFSpecialityEnroll' && TechABFPendingStatus != 'ABF App Completed - Specialty Pending')
                returnValue = false;
            /*************SMGR-19323- IDC Offshore*************/
            
            return returnValue;
        }
    };
    
}]);