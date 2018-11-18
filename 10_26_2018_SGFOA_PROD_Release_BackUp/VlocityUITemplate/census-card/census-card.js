// logic
vlocity
	.cardframework
	.registerModule
	.controller('censusMemberController', CensusMemberController);
vlocity
	.cardframework
	.registerModule
	.controller('censusFieldController', CensusFieldController)

vlocity
	.cardframework
	.registerModule
	.directive('censusField', CensusFieldDirective);

CensusMemberController.$inject = ['$scope', '$rootScope','$filter', '$interpolate', '$q', 'dataService', 'editCardService'];
function CensusMemberController($scope, $rootScope, $filter, $interpolate, $q, dataService, editCardService) {
	var _this = this;

	// Public fields
	_this.form;
	_this.inputs = {};
	_this.obj = $scope.obj;
	_this.dependents = [];
	_this.fields = $scope.data.fields;
	_this.editState = false;
	_this.messages = editCardService.messages;
	_this.saveClassName = 'ap_CensusMembersController';
	_this.savMethodName = 'setCMRecords';
	_this.deleteMethod = 'deleteCMRecord';
	_this.requiredFields = ['AccountId', 'CensusHeaderRecordId', 'CensusMembersList']
	// Public methods
	_this.set = set;
	_this.getFieldVisibility = editCardService.getFieldVisibility;
	_this.performAction = performAction;
	_this.save = save;
	_this.deleteMember = deleteMember;
	_this.unDeleteMember = unDeleteMember;
	_this.addDependent = addDependent;
	_this.enterEditState = enterEditState;
	_this.exitEditState = exitEditState;

	// init
	$scope.$watch('records.length', init);

	function init(records) {
		if (_this.obj.isNew) {
			enterEditState();
		}
		if (angular.isDefined(records)) {
			_this.dependents = $filter('filter')($scope.records, {'%vlocity_namespace%__RelatedCensusMemberId__c':_this.obj.Id});
		}
	}
	
	//#region method definitions
	function addDependent(index) {
		$rootScope.$broadcast(
			'addDependent', 
			{
				properties: {
					'%vlocity_namespace%__RelatedCensusMemberId__c': _this.obj.Id,
					'%vlocity_namespace%__IsPrimaryMember__c': false
				},
				index: index
			}
		);
	}
	function enterEditState() {
		angular.extend(_this.inputs, editCardService.getCardValues(_this.obj, _this.fields));
		_this.editState = true;
	}

	function exitEditState() {
		_this.editState = false;
	}

	function set(params) {
		if (angular.isString(params.value)) {
			_this[params.key] = $interpolate(params.value)($scope);
		}  else {
			_this[params.key] = params.value;
		}
	}

	function save() {
		var inputMap = {};
		var record =  {};
		var optionsMap = {vlcClass:_this.saveClassName};
		
		inputMap.AccountId = _.get(editCardService.census, 'AccountId');
		inputMap.CensusHeaderId = _.get(editCardService.census, 'CensusHeaderRecord.Id');
		
		angular.extend(record, editCardService.getFormValues(_this.form));
		record.Id = _this.obj.Id;
		record['%vlocity_namespace%__RelatedCensusMemberId__c'] = _this.obj['%vlocity_namespace%__RelatedCensusMemberId__c'];
		record['%vlocity_namespace%__IsPrimaryMember__c'] = _this.obj['%vlocity_namespace%__IsPrimaryMember__c'];
		// if not primary
		// angular.extend(record, editCardService.getFormValues(_this.form))
		inputMap.CensusMembersList = [record];
		
		return dataService.doGenericInvoke(
			_this.saveClassName,
			_this.savMethodName,
			angular.toJson(inputMap),
			angular.toJson(optionsMap)
		)
		.then(handleResponse)
		.then(function(result) {
			// update the view values with result
			// update form values
			angular.extend(_this.obj, editCardService.getFormValues(_this.form)); // update the view
			$rootScope.$broadcast($scope.data.layoutName + '.events', {event: 'reload'});	
		})
		.then(exitEditState)
		.catch(handleError);
	}

	function deleteMember() {
		var inputMap = {};
		// todo abstract this
		inputMap.CensusMemberId = _this.obj.Id;
		inputMap['%vlocity_namespace%__IsPrimaryMember__c'] = _this.obj['%vlocity_namespace%__IsPrimaryMember__c'];
		var optionsMap = {vlcClass:_this.saveClassName};

		return dataService.doGenericInvoke(
			_this.saveClassName,
			_this.deleteMethod,
			angular.toJson(inputMap),
			angular.toJson(optionsMap)
		)
		.then(handleResponse)
		.then(function(response) {
			$rootScope.$broadcast($scope.data.layoutName + '.events', {event: 'reload'});	
		})
		.catch(handleError)
	}

	function unDeleteMember() {
		delete _this.isDeleted;
	}

	function handleResponse(result) {
		if (result.errorCode == 'INVOKE-200' && result.ErrorFlag !== 'true') {
			return $q.resolve(result);
		} else {
			return $q.reject(result);
		}
	}


	function handleError(reason) {
		switch (reason.ErrorField) {
			case 'Field' :
				var targetField = _.get($filter('filter')(_this.fields, {name: reason.ErrorCode}), '[0]');
				if (targetField) {
					targetField.errorMessages = targetField.errorMessages || [];
					targetField.errorMessages.push(reason.ErrorMsg);
				}
				break;
			case 'Record' :
				_this.messages.push({
					type: 'error',
					text: reason.ErrorMsg
				});
				break;
			default :
				console.error('Unhandled error saving census member',reason);
		}
	}

	function performAction() {
		var thisArgs = arguments;
		if (thisArgs[0] && thisArgs[0].hasExtraParams && thisArgs[0].extraParams.controllerMethod) {
		  performControllerAction(thisArgs[0].extraParams);
		} else {
		  $scope.performAction.apply(_this, thisArgs);
		}
	}

	function performControllerAction(params) {
		var method = _.get($scope, params.controllerMethod);
		if (method) {
		  method.call(this, params);
		} else {
		  console.warn('Method ' + params.controllerMethod  + ' not found.', params);
		}
	}
	//#endregion method definitions
}

function CensusFieldDirective() {
	var directive = {
		restrict: 'AE',
		scope: {
			editState: '=',
			obj: '='
		},
		template: '<span ng-show="vm"></span>',
		controller: 'censusFieldController',
		controllerAs: 'vm',
		bindToController: true
	}
}

function CensusFieldController() {
	var _this = this;
}