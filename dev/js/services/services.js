var OlaTourerService = angular.module('OlaTourerService', []);

OlaTourerService.service('PlacesService', function(RemoteDataService, SessionStorageService){
	return {
		
		getPlaces: function(placeType, nextPageToken){
			var hasPagination = false;
			var lat = SessionStorageService.get('lat');
			var lng = SessionStorageService.get('lng');
			var main = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
			var loc = '?location='+lat+','+lng;
			var radius = '&radius=25000';
			var type = '&types='+placeType;
			var key = '&key=AIzaSyDihU55FoIQUvAWR9sDGz4hzL6OblAHUu8';
			if(nextPageToken != undefined){
				var token = '&&pagetoken='+nextPageToken;
				var url = main.concat(loc,radius,type,key,token);
				hasPagination = true;
			}
			else if(nextPageToken == undefined) {
				url = main.concat(loc,radius,type,key)
			}

			return RemoteDataService.fetchData(url, true, hasPagination);
		},

		checkCat : function(categoryList){
			
			var selectedPlaces = new Array();
			var selectedCat = categoryList;
			selectedCat.forEach(function(item, index, array){
				if(item.checked){
					selectedPlaces.push({
						"name": item.name,
						"location": item.geometry.location,
						"id": item.id,
						"place_id": item.place_id,
						"area":item.vicinity
					});					
				}
			});
							
			return selectedPlaces;
			
		}
	}
});