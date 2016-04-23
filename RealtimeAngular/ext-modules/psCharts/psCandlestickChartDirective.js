'use strict';

angular.module('psCharts').directive('psCandlestickChart', [
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
                            count: 7
                        }
                    }
                };

                scope.startTime = null;
                scope.periodsOnChart = 5;
                scope.secondsPerPeriod = 5;

                scope.period = {
                    lowValue: 0,
                    firstValue: 0,
                    lastValue: 0,
                    highValue: 0,
                    startTime: null,
                    endTime: null
                };

                scope.options.title = psWebMetricsService.getTitleForMetric(scope.metric);
                scope.initialized = false;

                scope.$on('psWebMetricsService-received-data-event', function (evt, data) {

                    var value = Math.round(data[scope.metric]);
                    var d = new Date(data.time);

                    if (!scope.initialized) {
                        scope.data = new google.visualization.DataTable();
                        scope.data.addColumn('timeofday', 'Time of Day');
                        for (var i = 0; i < 4; i++)
                            scope.data.addColumn('number', 'Percent');

                        scope.startTime = new Date(d);
                        scope.period.startTime = new Date(d);
                        scope.period.endTime = new Date(d);
                        scope.period.endTime.setSeconds(scope.period.endTime.getSeconds() + scope.secondsPerPeriod);

                        scope.chart = new google.visualization.CandlestickChart(el[0]);

                        // dummy data row to start
                        var startSecs = scope.period.startTime.getSeconds() - scope.secondsPerPeriod;
                        if (startSecs < 0) startSecs = 0;
                        scope.data.addRow([[scope.period.startTime.getHours(), scope.period.startTime.getMinutes(), startSecs],
                            0, 0, 0, 0]);
                    }

                    if (!scope.initialized || d >= scope.period.endTime) {

                        scope.initialized = true;

                        // set up a new period
                        scope.period.lowValue =
                        scope.period.firstValue =
                        scope.period.lastValue =
                        scope.period.highValue = value;

                        if (d >= scope.period.endTime) {
                            scope.period.startTime.setSeconds(scope.period.startTime.getSeconds() + scope.secondsPerPeriod);
                            scope.period.endTime.setSeconds(scope.period.endTime.getSeconds() + scope.secondsPerPeriod);
                        }
                    }
                    else {

                        // update period values
                        if (value < scope.period.lowValue)
                            scope.period.lowValue = value;
                        if (value > scope.period.highValue)
                            scope.period.highValue = value;
                        scope.period.lastValue = value;

                        // remove the row for the current period
                        if (scope.data.getNumberOfRows() > 1)
                            scope.data.removeRow(scope.data.getNumberOfRows()-1);
                    }

                    // add the row for the current period
                    scope.data.addRow([[scope.period.startTime.getHours(), scope.period.startTime.getMinutes(), scope.period.startTime.getSeconds()],
                        scope.period.lowValue,
                        scope.period.firstValue,
                        scope.period.lastValue,
                        scope.period.highValue]);
                    
                    // remove any data that scrolls off the chart
                    var rowCount = scope.data.getNumberOfRows();
                    if (rowCount > scope.periodsOnChart) {
                        scope.data.removeRow(0);
                        rowCount--;
                        scope.startTime.setSeconds(scope.startTime.getSeconds() + scope.secondsPerPeriod);
                    }

                    // set the baseline properly
                    var newBaseline = new Date(scope.startTime);
                    newBaseline.setSeconds(newBaseline.getSeconds() + (scope.periodsOnChart-1) * scope.secondsPerPeriod);
                    scope.options.hAxis.baseline = [newBaseline.getHours(),
                        newBaseline.getMinutes(),
                        newBaseline.getSeconds()]; 

                    // draw the chart now that options and data are set up
                    scope.chart.draw(scope.data, scope.options);

                });
            }
        };
    }]);