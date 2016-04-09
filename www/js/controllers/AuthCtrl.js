app.controller("AuthCtrl", function ($scope,$state, $ionicPopup,ionicToast, AuthService,CONFIG) {
    var LOCAL_TOKEN_KEY = 'LOCAL_TOKEN_KEY';
    $scope.CONFIG  =  CONFIG;
    $scope.data  = {};

    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };

    $scope.verifiySmsText = function(data){
        $state.go('app.home');
    }

    $scope.updateUserInfo = function () {
        AuthService.updateUserInfo($state.params.mobileNumber,$scope.data.email,$scope.data.firstName,$scope.data.lastName).then(function(res){
            AuthService.storeUserCredentials($state.params.mobileNumber + "." + res.data);

            ionicToast.show("Info saved successfully", "bottom", false, 3000);
            $state.go('app.home');
        },function(error){
            alert("error " + error);
            var alertPopup = $ionicPopup.alert({
                title :'Error',
                template : 'There was a problem on updating user info,Please try again!'
            });

        });

    }

    $scope.sendSmsVerification = function(){
        AuthService.sendSmsVerification($scope.data.mobileNumber).then(function(response){
            $state.go('app.enterSmsText',{mobileNumber: $scope.data.mobileNumber});
        },function(error){
            alert(JSON.stringify(error));
            var alertPopup = $ionicPopup.alert({
                title :'Error',
                template : 'There was a problem on sending verfification sms,Please try again!'
            });
        });
    }

    $scope.verifySentSms = function () {
        AuthService.verifySentSms($state.params.mobileNumber,$scope.data.smsText).then(function(response){
            if(response.data == 1){
                $state.go('app.enterUserInfo',{mobileNumber : $state.params.mobileNumber});
            }else{
                var alertPopup = $ionicPopup.alert({
                    title :'Error',
                    template : 'The entered text not match with sent sms'
                });
            }
        },function(error){
            var alertPopup = $ionicPopup.alert({
                title :'Error',
                template : 'There was a problem on verifying sms,Please try again!'
            });
        });
    }

    $scope.isAuthenticated = function(){
        return AuthService.isAuthenticated();
    }
});
