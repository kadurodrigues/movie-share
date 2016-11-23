(function(){

	'use strict';

	angular
		.module('movieApp')
		.factory('authService', authService);

	function authService($firebaseAuth){

		// Config

		var firebaseAuthObject = $firebaseAuth();

		var service = {

			firebaseAuthObject : firebaseAuthObject,
			signUp             : signUp,
			signIn             : signIn
		}

		return service;

		// Functions

		function signUp(user) {
			
    		return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
    	}
		
		function signIn(user) {
			
    		return firebaseAuthObject.$signInWithEmailAndPassword(user.email, user.password);
    	}

	};

})();