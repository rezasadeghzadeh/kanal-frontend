app.controller('HomeCtrl', function (ChannelService, $scope, $state, $ionicPopup, AuthService, AUTH_EVENTS,CONFIG) {
    $scope.CONFIG  = CONFIG;

    $scope.loadChannelsList = function(){
        ChannelService.getChannels().then(function (response) {
            $scope.channels = response.data;
        },function(error){
        });
    };


    $scope.mobileNumber = AuthService.mobileNumber();
    //show message when the response has error
    //events triggered by interceptor by AuthInterceptor

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
    });

    $scope.setCurrentMobileNumber = function(mobileNumber) {
        $scope.mobileNumber = mobileNumber;
    };

    //call after load
    $scope.loadChannelsList();

});

app.controller('UploadCtrl', function ($scope, Upload) {

    $scope.uploadFile = function () {

        Upload.fileTo("http://127.0.0.1/channels/new").then(
            function (res) {
                alert(res);
            }, function (err) {
                alert(err);
            })
        ;

    };

});
