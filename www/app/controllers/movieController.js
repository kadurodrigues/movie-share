(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('movieController', movieController);

	function movieController($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicActionSheet, firebaseDataService, movies, messagesFactory, preloader){

		var user = JSON.parse(localStorage.getItem('user'));

		var vm = this;
		
		vm.movieSelected  = $stateParams.movie;
		vm.scrollPosition = scrollPosition;
		vm.userLists      = user.lists;
		vm.openModal      = openModal;
		vm.closeModal     = closeModal;
		vm.newList        = newList;
		vm.getList        = getList;
		vm.openCast       = openCast;
		vm.openInfo       = openInfo;
		vm.saveMovie      = saveMovie;
		vm.optionsMovie   = optionsMovie;
		vm.shareMovie     = shareMovie;
		vm.showCast       = true;
		vm.showInfo       = false;
		vm.listItem       = false;
		vm.isLoading      = true;
        vm.isSuccessful   = false;
        vm.castLimit      = 5;
		vm.genreLimit     = 3;
		vm.listSelected   = {};
		vm.movieToAdd     = {};
		vm.backdrop       = 'https://image.tmdb.org/t/p/w1000' + vm.movieSelected.backdrop_path;
		vm.avatarPath     = 'https://image.tmdb.org/t/p/w300';
		vm.barMovie       = '';
		
		$scope.$on("$ionicView.loaded", function (view, state) {
			
			$ionicLoading.show({
				template: '<div class="spinner-backdrop"><ion-spinner icon="lines"></ion-spinner></div>',
				noBackdrop: true
			});

			loaderBackDrop(vm.backdrop);

			movies.searchByID(vm.movieSelected.id).then(success, error);
			movies.credit(vm.movieSelected.id).then(successCredit, error);
		})

		function loaderBackDrop(backdrop) {
    		
    		var backdropPoster = [];

    		backdropPoster.push(backdrop);

    		preloader.preloadImages(backdropPoster).then(

    			function handleResolve(response) {
			    	
	    			vm.isLoading    = false;
                    vm.isSuccessful = true;

				    $ionicLoading.hide();
				},

				function handleError(response) {
					
					$ionicLoading.hide();
					vm.isLoading = true;		
				} 
			)
    	}

		function success(response) {
			
			vm.movie = response.data;
		}

		function successCredit(response) {
			
			vm.cast  = response.data.cast;
			var crew = response.data.crew;

			crew.some(function(value){
				
				if (value.department == 'Directing') {

					return vm.director = value.name;
				}
			})
		}

		function error(response) {
			
			messagesFactory.message('Error', response);
		}

		function newList() {

			$ionicPopup.show({
				scope: $scope,
				title: 'New list',
			    templateUrl: 'app/views/popup/new-list.html',
				buttons: [
					{ text: 'Cancel', type: 'button-custom-cancel' },
					{ text: 'Save', type: 'button-custom', attr: 'data-ng-disabled="!$scope.listName"', onTap: function(e) { 
					  		
							if (this.scope.listName) {

								firebaseDataService.createUserList(this.scope.listName);
								
								if (vm.userLists === undefined ) {

									vm.userLists = [];
								}

								messagesFactory.success('List Created');
								vm.userLists.push({title:this.scope.listName});

						  	} else {

								e.preventDefault();
						  		$scope.showError = true;
						  	}
					  	}
					}
				]    
			})
		}

		function getList(list){

			vm.listSelected = list;	
			vm.listItem     = true;
		}

		function saveMovie(){
			
			firebaseDataService.saveMovie(vm.listSelected, vm.movieToAdd);

			$timeout(function() {

				closeModal();

			}, 1000);
		}

		function openCast(){

    		vm.showCast  = true;
			vm.showInfo  = false;
    	}

    	function openInfo(){

    		vm.showInfo  = true;
    		vm.showCast  = false;
    	}

		function openModal(movie) { 
			
			vm.movieToAdd = movie;
			$scope.modal.show();
		}

		function closeModal() { 

			$scope.modal.hide();
		}

		function scrollPosition($index){

			var position = $ionicScrollDelegate.getScrollPosition().top;

			$scope.$apply(function(){

		    	if(position > 150){

		        	vm.barMovie = $index;

		      	} else{

		        	vm.barMovie = '';
		    	}
		    })
		}

		function optionsMovie(){
			
			if (vm.movieSelected.added == true) {

				shareMovie(vm.movie);

			} else {

				$ionicActionSheet.show({

					cssClass: 'options-movie',
					buttons: [{ text: 'Add to List' }, { text: 'Share Movie' }],
					cancelText: 'Cancel',
					buttonClicked: function(index) {
						
						switch(index){

							case 0: openModal(vm.movie);
									return true;

							case 1: shareMovie(vm.movie);
									return true;
						}
					}
				})
			}	
		}

		function shareMovie(movie){
			
			var poster   = "https://image.tmdb.org/t/p/w300" + movie.poster_path,
				overview = movie.overview.substring(0, 140) + "...";


			window.plugins.socialsharing.share(movie.title + ": " + overview + " IMDB: " + movie.vote_average + " &#x2b50;", 'MovieShare', poster, null,
	            	
	            function() {

	            },

	            function (error) {

	                messagesFactory.message('Error', error);
	            })
		}

		$ionicModal.fromTemplateUrl('app/views/modal/new-movie.html', {

			scope: $scope,
			animation: 'slide-in-up'

		}).then(function(modal) {

			$scope.modal = modal;
		});
	}

})();