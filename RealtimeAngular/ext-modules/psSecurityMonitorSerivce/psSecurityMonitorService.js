'use strict';

angular.module('psSecurityMonitorService', []).factory('psSecurityMonitorService', [
    '$rootScope',
    function ($rootScope) {

        var socket = io('http://localhost:3000');

        socket.on('security event', function (msg) {
            $rootScope.$broadcast('psSecurityMonitorService-received-data-event',
                msg);
        });

        return {

        };
    }
]);