app.controller("ChannelsCtrl", function ($scope, $cordovaFileTransfer, $ionicActionSheet, ionicToast, ImageService, ChannelService) {
    $scope.channel = {};
    $scope.upload = function () {
        var options = {
            fileKey: "avatar",
            fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png"
        };

        $cordovaFileTransfer.upload("http://127.0.0.1:8080/file/upload", "/home/reza/Pictures/image_013.jpeg", options).then(function (result) {
            alert(JSON.stringify(result.response));
            console.log("SUCCESS: " + JSON.stringify(result.response));
        }, function (err) {
            console.log("ERROR: " + JSON.stringify(err));
            alert(JSON.stringify(err));
        }, function (progress) {

            // constant progress updates
        });
    };

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
            ImageService.handleMediaDialog(type).then(function () {
                $scope.$apply();
            });
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
        ChannelService.saveNewChannel($scope.channel.name,$scope.channel.title,$scope.channel.type,$scope.channel.desc).then(function(response){
            if (response.data == 1 ) {
                var message = 'کانال با موفقیت ذخیره شد';
                $scope.showToast(message,'bottom',false,4000);

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