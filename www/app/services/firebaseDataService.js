(function(){

    'use strict';

    angular
        .module('movieApp')
        .service('firebaseDataService', firebaseDataService);

    function firebaseDataService($firebaseArray, $rootScope, $ionicLoading, $timeout, movies, messagesFactory){

        var root = firebase.database();

        var service = {

            users           : root.ref('users'),
            movies          : root.ref('movies'),
            currentUser     : currentUser,
            getMovies       : getMovies,
            moviesUser      : moviesUser,
            setCurrentUser  : setCurrentUser,
            getMoviesUser   : getMoviesUser,
            createUserList  : createUserList,
            renameUserList  : renameUserList, 
            removeUserList  : removeUserList,
            removeUserMovie : removeUserMovie,
            checkMovie      : checkMovie, 
            saveMovie       : saveMovie,
            current         : [],
            user            : [], 
            collection      : []  
        }

        return service;

        function currentUser(email) {
            
            return $firebaseArray(service.users.orderByChild('email').equalTo(email));
        }

        function getMovies(){
          
            return $firebaseArray(service.movies);
        }

        function moviesUser(movieID){
            
            return $firebaseArray(service.movies.orderByChild('id').equalTo(movieID));
        }

        function getMoviesUser(user){

            if (user.movies) {

                angular.forEach(user.movies, function(value){

                    service.moviesUser(value.id).$loaded().then(successMoviesUser,error);
                });
            }
        }

        function setCurrentUser(user) {
            
            service.currentUser(user.email).$loaded().then(function(data){
                
                service.current = data; 

                service.user = service.current.$getRecord(user.$id);   
            }) 
        }

        function createUserList(listName) {
            
            if (service.user.lists == null) {

                service.user.lists = [];
            }
            
            service.user.lists.push({

                'title'  : listName
            })

            service.current.$save(service.user).then(successSave, error);
        }

        function renameUserList(oldTitle, newTitle) {
            
            angular.forEach(service.user.lists, function(value){
                
                if (value.title == oldTitle) {

                    value.title = newTitle;
                }
            })
            
            service.current.$save(service.user).then(successSave, error);
        }

        function removeUserList(list) {
            
            angular.forEach(service.user.lists, function(value){
                
                if (value.title === list.title) {

                    service.user.lists.splice(service.user.lists.indexOf(value),1);
                }
            })
            
            service.current.$save(service.user).then(successSave, error);
        }

        function removeUserMovie(movie, list) {
            
            angular.forEach(service.user.lists, function(value){
                
                if (value.title === list.title) {
                    
                    angular.forEach(value.movies, function(data){
                        
                        if (data.id === movie.id) {

                            value.movies.splice(value.movies.indexOf(data),1);
                        }
                    })  
                }
            })
            
            service.current.$save(service.user).then(successSave, error);
        }

        function saveMovie(list, movie){
            
            var statusMovie = isMovieAdded(list, movie.id);
            
            if (!statusMovie) {

                angular.forEach(service.user.lists, function(value){
                    
                    if (value.title === list.title) {

                        if (value.movies == null) {

                            value.movies = [];
                        }
                        
                        value.movies.push({id : movie.id});
                    }
                })

                checkNewMovie(movie);
                
                service.current.$save(service.user).then(successSave, error);
                messagesFactory.success('Movie Saved');

            } else {
                
                messagesFactory.message('Movie Share', 'You have this movie in this list yet!');
            }
        }

        function checkNewMovie(movie){
            
            service.getMovies().$loaded()

                .then(function(data){
                    
                    var statusMovie = checkMovie(data, movie.id);
                    
                    if (!statusMovie) {
                        
                        movies.searchByID(movie.id).then(function(result){
                            
                            service.movies.push(result.data);
                        })
                    }   
                })   
        }

        function isMovieAdded(list, movieID) {
            
            if (list.movies === 0 || list.movies === undefined) {

                return false;
            }

            var hasMovie = false;

            angular.forEach(list.movies, function(value){
                
                if (value.id === movieID) {

                    hasMovie = true;
                }
            })

            return hasMovie;
        }

        function checkMovie(list, movieID) {
            
            if (list.length == 0) {

                return false;

            } else {

                var status = false;

                angular.forEach(list, function(value){
                    
                    if (value.id === movieID) {

                        status = true;
                    }
                })

                return status;
            }
        }

        function successMoviesUser(movies){

            service.collection.push(movies[0]);
            
            $rootScope.movies = service.collection;
        }

        function successSave(){
            
            localStorage.setItem('user', JSON.stringify(service.user));
        }

        function error(error) {
            
            messagesFactory.message('Error', error);
        }
    }

})();