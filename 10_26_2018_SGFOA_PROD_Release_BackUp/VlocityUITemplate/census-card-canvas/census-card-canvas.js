vlocity
	.cardframework
	.registerModule
	.service('editCardService', EditCardService);

	vlocity
	.cardframework
	.registerModule
	.directive('apInput', apInputDirective);

vlocity
	.cardframework
	.registerModule
	.filter('groupBy', GroupByFilter);

vlocity
	.cardframework
	.registerModule
	.controller('censusController', CensusController);

//#region controllrs
CensusController.$inject = ['$scope','$rootScope', 'editCardService'];
function CensusController($scope, $rootScope, editCardService) {
	var _this = this;
	//Public fields
	_this.messages = editCardService.messages;
	
	// Public methods
	_this.addMember = addMember;
	_this.removeMessage = editCardService.removeMessage;
	_this.getFieldVisibility = editCardService.getFieldVisibility;
	// Listeners
	$scope.$on('addDependent', function(event, message) {
		addMember(message.properties, message.index);
	});
	
	// Init
	editCardService.census = $scope.records;


	function addMember(props, index) {
		var newRecord = {
			'Id': 'NewRecord_' + _.get($scope, 'records.CensusMembersList.length', '0'),
			'isNew': true,
			'%vlocity_namespace%__IsPrimaryMember__c': true
		};
		angular.extend(newRecord, props);
		var newCard = angular.copy($scope.cards[0]);
		newCard.status = 'active';
		newCard.obj = newRecord;

		if (index) {
			$scope.records.CensusMembersList.splice(index, 0, newRecord);	
			$scope.cards.splice(index, 0, newCard);
		} else {

			$scope.records.CensusMembersList.push(newRecord); // not sure if this is necessary
			$scope.cards.push(newCard);
		}
		// $rootScope.$broadcast('vlocity.layout.' + $scope.layoutName + '.events', {event: 'reload'});
	}

}
//#endregion controllers

//#region services
EditCardService.$inject = ['$filter'];
function EditCardService($filter) {
	var _this = this;
	// Public Fields
	_this.messages = [];
	// Public Methods
	_this.getFormValues = getFormValues;
	_this.getCardValues = getCardValues
	_this.removeMessage = removeMessage;
	_this.getFieldVisibility = getFieldVisibility;
	_this.save = save;
	//#region method definitions


	/**
	 * Return an object representing the current values of the form
	 * 
	 * @param {Object} form - ng-form
	 * @returns Object
	 */
	function getFormValues(form) {
		var record = {};
		// .this.form.$$controls[3].$name
		form.$$controls.forEach(function(control) {
			_.set(record, control.$name, control.$viewValue);
		});
		return record;
	}

	
	/**
	 * Return an object representing the current values of the cards obj mapped to literal field names
	 * 
	 * @param {any} obj 
	 * @param {any} fields 
	 * @returns 
	 */
	function getCardValues(obj, fields) {
		var values = {};
		fields.forEach(function(field) {
			values[field.name] = $filter('getter')(obj, field);
		});
		return values;
	}

	function getFieldVisibility(field, params) {
		var keys = Object.keys(params);
		var isVisible = true;
		keys.forEach(function(key) {
			if (params[key] === 'hide' && field.name.indexOf(key) > -1) {
				isVisible = false;
			}
		});
		return isVisible;
	}

	function save() {

	}

	/**
	 * public void showMessage
	 * 
	 * @param {{title:string, description:string, type:string}} message
	 * @return {void}
	 */
	function showMessage(message) {
		_this.messages.push(message);
	}

	/**
	 * public void removeMessage
	 * 
	 * @param {number} index 
	 */
	function removeMessage(index) {
		_this.messages.splice(index, 1);
	}
	//#endregion method definitions 

}
//#endregion services
	
//#region filters
GroupByFilter.$inject = [];
function GroupByFilter() {
	return function filterFn(input, identity) {
		if (angular.isUndefined(identity)) {
			console.warn('no grouping identifier passed to groupBy filter');
			return input;
		}

		var output = _.groupBy(input, identity);
		return output;
	}
}

//#endregion filters

//#region directives
function apInputDirective() {
	var directive = {
		restrict: 'AE',
		templateUrl:'apInputTemplate',
		link: linkFn,
		scope: {
			type: '@',
			ngModel: '=',
			field: '=',
			name: '@',
			ctrlId: '@',
			ctrlName: '@'
		}
	}

	return directive;

	function linkFn(scope, element, attrs) {
		// if type is select, try parsing the options values
		if (scope.type === 'select') {
			scope.options = _.get(scope, 'field.data.options');
			if (scope.options) {
				scope.options = scope.options.split(',');
			}
		}

	}
}