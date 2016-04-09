app.service('ChannelService', function ($http,CONFIG) {

    function getChannels() {
        return $http.get(CONFIG.baseAddress + '/channels/list');
    };

    function isChannelNameUnique(channelName) {
        return $http.get( CONFIG.baseAddress + "/channels/alreadyExistsChannelName?name=" + channelName).then(function (response) {
            return response.data;
        }, function () {
            return -1;
        })
    };

    function saveNewChannel(name,title,type,desc) {
        return $http.post(CONFIG.baseAddress + '/channels/saveNewChannel', {
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
});
