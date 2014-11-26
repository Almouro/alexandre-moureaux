'use strict';

(function(){
  var app = angular.module('almouro', ['mgcrea.ngStrap', 'ngAnimate', 'ui.router']);

  app.controller('HomeController', function($scope){
    $scope.tabs = [
    {
      "title": "Home",
      "content": "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica."
    },
    {
      "title": "Profile",
      "content": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
    },
    {
      "title": "About",
      "content": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
    }
    ];
    $scope.tabs.activeTab = 0;

    $scope.popover = {
    "title": "Title",
    "content": "Hello Popover<br />This is a multiline message!"
    };
  });

  app.config(function($stateProvider, $urlRouterProvider) {
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
      });

  });

  app.directive('navbar', function() {
    return {
      templateUrl: 'directives/navbar.html'
    };
  });

  app.directive('footerAlmouro', function() {
    return {
      templateUrl: 'directives/footer.html'
    };
  });

})();