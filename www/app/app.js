(function(){

	'use strict';

	angular
		.module('movieApp', ['ionic', 'firebase', 'ngAnimate'])

		.run(function($ionicPlatform){

			$ionicPlatform.ready(function(){

				if (window.cordova && window.cordova.plugins.Keyboard) {

					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          			cordova.plugins.Keyboard.disableScroll(true);
				}

				if (window.StatusBar) {
					
					StatusBar.style(1);
				}
			})
		})

		.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider){

			$ionicConfigProvider.backButton.previousTitleText(false).text('');
			
			$stateProvider

			.state('login', {
		        url: '/login',
		        templateUrl: 'app/views/login.html',
		        controller: 'authController',
		        controllerAs: 'vm'
	      	})

      		.state('home', {
		        url: '/home',
		        templateUrl: 'app/views/home.html',
		        controller: 'homeController',
		        controllerAs: 'vm',
	      	})

	      	.state('lists-user', {
		        url: '/lists-user',
		        templateUrl: 'app/views/lists-user.html',
		        controller: 'listsUserController',
		        controllerAs: 'vm',
	      	})

	      	.state('movie', {
		        url: '/movie',
		        templateUrl: 'app/views/movie.html',
		        controller: 'movieController',
		        controllerAs: 'vm',
		        params: {movie:null}
	      	})

	      	.state('movie-user', {
		        url: '/movie-user',
		        templateUrl: 'app/views/movie-user.html',
		        controller: 'movieUserController',
		        controllerAs: 'vm',
		        params: {movie:null}
	      	})

	      	.state('list-movies', {
		        url: '/list-movies',
		        templateUrl: 'app/views/list-movies.html',
		        controller: 'listMoviesController',
		        controllerAs: 'vm',
		        params: {list:null}
	      	})

	      	.state('list-movies-grid', {
		        url: '/list-movies-grid',
		        templateUrl: 'app/views/list-movies-grid.html',
		        controller: 'listMoviesGridController',
		        controllerAs: 'vm',
		        params: {allMovies:null, allMoviesTitle:null, category:null}
	      	})

	      	.state('list-category-movies', {
		        url: '/list-category-movies',
		        templateUrl: 'app/views/list-category-movies.html',
		        controller: 'listCategoryMoviesController',
		        controllerAs: 'vm',
		        params: {category:null}
	      	})

	      	.state('search', {
		        url: '/search',
		        templateUrl: 'app/views/search.html',
		        controller: 'searchController',
		        controllerAs: 'vm'
	      	})

	      	.state('profile', {
		        url: '/profile',
		        templateUrl: 'app/views/profile.html',
		        controller: 'profileController',
		        controllerAs: 'vm'
	      	});
	      	
	      	if (localStorage.getItem('user') == null) {

	      		$urlRouterProvider.otherwise('login');

	      	} else {

	      		$urlRouterProvider.otherwise('home');
	      	}
		});

})();