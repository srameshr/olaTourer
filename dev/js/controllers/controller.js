var OlaTourerController = angular.module('OlaTourerController', []);

OlaTourerController.controller('SignUpController', function($scope, $mdToast, $state, $cordovaFacebook, $cordovaGooglePlus, $ionicLoading, LocalStorageService){
  /*
   * Learn how facebooks graph api works: https://developers.facebook.com/docs/graph-api/quickstart/v2.2
   * The array params "public_profile", "email", "user_friends" are the permissions / data that the app is trying to access.
  */

  $scope.toastPosition = {
    bottom: true,
    top: false,
    left: true,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };
  $scope.fbLogin = function(){

    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
    .then(function(success) {
      /*       * Get user data here. 
       * For more, explore the graph api explorer here: https://developers.facebook.com/tools/explorer/
       * "me" refers to the user who logged in. Dont confuse it as some hardcoded string variable. 
       * 
      */
      //To know more available fields go to https://developers.facebook.com/tools/explorer/
      $cordovaFacebook.api("me?fields=id,name,picture", [])
      .then(function(result){
        /*
         * As an example, we are fetching the user id, user name, and the users profile picture
         * and assiging it to an object and then we are logging the response.
        */
        var userData = {
          id: result.id,
          name: result.name,
          pic: result.picture.data.url
        }
        var toast = $mdToast.simple()
        .content('YOU HAVE BEEN SIGNED IN')
        .action('')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
        LocalStorageService.set('isSignedIn', true);
        $state.go('home');
        //Do what you wish to do with user data. Here we are just displaying it in the view
        

      }, function(error){
        // Error message
        var toast = $mdToast.simple()
        .content(err)
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
      })
      
    }, function (error) {
      // Facebook returns error message due to which login was cancelled.
      // Depending on your platform show the message inside the appropriate UI widget
      // For example, show the error message inside a toast notification on Android
      var toast = $mdToast.simple()
        .content(err)
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
    });

  }

  /*
   * Google login
  */

  $scope.googleLogin = function(){

     $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      })
    /*
     * Google login. This requires an API key if the platform is "IOS".
     * Example: $cordovaGooglePlus.login('yourApiKey')
    */
    $cordovaGooglePlus.login()
    .then(function(data){
      LocalStorageService.set('isSignedIn', true);
      var toast = $mdToast.simple()
        .content('YOU HAVE BEEN SIGNED IN')
        .action('')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
      $state.go('home');
      $ionicLoading.hide();

    }, function(error){
      
      // Google returns error message due to which login was cancelled.
      // Depending on your platform show the message inside the appropriate UI widget
      // For example, show the error message inside a toast notification on Android
      var toast = $mdToast.simple()
        .content('COULD NOT SIGN IN. '+error)
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
      $ionicLoading.hide();

    });
  }
})


