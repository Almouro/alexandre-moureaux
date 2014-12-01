'use strict';

(function(){
  var app = angular.module('almouro', ['mgcrea.ngStrap', 'ngAnimate', 'ui.router', 'snap']);

  app.controller('MainController', ['$scope', 'snapRemote', '$rootScope', '$timeout', '$window', function($scope, snapRemote, $rootScope, $timeout, $window){
    (function snapperHandler(){
      var ENTERING_PAGE_DURATION = 1200;
      var snapper;
      var closeSnapperTimeout;

      var closeSnapper = function(){
        snapper.close();
      };

      function isSmallScreen(){
        return $window.innerWidth < 768;
      }

      snapRemote.getSnapper().then(function(snapper_) {
        snapper = snapper_;

        $rootScope.$on('$stateChangeStart', function(){
          $timeout.cancel(closeSnapperTimeout);
        });

        $rootScope.$on('$stateChangeSuccess', function(){
          if(isSmallScreen()) closeSnapper();
          else closeSnapperTimeout = $timeout(closeSnapper, ENTERING_PAGE_DURATION);
        });

        snapper.on('open', function() {
          $timeout.cancel(closeSnapperTimeout);
        });
        
        snapper.on('close', function() {
          //
        });
      });
    })();
  }]);

  app.controller('HomeController', ['$scope', function($scope){
    //
  }]);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/home");
    //
    // Now set up the states
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "home.html"
      })
      .state('music', {
        url: "/music",
        templateUrl: "music.html"
      })
      .state('christian', {
        url: "/christian",
        templateUrl: "christian.html"
      })
      .state('software', {
        url: "/software",
        templateUrl: "software.html"
      })
      .state('contact', {
        url: "/contact",
        templateUrl: "contact.html"
      })
      .state('about', {
        url: "/about",
        templateUrl: "about.html"
      });

  }]);

  app.config(['snapRemoteProvider', function(snapRemoteProvider) {
    snapRemoteProvider.globalOptions.disable = 'right';
  }]);

  app.directive('burger', function() {
    return {
      templateUrl: 'burger.html'
    };
  });

  app.directive('sideMenu', function() {
    return {
      templateUrl: 'side-menu.html',
      controller: ['$scope', '$state', function($scope, $state){
          $scope.getState = function(){
            return $state.current.name;
          }
        }]
    };
  });

  app.directive('footerAlmouro', function() {
    return {
      templateUrl: 'footer.html'
    };
  });

})();