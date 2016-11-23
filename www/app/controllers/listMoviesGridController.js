(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('listMoviesGridController', listMoviesGridController);

		function listMoviesGridController($scope, $state, $stateParams, $ionicLoading, movies, preloader){

			var vm = this;
			
			vm.category      = $stateParams.category;
			vm.showMovie     = showMovie;
			vm.isLoading     = true;
            vm.isSuccessful  = false;
            vm.path          = 'https://image.tmdb.org/t/p/w300';

			$scope.$on("$ionicView.loaded", function (view, state) {
				
				$ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
					
				vm.allMovies       = $stateParams.allMovies;
				vm.allMoviesTitle  = $stateParams.allMoviesTitle;
				
				if (vm.allMovies != null) {

					loaderImage(vm.allMovies);

				} else {

					movies.genresMovies(vm.category.id).then(success, error);
				}
			})

			function success(movies){
	    		
	    		vm.allMovies = movies.data.results;
	    		loaderImage(vm.allMovies);
	    	}

	    	function loaderImage(allPosters) {
	    		
	    		var posters = [];

	    		angular.forEach(allPosters, function(value){
	    			
	    			if (value.poster_path != null) {

	    				posters.push( vm.path + value.poster_path );
	    			}	
	    		})

	    		preloader.preloadImages(posters).then(

	    			function handleResolve(response) {
				    	
		    			vm.isLoading    = false;
	                    vm.isSuccessful = true;

					    $ionicLoading.hide();
					},

					function handleError(response) {
						
						$ionicLoading.hide();
						messagesFactory.message('Error', response + ' error to load this image!');		
					} 
				)
	    	}

	    	function error(error) {
    			
	    		messagesFactory.message('Error', error);
	    	}

			function showMovie(movie){
			
				$state.go('movie',{'movie': movie});
			}

		};

})();