OlaTourerController.controller('DestController', function($scope, $timeout, $mdToast, $state, SessionStorageService, LocalStorageService){

  $scope.toastPosition = {
    bottom: true,
    top: false,
    left: true,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $scope.$on('$ionicView.enter', function(){
    $scope.scaleOut = false;
    $scope.selectedPlaces = JSON.parse(LocalStorageService.get('savedTrips'));
  })

  $scope.itiDetails = function(place){
    $state.go('itinerary',{'itineraryName':JSON.stringify(place)})
    console.log(place)
  }
  
  $scope.trips = LocalStorageService.get('savedTrips');

  $scope.submitData = function(dest, validity){
    if(validity){
      var master = angular.copy(dest);
      try{
        $scope.scaleOut = true;
        SessionStorageService.set('lat', master.place.geometry.bounds.Ca.k);
        SessionStorageService.set('lng', master.place.geometry.bounds.va.j);
        SessionStorageService.set('place', master.place.formatted_address);
        $timeout(function(){
          $state.go('pickPlaces');
        }, 500);
      }catch(err){
        var toast = $mdToast.simple()
           .content('SOMETHING WENT WRONG! TRY AGAIN')
           .action('OK')
           .highlightAction(false)
           .position($scope.getToastPosition());
          $mdToast.show(toast).then(function() {
            return;
        });
      }
    }
    else{
       var toast = $mdToast.simple()
           .content('PLACE IS REQUIRED')
           .action('OK')
           .highlightAction(false)
           .position($scope.getToastPosition());
          $mdToast.show(toast).then(function() {
          return;
        });
    } 
  }
});

OlaTourerController.controller('PlacesController', 
  function($scope, $mdToast, $mdBottomSheet, $state, PlacesService, SessionStorageService, cityData, shoppingData, foodData, nightLifeData, ShareService){
  
  $scope.toastPosition = {
    bottom: true,
    top: false,
    left: true,
    right: true
  };

  $scope.place = SessionStorageService.get("place");

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $scope.moreDataCanBeLoaded = true;

  $scope.cityPaginateData = cityData.next_page_token;
  $scope.shoppingPaginateData = shoppingData.next_page_token;
  $scope.foodPaginateData = foodData.next_page_token;
  $scope.nightPaginateData = nightLifeData.next_page_token;

  $scope.relaxList = [];
  $scope.emeList = [];
  $scope.cityPlacesList = [];
  $scope.shoppingList = [];
  $scope.foodList = [];
  $scope.nightLifeList = [];

  $scope.cityPlacesList = cityData.results;
  $scope.shoppingList = shoppingData.results;
  $scope.foodList = foodData.results;
  $scope.nightLifeList = nightLifeData.results;



  $scope.loadMore = function(plc, paginateData, type) {
   console.log(type)
   PlacesService.getPlaces(plc, paginateData).then(function(data){
      if(type == 'city'){
        $scope.cityPlacesList = $scope.cityPlacesList.concat(data.results);
        $scope.cityPaginateData = data.next_page_token;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
      else if(type == 'shop'){
        $scope.shoppingList = $scope.shoppingList.concat(data.results);
        $scope.shoppingPaginateData = data.next_page_token;
      }
  
      }, function(err){

      });
  };

  $scope.plcToRelax = function(places){
    PlacesService.getPlaces(places).then(function(data){
      $scope.relaxList = data.results;
    });
  }

  $scope.emePlc = function(places){
    PlacesService.getPlaces(places).then(function(data){
      $scope.emeList = data.results;
    });
  }

  $scope.submitCheckedItems = function(){
    
    var tempArray = new Array();
    tempArray = tempArray.concat($scope.cityPlacesList, $scope.shoppingList, $scope.foodList, $scope.nightLifeList, $scope.relaxList, $scope.emeList);
    
    var selectedPlaces = PlacesService.checkCat(tempArray);
    
    SessionStorageService.setObject("selectedPlaces",selectedPlaces);
    
    if(selectedPlaces.length>0){
      if(selectedPlaces.length>8){
        var toast = $mdToast.simple()
          .content("MAX OF 8 PLACES PER TRIP!")
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition());
          $mdToast.show(toast).then(function() {
            return;
        });
      }
      else{
        $state.go("showMap");
      }      
    }

    else{
      var toast = $mdToast.simple()
        .content('SELECT AT LEAST ONE')
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function() {
          return;
        });
    }
  }


  $scope.showShareSheet = function($event) {
      $mdBottomSheet.show({
        templateUrl: 'templates/share.html',
        controller: 'ShareBottomSheetCtrl',
        targetEvent: $event
      }).then(function() {
      });
    };
});

OlaTourerController.controller('ShareBottomSheetCtrl', function($scope, $mdBottomSheet, ShareService, SessionStorageService) {
  
  $scope.sharePlatforms = [
    { name: 'Hangouts', icon: 'hangouts', platform: "hangouts" },
    { name: 'Facebook', icon: 'facebook', platform: "facebook"},
    { name: 'Twitter', icon: 'twitter', platform: "twitter" },
    { name: 'WhatsApp', icon: 'whatsapp', platform: "whatsapp" },
    { name: 'Cancel', icon: 'cancel', platform: "cancel" }
  ];
 $scope.share = function(e){
  $mdBottomSheet.hide();
  var tourLoc = SessionStorageService.get('place');
    switch(e){
      case 'facebook':
        ShareService.shareViaFB('Hey! Suggest me some awesome places to visit on my trip to '+ tourLoc);
      break;
      case 'whatsapp':
        ShareService.shareViaWhatsApp('Hey! Suggest me some awesome places to visit on my trip to '+ tourLoc);
      break;
      case 'hangouts':
        ShareService.shareViaHangouts('Hey! Suggest me some awesome places to visit on my trip to '+ tourLoc);
      break;
      case 'twitter': 
        ShareService.shareViaTwitter('Hey! Suggest me some awesome places to visit on my trip to '+ tourLoc);
      break;
      default:
        $mdBottomSheet.hide();
      break;
    }
  }
})

