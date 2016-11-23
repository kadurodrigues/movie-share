(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('listCategoryMoviesController', listCategoryMoviesController);

		function listCategoryMoviesController($scope, $rootScope, $state, $stateParams, $ionicLoading, movies, messagesFactory){

			var vm = this;
			
			vm.category  = $stateParams.category;
			vm.showMovie = showMovie;

			$scope.$on("$ionicView.loaded", function (view, state) {
				
				$ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
				movies.genresMovies(vm.category.id).then(success, error);
			})

			function success(movies){
	    		
	    		vm.listMovies = movies.data.results;
	    		$ionicLoading.hide();
	    	}

	    	function error(error) {
    			
	    		messagesFactory.message('Error', error);
	    	}

			function showMovie(movie){
			
				$state.go('movie',{'movie': movie});
			}

		};

})();