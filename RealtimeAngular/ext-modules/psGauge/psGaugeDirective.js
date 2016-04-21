'use strict';

angular.module('psGauge').directive('psGauge', function () {
    return {
        templateUrl: 'ext-modules/psGauge/psGaugeTemplate.html',
        link: function (scope, el, attrs) {

            scope.options = {
                width: 200, height: 200,
                redFrom: 90, redTo: 100,
                yellowFrom: 75, yellowTo: 90,
                minorTicks: 5
            };

            scope.data = google.visualization.arrayToDataTable([
              ['Label', 'Value'],
              ['CPU %', 0]
            ]);

            var chart = new google.visualization.Gauge(el[0]);

            chart.draw(scope.data, scope.options);
        }
    }
});