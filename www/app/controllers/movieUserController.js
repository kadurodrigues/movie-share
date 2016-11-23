(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('movieUserController', movieUserController);

	function movieUserController($scope, $stateParams, $ionicLoading, $ionicScrollDelegate, firebaseDataService, movies, messagesFactory){

		var vm = this;
		
		vm.movie      = $stateParams.movie;
		vm.castLimit  = 4;
		vm.genreLimit = 3;
		vm.showCast   = true;
		vm.showInfo   = false;
		vm.openCast   = openCast;
		vm.openInfo   = openInfo; 
		vm.backdrop   = 'https://image.tmdb.org/t/p/w1000' + vm.movie.backdrop_path;
		vm.avatarPath = 'https://image.tmdb.org/t/p/w300';
		
		$scope.$on("$ionicView.loaded", function (view, state) {
			
			movies.credit(vm.movie.id).then(success, error);
		})

		function success(credit){
			
			vm.cast = credit.data.cast;
			vm.crew = credit.data.crew;		
		}

		function error(error) {
    		
    		messagesFactory.message('Error', error);
    	}

    	function openCast(){

    		vm.showCast  = true;
			vm.showInfo  = false;
    	}

    	function openInfo(){

    		vm.showInfo  = true;
    		vm.showCast  = false;
    	}
	}

})();