OlaTourerController.controller('ShowMapController', function($scope, SessionStorageService, $stateParams, $mdDialog,
  $mdToast, $state, $ionicLoading, $timeout, LocalStorageService, $timeout){
  
  $ionicLoading.show({
    template: '<ion-spinner icon="android"></ion-spinner>'
  });

  $scope.showAnim = false;
  $scope.places = SessionStorageService.getObject("selectedPlaces");
  $scope.selectedPlaces = JSON.parse(SessionStorageService.get('selectedPlaces'));
  $scope.hasTripName = false;
    $scope.toastPosition = {
       bottom: true,
       top: false,
       left: true,
       right: true
      };

       $scope.getToastPosition = function() {
         return Object.keys($scope.toastPosition)
           .filter(function(pos) { return $scope.toastPosition[pos]; })
           .join(' ');
       };

  $scope.startpoint = [];
  $scope.endpoint = [];
  $scope.waypoints = [];
  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;

  function createMarker(latlng,icon) {
      var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: icon
      });
  }

  function calcRoute() {
      var waypts = [];
      var places = new Array();
      for (var i = 0; i < $scope.places.length; i++) {
        places.push($scope.places[i].location)
      };
      for (var i = 0; i < places.length; i++) {
        stop = new google.maps.LatLng(places[i].lat, places[i].lng)
        if(i!=0 && i!=places.length-1){
          createMarker(stop,"img/mid.png");
        }
        waypts.push({
            location: stop,
            stopover: true
        });
      };
      
      start = new google.maps.LatLng($scope.places[0].location.lat,$scope.places[0].location.lng);
      end = new google.maps.LatLng($scope.places[$scope.places.length-1].location.lat,$scope.places[$scope.places.length-1].location.lng);
      
      createMarker(start,"img/start.png");
      createMarker(end,"img/start.png");
      
      var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      $scope.distance = 0;
      $scope.traveltime = 0;
      $scope.cost = 0;

      directionsService.route(request, function (response, status) {

          if (status == google.maps.DirectionsStatus.OK) {
            SessionStorageService.setObject("routeOrder", response.routes[0].waypoint_order)
            for (var i = 0; i < response.routes[0].legs.length; i++) {
              $scope.distance += response.routes[0].legs[i].distance.value;
              $scope.traveltime += response.routes[0].legs[i].duration.value;             
            };
            console.log(response);
            $scope.distance = ($scope.distance/1000).toFixed(1);
            $scope.traveltime = ($scope.traveltime/60).toFixed(1);
            
            $scope.$apply();
              directionsDisplay.setDirections(response);
              var route = response.routes[0];
          }
          else{
            var toast = $mdToast.simple()
              .content("maximum of 8 places")
              .action('OK')
              .highlightAction(false)
              .position($scope.getToastPosition());
              $mdToast.show(toast).then(function() {
                return;
            });
          }
      });
  }
  
  function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true
      });
      var myOptions = {
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
      map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
      directionsDisplay.setMap(map);
      calcRoute();
  }


  $scope.$on('$ionicView.enter', function(){
    $timeout(function(){
      if($scope.places && $scope.places.length>0){
        initialize();
      }
      else{
        var toast = $mdToast.simple()
          .content("SOMETHING WENT WRONG! TRY AGAIN")
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition());
          $mdToast.show(toast).then(function() {
            return;
        });
      }
      $ionicLoading.hide();
    }, 1500)
  })

 $scope.save = function(tripName){
   $scope.hasTripName = true;
    var routeOrder = JSON.parse(SessionStorageService.get("routeOrder"));
    var place = SessionStorageService.get("place");
    var routeplaces = new Array();
    for (var i = 0; i < routeOrder.length; i++) {
      routeplaces.push($scope.places[routeOrder[i]]);
    };
    var temp = {
      name : tripName || 'My Trip To '+place,
      main : place,
      plc  : routeplaces
    }
    var tempPlaces = LocalStorageService.getObject('savedTrips');
    tempPlaces.unshift(temp);
    LocalStorageService.setObject('savedTrips', tempPlaces)
    $timeout(function(){
      $scope.showAnim = true;
    }, 500);
 }

});

OlaTourerController.controller('ItineraryDetailsController', function($scope, $mdBottomSheet, $stateParams){
 $scope.$on('$ionicView.enter', function(){
  $scope.itiDet = JSON.parse($stateParams.itineraryName);
 })

 $scope.showShareSheet = function($event) {
      $mdBottomSheet.show({
        templateUrl: 'templates/share.html',
        controller: 'ShareBottomSheetCtrl',
        targetEvent: $event
      }).then(function() {
      });
    };
})