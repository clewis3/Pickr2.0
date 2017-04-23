(function() {
	'use strict';

	angular.module('Student')
		.controller('StudentListController', ['$scope', '$location', '$mdDialog', 'Page', 'StudentResource', function($scope, $location, $mdDialog, Page, StudentResource) {
			Page.title('Student List');

			$scope.students = StudentResource.query();

			var set = function() {
				var t = new Set();
				for (var i=0; i<$scope.students.length; i++) {
					t.add(parseInt($scope.students[i].grade_level),10);
				}

				return Array.from(t).sort(function(a, b){return a-b});
			}

			$scope.deleting = false;

			$scope.delete = function(index, ev) {
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title("Are you sure")
					.content("Delete "+$scope.students[index].first_name+"?")
					.ariaLabel("Confirmation")
					.ok("Delete")
					.cancel("Cancel")
					.targetEvent(ev);
				$mdDialog.show(confirm).then(function() {
					$scope.deleting = true;
					$scope.students[index].$delete(function() {
						$scope.students.splice(index, 1);
						$scope.deleting = false;
					});
				}, function() {
					// do nufin
				});
			};

			$scope.deleteGrade = function(ev) {
				$scope.deleting = true;
				var deleteGrades = function(i, grade) {
					if (i < 0) {
						$scope.deleting = false;
						if (!$scope.$$phase) {
							$scope.$digest();
						}
						return;
					}
					console.log($scope.students[i].grade_level , grade);
					if ($scope.students[i].grade_level == grade) {
						$scope.students[i].$delete(function() {
							$scope.students.splice(i, 1);
							deleteGrades(i-1,grade);
						});
					} else {
						deleteGrades(i-1, grade);
					}
				};

				$mdDialog.show({
					controller: 'GradeDeleteController',
					templateUrl: '/js/student/view/delete-dialog.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					locals: {
						grades: set()
					}
				}).then(function(data) {
					var i = $scope.students.length-1;
					deleteGrades(i, data);
					$scope.deleting = false;
				});
			};

			$scope.deleteAll = function(ev) {
				$scope.deleting = true;
				var deleteAll = function(i) {
					if (i < 0) {
						$scope.deleting = false;
						if (!$scope.$$phase) {
							$scope.$digest();
						}
						return;
					}
					$scope.students[i].$delete(function() {
						$scope.students.splice(i, 1);
						deleteAll(i-1);
					});
				};
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title("Are you sure")
					.content("Delete all students?")
					.ariaLabel("Confirmation")
					.ok("Delete")
					.cancel("Cancel")
					.targetEvent(ev);
				$mdDialog.show(confirm).then(function() {
					var i = $scope.students.length-1;
					deleteAll(i);
				}, function() {
					$scope.deleting = false;
				});

			};

		}]);
})();

