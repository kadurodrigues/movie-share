(function(){

	'use strict';

	angular
		.module('movieApp')
		.controller('listsUserController', listsUserController);

		function listsUserController($scope, $rootScope, $state, $ionicPopup, $timeout, $ionicLoading, $ionicListDelegate, firebaseDataService, messagesFactory){

			var vm = this;
			
			vm.user           = JSON.parse(localStorage.getItem('user'));
			vm.showListMovies = showListMovies;
			vm.userLists      = vm.user.lists;
			vm.newList        = newList;
			vm.renameList     = renameList;
			vm.removeList     = removeList;

			function showListMovies(list) {
			
				$state.go('list-movies',{'list': list});
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

			function renameList(list) {
				
				$scope.showError = false;

				$scope.newTitle = list.title;

				$ionicPopup.show({
					scope: $scope,
					title: 'New Title',
				    templateUrl: 'app/views/popup/rename-list.html',
					buttons: [
						{ text: 'Cancel', type: 'button-custom-cancel', onTap: function() { $ionicListDelegate.closeOptionButtons(); }},
						{ text: 'Save',   type: 'button-custom', attr: 'data-ng-disabled="!$scope.newTitle"', onTap: function(e) { 
						  		
								if (this.scope.newTitle) {

									saveRename(list.title, this.scope.newTitle);

								} else {

									e.preventDefault();
			  						$scope.showError = true;
								}	
						  	}
						}
					]    
				})
			}

			function removeList(list) {

				navigator.notification.confirm("Are you sure you want to remove?", function(buttonIndex) {

					if (buttonIndex == 2) {

						firebaseDataService.removeUserList(list);

						$timeout(function() {
							
							messagesFactory.success('Removed');
							vm.user = JSON.parse(localStorage.getItem('user'));
							vm.userLists = vm.user.lists;

						}, 500);
						
					} else {

						$ionicListDelegate.closeOptionButtons();
					}

		        }, 'Remove List', [ "Cancel", "Remove"]);
			}

			function saveRename(oldTitle, newTitle) {
				
				firebaseDataService.renameUserList(oldTitle, newTitle);
				
				$ionicLoading.show({

			    	template: '<ion-spinner icon="lines"></ion-spinner>',
			    	duration: 500

			    }).then(function(){

			    	angular.forEach(vm.userLists, function(value){
						
						if (value.title == oldTitle) {

							value.title = newTitle;
						}
					})

					$ionicListDelegate.closeOptionButtons();
			    })
			} 
		};

})();