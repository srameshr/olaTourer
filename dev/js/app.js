// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var tourer = angular.module('tourer', [
	'ionic', 
	'ngMaterial',
	'ngCordova',
	'ion-google-place',
	'OlaTourerController',
	'UtilityService',
	'OlaTourerService'
]);


tourer.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider){

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');

	$stateProvider

	.state('appSignIn', {
  		url: "/signIn",
  		templateUrl: "templates/signIn.html",
  		controller: "SignUpController"
  	})

	.state('home', {
		url: '/home',
		templateUrl: 'templates/home.html',
    	controller: 'DestController'
	})

	.state('itinerary', {
		url: '/itinerary/:itineraryName',
		templateUrl: 'templates/itinerary.html',
		controller: 'ItineraryDetailsController'
	})

	.state('pickPlaces', {
    url: '/pickPlaces',
    templateUrl: 'templates/pickPlaces.html',
    controller: 'PlacesController',
    resolve : {
    	cityData : function(PlacesService){
        return PlacesService.getPlaces('amusement_park|park|aquarium|art_gallery|bowling_alley|hindu_temple|church|museum|painter|zoo|mosque');
    	},
    	shoppingData: function(PlacesService){
    		return PlacesService.getPlaces('shopping_mall|jewelry_store|clothing_store|shoe_store|home_goods_store|furniture_store|florist|electronics_store');
    	},
    	foodData: function(PlacesService){
    		return PlacesService.getPlaces('food|restaurant|meal_delivery|meal_takeaway|cafe|bakery');
    	},
    	nightLifeData: function(PlacesService){
    		return PlacesService.getPlaces('bar|casino|night_club|liquor_store');
    	}
  	}
  })

  .state('showMap', {
    url: "/showmap",
    templateUrl: "templates/showMap.html",
    controller: "ShowMapController"    
  })

  if(window.localStorage.isSignedIn == undefined || window.localStorage.isSignedIn == null){
  	$urlRouterProvider.otherwise('/signIn');
  }
  else{
  	$urlRouterProvider.otherwise('/home');
  }
	

});

tourer.run(function($ionicPlatform, $rootScope, $ionicHistory, LocalStorageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.goBack = function(){
      $ionicHistory.goBack();
    }

    if(LocalStorageService.getObject('savedTrips') == null){
      LocalStorageService.setObject('savedTrips', []);
    }


  });
})
