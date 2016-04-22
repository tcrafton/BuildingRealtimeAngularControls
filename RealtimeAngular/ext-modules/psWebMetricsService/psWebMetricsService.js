"use strict";

angular.module('psWebMetricsService', []).factory('psWebMetricsService', [
    '$rootScope',
    function ($rootScope) {

        var hub = $.connection.metricHub;

        hub.client.broadcastMessage = function (time, bandwidthPct, cpuPct,
                            salesAmt, alphaSalesAmt, betaSalesAmt) {

            $rootScope.$broadcast('psWebMetricsService-received-data-event',
                {
                    'time': time,
                    'bandwidthPct': bandwidthPct,
                    'cpuPct': cpuPct,
                    'salesAmt': salesAmt,
                    'alphaSalesAmt': alphaSalesAmt,
                    'betaSalesAmt': betaSalesAmt
                });

        };

        $.connection.hub.start()
            .done()
            .fail(function (data) {
                alert(data);
            }
        );

        var getTitleForMetric = function (metric) {
            switch (metric) {
                case 'time':
                    return 'Time';
                case 'bandwidthPct':
                    return 'Bandwidth %';
                case 'cpuPct':
                    return 'CPU %';
                case 'salesAmt':
                    return 'Sales Amount';
                case 'alphaSalesAmt':
                    return 'Alpha Sales Amount';
                case 'betaSalesAmt':
                    return 'Beta Sales Amount';
            }
            return undefined;
        };

        return {
            getTitleForMetric: getTitleForMetric
        };
    }
]);