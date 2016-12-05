(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('searchController', searchController)
		.directive('autofocus', function($timeout) {
			return {
				link: function(scope, element, attrs) {
					$timeout(function() {
						element[0].focus(); 
					},450);
				}
			};
		});

		function searchController($scope, $http, $state, $ionicLoading, $timeout, firebaseDataService, movies){

			var vm = this;

			vm.movieResult  = true;
			vm.searchTitle  = vm.searchTitle;
			vm.liveSearch   = searchMovie;
			vm.showMovie    = showMovie;
			vm.clearResult  = clearResult;
			vm.movieFound   = [];

			function searchMovie() {
	        	
	        	if (vm.searchTitle != '') {

	        		$timeout(function() {

						$ionicLoading.show({

							template: 'Searching...'

						}).then(function(){

							movies.search(vm.searchTitle).then(successSearch,error);
						})

					}, 500);

	        	} else {

	        		$ionicLoading.hide();
	        		vm.movieResult = false;
	        	}
			}

			function successSearch(movie){
				
				$ionicLoading.hide();

				if (movie.data.results.length != 0) {

					vm.movieFound  = movie.data.results;
					vm.movieResult = true;

				} else {

					vm.movieResult = false;
				}
			}

			function error() {
				
				$ionicLoading.hide();		
			}	

			function showMovie(movie){
			
				$state.go('movie',{'movie': movie});
			}

			function clearResult(){

				vm.searchTitle = '';
				vm.movieResult = false;
			}
		};

})();