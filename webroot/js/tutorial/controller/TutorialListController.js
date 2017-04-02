(function() {
	'use strict';

	angular.module('Tutorial')
		.controller('TutorialListController', ['$scope', '$mdDialog', 'Page', 'TutorialCycleResource', 'StudentTutorialResource', 'StudentFactory', function($scope, $mdDialog, Page, TutorialCycleResource, StudentTutorialResource, StudentFactory) {
			Page.title("Tutorials");

			var tutorials = TutorialCycleResource.query({cycle_id:0});
			$scope.user = StudentFactory.user();
			$scope.tutorial = {
				"Active": [],
				"Open": []
			};
			//if (!!$scope.user.tutorials.length) {
				// find active and open tutorials
				//console.log(tutorials, typeof tutorials, tutorials.length, tutorials instanceof Array;
				for (var i=0; i<$scope.user.tutorials.length; i++) {
					var tutorial = $scope.user.tutorials[i];
					if (tutorial['cycle']['status'] == "Open") {
						$scope.tutorial['Open'] = $scope.user.tutorials[i];
						console.log($scope.tutorial);
					} else if (tutorial['cycle']['status'] == "Active") {
						$scope.tutorial['Active'] = $scope.user.tutorials[i];
					}
				}
			//}

			var find = function(id) {
				for (var i=0; i<tutorials.length; i++) {
					if (tutorials[i].id == id) {
						return tutorials[i];
					}
				}
				return false;
			};

			$scope.list = function() {
				var result = [];
				for (var i=0; i<tutorials.length; i++) {
					if (/*tutorials[i].id != $scope.tutorial.id && */tutorials[i].students <= tutorials[i].max_students) {
						result.push(tutorials[i]);
					}
				}
				return result;
			};

			$scope.full = function(tut) {
				return tut.max_students <= tut.students;
			};

			$scope.select = function(id, ev) {
				var tut = find(id);
				if ($scope.full(tut)) {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.body))
							.clickOutsideToClose(true)
							.title("Tutorial Full")
							.content("Sorry, but this tutorial is full and cannot allow more students")
							.ariaLabel("Tutorial Full")
							.ok("OK")
							.targetEvent(ev)
					);
				} else {
					var conf = $mdDialog.confirm()
						.parent(angular.element(document.body))
						.title("Are you sure?")
						.content("Register for "+tut.name+"?")
						.ok("Yes")
						.cancel("Cancel")
						.targetEvent(ev);
					$mdDialog.show(conf).then(function() {
						StudentTutorialResource.register({student_id:StudentFactory.Id(), tutorial_id:id}, function(data) {
							console.log(tut);
							$scope.tutorial['Open'] = tut;
						});
					}, function() {
						// do nothing
					});
				}
			};

			$scope.registered = function(type) {
				return !!$scope.tutorial[type].id;
			};

			$scope.locked = function(type) {
				if (!!$scope.tutorial[type].id) {
					return !!$scope.tutorial[type].student_tutorial.locked;
				}
				return false;
			};

		}]);
})();



