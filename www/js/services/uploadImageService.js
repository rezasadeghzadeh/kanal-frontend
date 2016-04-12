app.service('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile, $cordovaFileTransfer,CONFIG,AuthService) {
 
  function makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
 
  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
  }
 
  function saveMedia(type) {

    return $q(function(resolve, reject) {
      var options = optionsForType(type);

      $cordovaCamera.getPicture(options).then(function(imageUrl) {
        console.log("Selected Image in uploadImgaeServuice: " +imageUrl);
        var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        options.headers = {'X-Auth-Token':AuthService.authToken()};
        $cordovaFileTransfer.upload(CONFIG.baseAddress + "/file/upload", imageUrl, options).then(function (result) {
            var json = JSON.parse(result.response );
            resolve(json.FileName);
        }, function (err) {
          console.log("ERROR: " + JSON.stringify(err));
          reject(err);
        }, function (progress) {

        });

      });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }
});
