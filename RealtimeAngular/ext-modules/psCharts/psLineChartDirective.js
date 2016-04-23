'use strict';

angular.module('psCharts').directive('psLineChart', [
    'psWebMetricsService',
    function (psWebMetricsService) {
        return {
            scope: {
                metric: '@metric'
            },
            template: '',
            link: function (scope, el, attrs) {

                scope.options = {
                    width: 600,
                    height: 300,
                    legend: {
                        position: 'none'
                    },
                    vAxis: {
                        maxValue: 100,
                        minValue: 0
                    },
                    hAxis: {
                        slantedText: false,
                        format: 'h:mm:ss',
                        maxTextLines: 1,
                        gridlines: {
                            count: 20
                        }
                    }
                };

                scope.options.title = psWebMetricsService.getTitleForMetric(scope.metric);
                scope.initialized = false;

                scope.$on('psWebMetricsService-received-data-event', function (evt, data) {

                    if (!scope.initialized) {
                        scope.data = new google.visualization.DataTable();
                        scope.data.addColumn('timeofday', 'Time of Day');
                        scope.data.addColumn('number', 'Value');

                        scope.chart = new google.visualization.LineChart(el[0]);
                        scope.initialized = true;
                    }
                    var d = new Date(data.time);
                    scope.data.addRow([ [d.getHours(), d.getMinutes(), d.getSeconds()], Math.round(data[scope.metric])]);
                    
                    var rowCount = scope.data.getNumberOfRows();
                    if (rowCount < 20) {
                        scope.options.hAxis.baseline = [d.getHours(),
                            d.getMinutes(),
                            d.getSeconds() + 20 - rowCount];
                    }
                    else {
                        scope.options.hAxis.baseline = [
                            d.getHours(),
                            d.getMinutes(),
                            d.getSeconds()
                        ];
                    }
                    if (rowCount > 20)
                        scope.data.removeRow(0);

                    scope.chart.draw(scope.data, scope.options);

                });
            }
        };
    }]);