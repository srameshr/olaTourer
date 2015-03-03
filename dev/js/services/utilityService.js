var UtilityService = angular.module("UtilityService", []);

UtilityService.service('LocalStorageService', ['$window', '$q',
    function($window, $q) {

        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || null);
            }
        }

    }
]);

UtilityService.service('SessionStorageService', ['$window', '$q',
    function($window, $q) {

        return {

            set: function(key, value) {
                $window.sessionStorage.setItem(key, value);
            },

            get: function(key) {
                return $window.sessionStorage.getItem(key) || false;
            },
            setObject: function(key, value) {
                $window.sessionStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.sessionStorage[key] || '{}');
            }
        }
    }
]);

UtilityService.service('ConnectionService', [
    function() {

        return {

            connectionStatus: function() {

                /*var networkState = navigator.connection.type;

                if(networkState == "wifi"){
                    return true;
                }

                else if(networkState == "cellular"){
                    return true;
                }

                else if(networkState == "4g"){
                    return true;
                }

                else if(networkState == "3g"){
                    return true;
                }

                else if(networkState == "2g"){
                    return true;
                }

                else if(networkState == "unknown"){
                    return true;
                }

                else if(networkState == "ethernet"){
                    return true;
                }

                else{
                    return false;
                }*/
                return true;

             
        
            }

        }
    }
]);

UtilityService.service('RemoteDataService', ['$http', '$ionicLoading', '$q', '$state','ConnectionService', '$mdToast',
    function($http, $ionicLoading, $q, $state, ConnectionService, $mdToast) {

        return {

            fetchData: function(remoteDataPath, cacheValue, hasPagination) {

                if(ConnectionService.connectionStatus()){
                    if(hasPagination == undefined){
                        hasPagination = false;
                    }
                    if(hasPagination){
                        $ionicLoading.hide();
                    }
                    else{
                        $ionicLoading.show({
                            template: '<ion-spinner icon="android"></ion-spinner>'
                        })
                    }
                    var deferred = $q.defer();
                    console.log(remoteDataPath)
                    $http.get(remoteDataPath, {
                        cache: cacheValue || false
                    }).then(
                        function(resp) {
                            $ionicLoading.hide();
                            console.log(resp.data);
                            deferred.resolve(resp.data)
                            
                        },
                        function(err) {
                            var toastPosition = {
                               bottom: true,
                               top: false,
                               left: true,
                               right: true
                            };

                           var getToastPosition = function() {
                             return Object.keys(toastPosition)
                               .filter(function(pos) { return toastPosition[pos]; })
                               .join(' ');
                           };

                            var toast = $mdToast.simple()
                               .content('SOMETHING WENT WRONG')
                               .action(':-(')
                               .highlightAction(false)
                               .position(getToastPosition());
                              $mdToast.show(toast).then(function() {
                                return;
                            });

                            $ionicLoading.hide();
                            
                            console.log(err.status);
                            deferred.reject(err);
                        }
                    )
                    return deferred.promise;
                }
                else{
                    var toastPosition = {
                               bottom: true,
                               top: false,
                               left: true,
                               right: true
                            };

                           var getToastPosition = function() {
                             return Object.keys(toastPosition)
                               .filter(function(pos) { return toastPosition[pos]; })
                               .join(' ');
                           };

                            var toast = $mdToast.simple()
                               .content('CONNECTION ERROR')
                               .action(':-(')
                               .highlightAction(false)
                               .position(getToastPosition());
                              $mdToast.show(toast).then(function() {
                                return;
                            });
                }
            }
        };

    }
]);



UtilityService.service('ShareService', [
    function() {

        return {

            shareViaFB: function(shareMessage, shareLink) {
                window.plugins.socialsharing.shareViaFacebook(
                    shareMessage,
                    null /* img */ ,
                    shareLink,
                    function(msg) {
                        
                    },
                    function(msg) {
                        
                    }
                );
            },

            shareViaTwitter: function(shareMessage, shareLink) {
                window.plugins.socialsharing.shareViaTwitter(
                    shareMessage,
                    null /* img */ ,
                    shareLink,
                    function(msg) {
                        
                    },
                    function(msg) {
                        
                    }
                );
            },

            shareViaWhatsApp: function(shareMessage, shareLink) {
                window.plugins.socialsharing.shareViaWhatsApp(
                    shareMessage,
                    null /* img */ ,
                    shareLink,
                    function(msg) {
                       
                    },
                    function(msg) {
                        
                    }
                );
            },

            shareViaHangouts: function(shareMessage, shareLink) {
                window.plugins.socialsharing.shareViaSMS(
                    shareMessage,
                    '',
                    function(msg) {
                        
                    },
                    function(msg) {
                        
                    }
                );
            }
        }
    }
]);