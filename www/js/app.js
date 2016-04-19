// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'ngCordova', 'ngMessages', 'ionic-toast','angularMoment', 'monospaced.elastic']);
app.filter('debug', function () {
    return function (input) {
        if (input === '') return 'empty string';
        return input ? input : ('' + input);
    };
});


app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: '/home',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl',
                }
            },
            onEnter: function ($state, AuthService, $ionicSideMenuDelegate) {
                if (!AuthService.isAuthenticated()) {
                    $ionicSideMenuDelegate.canDragContent(false);
                    $state.go('app.login');
                }
            }
        })

        .state('app.newChannel', {
            url: '/newChannel',
            views: {
                'menuContent': {
                    templateUrl: 'templates/newChannel.html',
                    controller: 'ChannelsCtrl',
                }
            }

        })

        .state('app.newChannelItem', {
            url: '/newChannelItem',
            views: {
                'menuContent': {
                    templateUrl: 'templates/newChannelItem.html',
                    controller: 'ChannelsCtrl',
                }
            }
        })

        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html',
                    controller: 'AuthCtrl',
                }
            }

        })

        .state('app.enterSmsText', {
            url: '/enterSmsText/:mobileNumber',
            views: {
                'menuContent': {
                    templateUrl: 'templates/enterSmsText.html',
                    controller: 'AuthCtrl',
                }
            }
        })

        .state('app.enterUserInfo', {
            url: '/enterUserInfo/:mobileNumber',
            views: {
                'menuContent': {
                    templateUrl: 'templates/enterUserInfo.html',
                    controller: 'AuthCtrl',
                }
            }
        })

        .state('app.channelPosts', {
            url: '/channelPosts/:channelId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/channelItems.html',
                    controller: 'ChannelsCtrl',
                }
            }
        })






    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/app/home");
    /*
     $urlRouterProvider.otherwise(function($injector, $location){
     var $state = $injector.get("$state");
     $state.go('app.home');
     });
     */


});

// configure moment relative time
moment.locale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});


    



