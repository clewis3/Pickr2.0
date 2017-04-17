(function() {
	'use strict';

	angular.module('Student')
		.controller('GradeDeleteController', ['$scope', '$mdDialog', '$document', 'StudentResource', 'grades', function GradeDeleteController($scope, $mdDialog, $document, StudentResource, grades) {

			$scope.grades = grades;

			$scope.s = {
					grade: $scope.grades[0]
				};

			$scope.title = function() {
				return "Delete a Grade";
			};

			$scope.button = function() {
				if ($scope.edit) {
					return "Save";
				}
				return "Create";
			};

			
			$scope.delete = function() {
				$mdDialog.hide($scope.s.grade);
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}]);
})();
