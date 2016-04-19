app.controller("ChannelsCtrl", function ($state, $scope, $cordovaFileTransfer, $ionicActionSheet
    , ionicToast, ImageService, ChannelService,CONFIG, $stateParams, $ionicScrollDelegate, $ionicLoading,$timeout) {
    $scope.channelId= $stateParams.channelId;
    $scope.channel = {};
    $scope.posts = [];
    $scope.doneLoading = false;
    var viewScroll;
    var footerBar;
    var scroller;
    var txtInput;

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
                    $scope.channelNameAlreadyExistsMsg  = "Error in Connecting to Server"
                } else {
                    $scope.channelNameStatusIconClass = 'icon ion-close-circled assertive';
                    $scope.channelNameAlreadyExistsMsg  = "Sorry, Channel Name Already Exist!"
                }
            });
        }else{
            $scope.channelNameStatusIconClass = 'icon ion-close-circled assertive';
        }

    };

    $scope.saveNewChannel  = function(){
        ChannelService.saveNewChannel($scope.channel.name,$scope.channel.title,$scope.channel.type,$scope.channel.desc,$scope.channel.imageUrl).then(function(response){
            if (response.data == 1 ) {
                var message = "Channel Added Successfully";
                $scope.showToast(message,'bottom',false,4000);
                $state.go("app.home");
            }else{
                var message = "Error in Saving Channel";
                $scope.showToast(message,'bottom',false,4000);
            }
        }),function(error){
            $scope.message =  "Error in Saving Channel";
        };
    };

    $scope.initShowChannelPostsForm = function(){
        viewScroll = $ionicScrollDelegate.$getByHandle('postScroll');
        footerBar = document.body.querySelector('#channelPostsView .bar-footer');
        scroller = document.body.querySelector('#channelPostsView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));


        channelId = $stateParams.channelId;
        ChannelService.getChannelPosts(channelId).then(function(res){
            if(res.data  != null){
                $scope.posts = res.data;
                viewScroll.scrollBottom(true);
            }
        },function(err){
            alert(JSON.stringify(err));
        });

    }

    $scope.showToast = function(message, location,stick,time) {
        ionicToast.show(message, location, stick, time);
    }

    function keepKeyboardOpen() {
        console.log('keepKeyboardOpen');
        txtInput.one('blur', function () {
            txtInput[0].focus();
        });
    }

    $scope.sendTextPost  = function(){
        keepKeyboardOpen();
        var post= {
                ChannelId : $scope.channelId,
                Text : $scope.postText,
                Date : new Date()
        }

        $scope.postText = '';
        $scope.posts.push(post);
        $timeout(function() {
            keepKeyboardOpen();
            viewScroll.scrollBottom(true);
        }, 0);

        ChannelService.postTextMessage(post.ChannelId,post.Text).then(function(res){
            console.log(res.data);
        },function(err){
            alert("Error in Controller" + JSON.stringify(err));
            console.log(JSON.stringify(err));
        });
    }

    $scope.$on('taResize', function(e, ta) {
        console.log('taResize');
        if (!ta) return;

        var taHeight = ta[0].offsetHeight;
        console.log('taHeight: ' + taHeight);

        if (!footerBar) return;

        var newFooterHeight = taHeight + 10;
        newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

        footerBar.style.height = newFooterHeight + 'px';
        scroller.style.bottom = newFooterHeight + 'px';
    });

    $scope.onMessageHold = function(e, itemIndex, message) {
        console.log('onMessageHold');
        console.log('message: ' + JSON.stringify(message, null, 2));
        $ionicActionSheet.show({
            buttons: [{
                text: 'Copy Text'
            }, {
                text: 'Delete Message'
            }],
            buttonClicked: function(index) {
                switch (index) {
                    case 0: // Copy Text
                        //cordova.plugins.clipboard.copy(message.text);

                        break;
                    case 1: // Delete
                        // no server side secrets here :~)
                        $scope.messages.splice(itemIndex, 1);
                        $timeout(function() {
                            viewScroll.resize();
                        }, 0);

                        break;
                }

                return true;
            }
        });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(msg) {
        if (msg.userId === $scope.user._id) {
            // go to your profile
        } else {
            // go to other users profile
        }
    };



});