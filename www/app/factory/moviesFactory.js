(function(){

	'use strict';

	angular
		.module('movieApp')
		.factory('movies', movies);

	function movies($http){

		var apiKey = '648bf7f9b89c64a267d317265373a0c0',
		    path   = 'http://api.themoviedb.org/3';
		
		return {

			popular: function(){

			    var service = '/movie/popular';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			upcoming: function(){

			    var service = '/movie/upcoming';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			topRated: function(){

			    var service = '/movie/top_rated';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			yearMovies: function(){

			    var service = '/discover/movie';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey + '&primary_release_year=2015'
			    }
			    
			    return $http(getData);
			},

			search: function(name) {
			
				var service = '/search/movie';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey + '&query=' + name
			    }
			    
			    return $http(getData);
			},

			searchByID: function(id) {

				var service = '/movie/';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + id + '?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			genres: function() {

				var service = '/genre/movie/list';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + '?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			genresMovies: function(id) {

				var service = '/genre/';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + id + '/movies?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			},

			credit: function(id) {

				var service = '/movie/';

			    var getData = {

			    	method: 'GET',
			    	url: path + service + id + '/credits?api_key=' + apiKey
			    }
			    
			    return $http(getData);
			}
		}
	};

})();