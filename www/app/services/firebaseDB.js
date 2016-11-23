(function(){

	'use strict';

	angular
		.module('movieApp')
		.config(function(){

			var config = {

				apiKey: "AIzaSyCj3y7Wj0wF1IJkqmgqcQIM7K0BF3Kz-uY",
	    		authDomain: "movieapp-ed984.firebaseapp.com",
	    		databaseURL: "https://movieapp-ed984.firebaseio.com",
	    		storageBucket: "",
			}

			firebase.initializeApp(config);
		});
})();