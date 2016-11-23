(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('profileController', profileController);

	function profileController($scope, $state, firebaseDataService){
        
		var vm = this;

		vm.signOut = signOut;

		function signOut() {
            
            navigator.notification.confirm("Are you sure you want to sign out?", function(buttonIndex) {

                if (buttonIndex == 2) {

                    firebase.auth().signOut().then(success,error);    
                }

            }, 'Sign out', [ "Cancel", "Sign out"]);
        }

        function success() {

        	localStorage.removeItem('user');

        	$state.go('login');
        }

        function error(error){

        	messagesFactory.message('Error', error);
        }
	}

})();