(function(){

	'use strict';

	angular
		.module('movieApp')

		.directive('hideTabs', function($rootScope) {
		    return {
		        restrict: 'A',
		        link: function($scope, $el) {
		            $rootScope.hideTabs = true;
		            $scope.$on('$destroy', function() {
		                $rootScope.hideTabs = false;
		            });
		        }
		    };
		})

		.controller('authController', authController);

		function authController($scope, $state, $ionicModal, $ionicLoading, $firebaseArray, authService, firebaseDataService, messagesFactory){

		// Config

		var vm = this;

		vm.signUp = signUp;
		vm.signIn = signIn;
		vm.openSignUp = openSignUp;
		vm.closeSignUp = closeSignUp;

		// functions

		function user() {

			vm.user = {

				name      : vm.user.name,
				lastName  : vm.user.lastName,
				email     : vm.user.email,
				password  : vm.user.password     
			}
		}

		function openSignUp() { 

			$scope.modal.show();
		};

		function signUp() {
			
			return authService.signUp(vm.user)

				.then(function() {

					firebaseDataService.users.push(vm.user);

					messagesFactory.message('Nice!', 'Your register has been successfully!');

					closeSignUp();
				})

				.catch(function(error) {

      				messagesFactory.message('Error', error);
    			})
		}

		function signIn() {
			
			return authService.signIn(vm.user).then(successAuthUser, error);
		}

		function successAuthUser(user) {
			
			firebaseDataService.currentUser(user.email).$loaded().then(successGetUser, error);
    	}

		function successGetUser(user) {
			
			localStorage.setItem('user', JSON.stringify(user[0]));

			$state.go('home');
    	}

    	function error(error) {
    		
    		messagesFactory.message('Error', error);
    	}

		function closeSignUp() { 

			$scope.modal.hide();
		}

  		$ionicModal.fromTemplateUrl('app/views/modal/sign-up.html', {

			scope: $scope,
			animation: 'slide-in-up'

		}).then(function(modal) {

			$scope.modal = modal;
		});
	};

})();