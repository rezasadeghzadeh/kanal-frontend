app.controller("ChannelsCtrl", function ($state, $scope, $cordovaFileTransfer, $ionicActionSheet, ionicToast, ImageService, ChannelService,CONFIG) {
    $scope.channel = {};
    $scope.chooseUploadPhotoMethod = function () {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                {text: 'From Camera'},
                {text: 'From Gallery'}
            ],
            titleText: 'Add images',
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                $scope.addImage(index);
            }
        });


        $scope.addImage = function (type) {
            $scope.hideSheet();
            ImageService.handleMediaDialog(type).then(function (imageUrl) {
                $scope.channel.imageUrl  =  imageUrl;
            }),function(error){
                console.log("ChannelCrtl error : " + error);
            };
        }
    };


    $scope.isChannelNameUnique = function () {
        var channelName = $scope.channel.name;
        if (channelName.length > 3) {
            ChannelService.isChannelNameUnique(channelName).then(function (response) {
                if (response == 0 ) {
                    $scope.channelNameStatusIconClass = 'icon ion-checkmark-round balanced';
                    $scope.channelNameAlreadyExistsMsg="";
                }else if(response == -1){
                    $scope.channelNameStatusIconClass = 'icon ion-close-circled assertive';
                    $scope.channelNameAlreadyExistsMsg  =  "خطا در اتصال به سرور";
                } else {
                    $scope.channelNameStatusIconClass = 'icon ion-close-circled assertive';
                    $scope.channelNameAlreadyExistsMsg  = "آدرس کانال قبلا ثبت شده است";
                }
            });
        }else{
            $scope.channelNameStatusIconClass = 'icon ion-close-circled assertive';
        }

    };

    $scope.saveNewChannel  = function(){
        ChannelService.saveNewChannel($scope.channel.name,$scope.channel.title,$scope.channel.type,$scope.channel.desc,$scope.channel.imageUrl).then(function(response){
            if (response.data == 1 ) {
                var message = 'کانال با موفقیت ذخیره شد';
                $scope.showToast(message,'bottom',false,4000);
                $state.go("app.home");
            }else{
                var message = 'خطا در ذخیره سازی کانال جدید';
                $scope.showToast(message,'bottom',false,4000);
            }
        }),function(error){
            $scope.message = 'خطا در ذخیره سازی کانال جدید';
        };
    };

    $scope.testFunc = function(){
        result  = ChannelService.testF();
        alert(result);
    }

    $scope.showToast = function(message, location,stick,time) {
        ionicToast.show(message, location, stick, time);
    }

});