app.factory('ChannelService', ['$http', function ($http) {

    function getChannels() {
        return $http.get('http://localhost:8080/channels/list');
    };

    function isChannelNameUnique(channelName) {
        return $http.get("http://localhost:8080/channels/alreadyExistsChannelName?name=" + channelName).then(function (response) {
            return response.data;
        }, function () {
            return -1;
        })
    };

    function saveNewChannel(name,title,type,desc) {
        return $http.post('http://localhost:8080/channels/saveNewChannel', {
            name: name,
            title:title,
            channelType: type,
            description: desc
        });
    };


    function testFunc(){
        alert("Called testFunc in channelService");
        return 1;
    }

    return {
        getChannels: getChannels,
        isChannelNameUnique: isChannelNameUnique,
        saveNewChannel: saveNewChannel,
        testF : testFunc
    }
}]);
