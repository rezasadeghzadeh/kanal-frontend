app.controller('HomeCtrl',['ChannelService','$scope', function (ChannelService,$scope) {
  	ChannelService.getChannels().then(function(response){ 
            $scope.channels  = response;
        });
}]);


app.controller('UploadCtrl', function($scope, Upload){

	$scope.uploadFile = function() {

		Upload.fileTo("http://127.0.0.1/channels/new").then(
			function(res) {
				alert(res);
			}, function(err) {
				alert(err);
			})
		;

	};

});
