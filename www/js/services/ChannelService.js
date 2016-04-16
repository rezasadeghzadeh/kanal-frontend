app.service('ChannelService', function ($http,CONFIG,$q) {

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

    function saveNewChannel(name,title,type,desc,imageUrl) {
        return $http.post(CONFIG.baseAddress + '/channels/saveNewChannel', {
            name: name,
            title:title,
            channelType: type,
            description: desc,
            imageUrl:imageUrl,
        });
    };


    function testFunc(){
        alert("Called testFunc in channelService");
        return 1;
    }

    function getChannelPosts(channelId){
        return $q(function(resolve, reject){
                $http.get(CONFIG.baseAddress + "/channelPosts?channelId=" + channelId).then(function(res){
                    resolve(res);
                },function(err){
                    console.log(JSON.stringify(err));
                    reject(err);
                })
            })
    }

    function postTextMessage(channelId,text){
        return $q(function(resolve,reject){
            $http.post(CONFIG.baseAddress + "/channelPosts/postTextMessage",{
                channelId: channelId,
                text: text
            }).then(function(res){
                resolve(res);
            },function(err){
                alert("error in service");
                reject(err);
            });
        });
    }
    return {
        getChannels: getChannels,
        isChannelNameUnique: isChannelNameUnique,
        saveNewChannel: saveNewChannel,
        testF : testFunc,
        getChannelPosts :getChannelPosts,
        postTextMessage : postTextMessage
    }
});
