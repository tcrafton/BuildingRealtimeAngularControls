'use strict';

angular.module('app').directive('appSecurityMonitor', [
    'psSecurityMonitorService',
    function (psSecurityMonitorService) {
        return {
            scope: {
            },
            templateUrl: 'app/appSecurityMonitorTemplate.html',
            link: function (scope, el, attrs) {
                scope.filter = 'All';
                scope.messages = [];
                scope.autoscroll = true;
                scope.$on('psSecurityMonitorService-received-data-event', function (evt, data) {

                    if (scope.filter == 'All' ||
                        scope.filter == data.event) {

                        scope.$apply(function () {
                            if (data.event == 'Sign On')
                                data.colorClass = 'non-error';
                            scope.messages.push(data);

                        });
                    }

                    if (scope.autoscroll) {
                        el.find('div')[0].scrollTop = el.find('div')[0].scrollHeight;
                    }
                });

                // set autoscroll on or off based on user scrolling
                el.find('div').scroll(function (event, data) {
                    if (this.scrollTop < this.scrollHeight - $(this).height()) {
                        scope.autoscroll = false;
                    } else {
                        scope.autoscroll = true;
                    }
                });
            }
        }
    }
]);