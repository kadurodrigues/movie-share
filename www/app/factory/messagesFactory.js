(function(){

	'use strict';

	angular
		.module('movieApp')
		.factory('messagesFactory', messagesFactory);

	function messagesFactory($ionicLoading, $timeout){

		// Config

		var service = {

			message : message,
			success : success,
		}

		return service;

		// Functions

		function success(message) {
			
			$ionicLoading.show({ template: '<div class="success">' + message + ' <i class="ion-checkmark-round"></i> </div>' });

			$timeout(function() {

				$ionicLoading.hide();

			}, 1000);
		}

		function message(title, text) {
			
			navigator.notification.confirm(
                text, 
                function(buttonIndex){}, 
                title, 
                'OK'
            ); 
    	}
	};

})();