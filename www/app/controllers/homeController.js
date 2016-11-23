(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('homeController', homeController);

	function homeController($rootScope, $scope, $state, $ionicLoading, $timeout, $ionicHistory, $q, firebaseDataService, movies, messagesFactory, preloader){

		var vm = this;

		vm.user               = {};
		vm.openDiscover       = openDiscover;
		vm.openCategories     = openCategories;
		vm.showDiscover       = true;
		vm.showCategories     = false;
		vm.showMovie          = showMovie;
		vm.showAllMovies      = showAllMovies;
		vm.showCategoryMovies = showCategoryMovies;
		vm.movieLimit         = 3;
		vm.homeMovies         = [];
		vm.isLoading          = true;
        vm.isSuccessful       = false;
		vm.path               = 'https://image.tmdb.org/t/p/w1000';

		$scope.$on("$ionicView.loaded", function (view, state) {
			
			vm.user = JSON.parse(localStorage.getItem('user'));
			
			firebaseDataService.setCurrentUser(vm.user);
				
			$rootScope.user = vm.user;

			$ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});

			$q.all([movies.popular(), movies.upcoming(), movies.yearMovies(), movies.topRated()]).then(function(response){

				successPopular(response[0]);
				successUpcoming(response[1]);
				successYearMovies(response[2]);
				successTopRated(response[3]);

			}, function(response){
				
				error(response);
			})
		})

		function openDiscover() {
			
			vm.showCategories = false;
			vm.showDiscover   = true;	
		}

		function openCategories() {
			
			vm.showCategories = true;
			vm.showDiscover   = false;

			movies.genres().then(successGenres, error);				
		}

		function successGenres(genre){
			
			vm.categories = genre.data.genres;
		}

		function successPopular(movie) {
			
			vm.popularMovies = movie.data.results;
			vm.popularMoviesTitle = 'Most Popular';
			vm.homeMovies.push(vm.popularMovies.slice(0,3));
    	}

		function successUpcoming(movie) {
			
			vm.upcomingMovies = movie.data.results;
			vm.upcomingMoviesTitle = 'Up Coming';
			vm.homeMovies.push(vm.upcomingMovies.slice(0,3));
    	}

    	function successYearMovies(movie) {
			
			vm.yearMovies = movie.data.results;
			vm.yearMoviesTitle = 'Most Popular 2015';
			vm.homeMovies.push(vm.yearMovies.slice(0,3));
    	}

    	function successTopRated(movie) {
			
			vm.topRatedMovies = movie.data.results;
			vm.topRatedMoviesTitle = 'Top Rated';
			vm.homeMovies.push(vm.topRatedMovies.slice(0,3));
			loaderBackdrops(vm.homeMovies);
    	}

    	function error(error) {
    		
    		messagesFactory.message('Error', error.statusText);
    	}

		function loaderBackdrops(movies) {
    		
    		var backdrops = [];

    		angular.forEach(movies, function(value){
    			
    			angular.forEach(value, function(otherValue){
    				
    				if (otherValue.poster_path != null) {

	    				backdrops.push( vm.path + otherValue.poster_path );
	    			}
    			})	
    		})
    		
    		preloader.preloadImages(backdrops).then(

    			function handleResolve(response) {
			    	
	    			vm.isLoading    = false;
                    vm.isSuccessful = true;

				    $timeout(function() {

						$ionicLoading.hide();

					}, 800);
				},

				function handleError(response) {
					
					$ionicLoading.hide();
					messagesFactory.message('Error', response + ' error to load this image!');		
				} 
			)
    	}

		function showMovie(movie){
			
			$state.go('movie',{'movie': movie});
		}

		function showAllMovies(allMovies, allMoviesTitle) {
			
			$state.go('list-movies-grid',{'allMovies': allMovies, 'allMoviesTitle': allMoviesTitle});
		}

		function showCategoryMovies(category){
    		
    		$state.go('list-movies-grid',{'category': category});
    	}

    	$rootScope.goBack = function(){

    		$ionicHistory.goBack();
    	}
	}

})();