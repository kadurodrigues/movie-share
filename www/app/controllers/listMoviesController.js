(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('listMoviesController', listMoviesController);

		function listMoviesController($scope, $rootScope, $state, $stateParams, $q, $ionicModal, $ionicLoading, $timeout, $ionicListDelegate, firebaseDataService, movies, messagesFactory, preloader){

			var vm = this;
			
			vm.list         = $stateParams.list;
			vm.showMovie    = showMovie;
			vm.addNewMovie  = addNewMovie;
			vm.removeMovie  = removeMovie;
			vm.listMovies   = [];
			vm.posters      = [];
			vm.genreLimit   = 3;
			vm.isLoading    = true;
            vm.isSuccessful = false;
			vm.path         = 'https://image.tmdb.org/t/p/w300';

			$scope.$on("$ionicView.loaded", function (view, state) {
				
				$ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});

				getListMovies(vm.list);
			})

			function addNewMovie() {

	        	$state.go('search');
	        }

	        function getListMovies(list){
	        	
			    var promises = [];

			    if (list.movies != undefined) {

			        vm.noMovies = false;

			        angular.forEach(list.movies, function(value) {
			       
			            var deferred = $q.defer();

			            firebaseDataService.moviesUser(value.id).$loaded().then(function(data) {
			                
			                vm.listMovies.push(data[0]);

			                deferred.resolve(data[0]);
			            })
			            
			            promises.push(deferred.promise);
			        })

			        $q.all(promises).then(

			            function(response) {
			            	
			                loaderImage(response);
			            },

			            function(error) {

			            	messagesFactory.message('Error', error);
			            }
			        )

			    } else {

			        vm.noMovies = true;
			        $ionicLoading.hide();
			    }
			}

	        function loaderImage(listMovies) {
	    		
	    		angular.forEach(listMovies, function(value){
	    			
	    			if (value.poster_path != null) {

	    				vm.posters.push( vm.path + value.poster_path );
	    			}	
	    		})

	    		preloader.preloadImages(vm.posters).then(

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

			function showMovie(movie){

				movie.added = true;
				$state.go('movie',{'movie': movie});
			}

			function removeMovie(movie) {
				
				navigator.notification.confirm("Are you sure you want to remove?", function(buttonIndex) {

					if (buttonIndex == 2) {

						firebaseDataService.removeUserMovie(movie, vm.list);

						$timeout(function() {

							reloadMovies();

						}, 500);

					} else {

						$ionicListDelegate.closeOptionButtons();
					}

		        }, 'Remove Movie', [ "Cancel", "Remove"]);
			}

			function reloadMovies(){
								
				vm.listMovies = [];

				var user = JSON.parse(localStorage.getItem('user'));
			
				angular.forEach(user.lists, function(value){
					
					if (value.title === vm.list.title) {

						getListMovies(value);
					}
				})
			} 

		};

})();