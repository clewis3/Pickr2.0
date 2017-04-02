(function() {
	'use strict';

	angular.module('Student')
		.controller('StudentUnassignedController', ['$scope', '$mdDialog', '$document', 'StudentResource', function StudentUnassignedController($scope, $mdDialog, $document, StudentResource) {

			$scope.students = StudentResource.query({id:"activeU"}, function() {
				console.log($scope.students);
				for (var i=0; i<$scope.students.length; i++) {
					var student = $scope.students[i];
					if (student.tutorial.length) {
						student.instructor = student.tutorial[0].teacher_name;
						student.room = student.tutorial[0].room_number;
						student.tutorial = student.tutorial[0].name;
					}
				}
			});

			$scope.title = function() {
				return "Students Unassigned";
			};


			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}]);
})();
