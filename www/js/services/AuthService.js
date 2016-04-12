    app.service('AuthService', function($q, $http, USER_ROLES,CONFIG) {
        var LOCAL_TOKEN_KEY = 'LOCAL_TOKEN_KEY';
        var mobileNumber = '';
        var isAuthenticated = false;
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            mobileNumber = token.split('.')[0];
            isAuthenticated = true;
            authToken = token;

            // Set the token as header for requests!
            $http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            mobileNumber = '';
            isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var logout = function() {
            destroyUserCredentials();
        };

        function sendSmsVerification(mobileNumber){
            return $http({
                url: CONFIG.baseAddress + '/smsVerification/send',
                method: "GET",
                params: {mobileNumber: mobileNumber}
            });
        }

        function verifySentSms(mobileNumber,enteredText){
            return $http({
                url: CONFIG.baseAddress + "/smsVerification/verify",
                method: "GET",
                params: {mobileNumber: mobileNumber,enteredText : enteredText}
            });
        }

        function updateUserInfo( mobileNumber, email, firstName,lastName){
            req = $http({
                url :CONFIG.baseAddress + "/user/updateAndGetToken",
                method: "GET",
                params: {mobileNumber: mobileNumber,firstName: firstName, lastName: lastName, email : email}
            });
            return req;
        }

        loadUserCredentials();

        return {
            logout: logout,
            isAuthenticated: function() {return isAuthenticated;},
            mobileNumber: function() {return mobileNumber;},
            sendSmsVerification : sendSmsVerification,
            verifySentSms : verifySentSms,
            updateUserInfo : updateUserInfo,
            storeUserCredentials: storeUserCredentials,
            authToken : function(){return authToken}
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });