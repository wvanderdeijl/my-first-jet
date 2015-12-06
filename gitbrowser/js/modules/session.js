/**
 * Session module
 */
define(['knockout', 'ojs/ojcore', 'keys', 'soap', 'ojs/ojmodel', 'ojs/ojknockout-model', 'ojs/ojinputtext', 'ojs/ojslider', 'ojs/ojdatetimepicker', 'ojs/ojchart', 'ojs/ojbutton'],
        function (ko, oj, keys, soap) {
            /**
             * The view model for the Session module
             */
            function SessionViewModel(router) {
                // ----- public fields and methods -----
                var sessionViewModel = this;
                sessionViewModel.fetched = ko.observable(false);
                sessionViewModel.sessionDate = ko.observable();
                sessionViewModel.sessionStartTime = ko.observable();
                sessionViewModel.sessionStartHour = _timePartComputer(sessionViewModel.sessionStartTime, 0);
                sessionViewModel.sessionStartMinutes = _timePartComputer(sessionViewModel.sessionStartTime, 1);
                sessionViewModel.sessionEndTime = ko.observable();
                sessionViewModel.sessionLength = ko.observable();
                sessionViewModel.session = ko.observable();
                sessionViewModel.processStarted = ko.observable(false);
                sessionViewModel.pieSeries = ko.computed(function () {
                    var ses = sessionViewModel.session();
                    if (!ses) {
                        return;
                    }
                    var series = ses.attendances().reduce(function (series, att) {
                        var status = att.status;
                        series[status] = (series[status] || 0) + 1;
                        return series;
                    }, {});
                    return Object.keys(series).map(function (serie) {
                        return {name: serie.replace(/_/g, ' ').toLowerCase(), items: [series[serie]]};
                    });
                });

                sessionViewModel.dateConverter = ko.observable();
                sessionViewModel.save = _save;
                sessionViewModel.cancel = _cancel;
                sessionViewModel.startProcess = _startProcess;

                // (public) lifecycle methods
                sessionViewModel.handleActivated = _handleActivated;

                // private fields and methods
                var model; // fetched model
                var SessionModel = oj.Model.extend({
                    urlRoot: 'https://mobileportalsetrial0004dev-mcsdem0004.mobileenv.us2.oraclecloud.com:443/mobile/custom/ukougcloud/sessions',
                });

                sessionViewModel.sessionStartTime.subscribe(function () {
                    var start = timeToDate(new Date(sessionViewModel.sessionDate()), sessionViewModel.sessionStartTime());
                    var duration = sessionViewModel.sessionLength();
                    if (!duration) {
                        return;
                    }
                    sessionViewModel.sessionEndTime(dateToTime(addMinutes(start, duration)));
                });
                sessionViewModel.sessionEndTime.subscribe(function () {
                    var end = timeToDate(new Date(sessionViewModel.sessionDate()), sessionViewModel.sessionEndTime());
                    var duration = sessionViewModel.sessionLength();
                    if (!duration) {
                        return;
                    }
                    sessionViewModel.sessionStartTime(dateToTime(addMinutes(end, -duration)));
                });

                function _timePartComputer(observable, partIdx) {
                    return ko.pureComputed({
                        read: function () {
                            var parts = observable().split(':');
                            return parts[partIdx];
                        },
                        write: function (newval) {
                            var str = '' + newval;
                            str = str.length < 2 ? '0' + str : str;
                            var parts = observable().split(':');
                            parts[partIdx] = str;
                            observable(parts.join(':'));
                        }
                    });
                }

                function _handleActivated(info /* args from data-bind="ojModule" */) {
                    // see ModuleBindings documentation for lifecycle methods
                    console.log('*** handleActivated');
                    console.log(JSON.stringify(info));
                    var va = info.valueAccessor();
                    console.log('va:' + JSON.stringify(va));
                    var parentRouter = info.valueAccessor().params;
                    console.log('parent:' + typeof (parent));
                    var ourRouter = parentRouter.currentState().value;
                    console.log('ourRouter:' + typeof (ourRouter));
                    ourRouter.configure(function (stateId) {
                        console.log('stateId:' + JSON.stringify(stateId));
                        if (!stateId) {
                            return;
                        }
                        // return the oj.RouterState object 
                        return new oj.RouterState(stateId, {
                            enter: function () {
                                sessionViewModel._fetch(stateId);
                            }
                        });
                    });
                    // Returns the sync promise to handleActivated. The next
                    // phase of the ojModule lifecycle (attached) will not be
                    // executed until sync is resolved.
                    return oj.Router.sync();
                }

                sessionViewModel._fetch = function (id) {
                    model = new SessionModel();
                    model.id = id;
                    console.log('--- fetching ' + id);
                    var start = Date.now();
                    model.fetch({
                        headers: keys.headers,
                        success: function (model, response, options) {
                            console.log('in ' + (Date.now() - start) + 'ms fetched ' + JSON.stringify(model));
                            sessionViewModel.sessionDate(model.get('sessionDate').slice(0, -1));
                            sessionViewModel.sessionStartTime(model.get('startTime'));
                            sessionViewModel.sessionEndTime(model.get('endTime'));
                            sessionViewModel.sessionLength(model.get('length'));
                            sessionViewModel.session(oj.KnockoutUtils.map(model));
                            sessionViewModel.fetched(true);
                        },
                        error: function (model, xhr, options) {
                            console.log('fetch error');
                        }
                    });
                }

                function _save() {
                    console.log('*** saving session');
                    /*
                     model.save(
                     {sessionDate: sessionViewModel.sessionDate(), startTime: sessionViewModel.sessionStartTime(), endTime: sessionViewModel.sessionEndTime()},
                     {
                     headers: keys.headers,
                     success: function (myModel, response, options) {
                     console.log('saving was a success');
                     window.history.back();
                     },
                     error: function (jqXHR, textStatus, errorThrown) {
                     alert("Update failed with: " + textStatus);
                     window.history.back();
                     }
                     });
                     */
                    var newstart = sessionViewModel.sessionDate();
                    newstart = newstart.substring(0, newstart.indexOf('T'));
                    newstart += 'T' + sessionViewModel.sessionStartTime() + 'Z';
                    var duration = 'PT' + sessionViewModel.sessionLength() + 'M';
                    soap.post(urlReschedule, msgReschedule, [sessionViewModel.session().id(), newstart, duration]);
                }

                function _cancel() {
                    console.log('*** cancel changing session');
                    window.history.back();
                }

                function _startProcess() {
                    console.log('starting process');
                    var nameparts = sessionViewModel.session().speakerName().split(' ');
                    var firstname = nameparts.length >= 0 && nameparts[0].trim();
                    var lastname = nameparts.length >= 1 && nameparts[1].trim();
                    var start = timeToDate(new Date(sessionViewModel.session().sessionDate()), sessionViewModel.session().startTime()).toISOString();
                    start = start.substring(0, start.indexOf('.'));
                    soap.post(urlStart, msgStart,
                            [
                                sessionViewModel.session().id(), sessionViewModel.session().title(), sessionViewModel.session().speakerId(),
                                firstname, lastname, firstname + '.' + lastname + '@example.com', start, 'PT' + sessionViewModel.session().length() + 'M'
                            ]);
                }

                // ----- private implementation details -----

                console.log('*** constructed SessionViewModel');
                sessionViewModel.dateConverter(
                        oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
                        .createConverter({pattern: 'EEE d MMM yyyy'}));
            }

            function timeToDate(date, timestring) {
                var onlydate = date.toISOString();
                onlydate = onlydate.substring(0, onlydate.indexOf('T'));
                return new Date(onlydate + 'T' + timestring + 'Z');
            }

            function dateToTime(date) {
                var str = date.toISOString();
                return str.slice(str.indexOf('T') + 1, str.indexOf('.'));
            }

            function addMinutes(date, minutes) {
                return new Date(date.getTime() + (minutes * 60 * 1000));
            }

            var urlStart = 'http://soademo.eproseed.com:7003/soa-infra/services/player/AttendanceApplication!1.0*soa_66e7291c-3d0c-45a8-96f5-bc3ff8bf71e1/SessionProcess.service';
            var msgStart =
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ses="http://xmlns.oracle.com/bpmn/bpmnCloudProcess/AttendanceApplication/SessionProcess" xmlns:pres="http://xmlns.oracle.com/bpm/bpmobject/BusinessData/Presentation" xmlns:spe="http://xmlns.oracle.com/bpm/bpmobject/BusinessData/Speaker">' +
                    '   <soapenv:Header/>' +
                    '   <soapenv:Body>' +
                    '      <ses:start>' +
                    '         <pres:Presentation>' +
                    '            <pres:id>{0}</pres:id>' +
                    '            <pres:title>{1}</pres:title>' +
                    '            <pres:speaker>' +
                    '               <spe:id>{2}</spe:id>' +
                    '               <spe:firstName>{3}</spe:firstName>' +
                    '               <spe:lastName>{4}</spe:lastName>' +
                    '               <spe:email>{5}</spe:email>' +
                    '            </pres:speaker>' +
                    '            <pres:sessionDate>{6}</pres:sessionDate>' +
                    '            <pres:sessionDuration>{7}</pres:sessionDuration>' +
                    '         </pres:Presentation>' +
                    '      </ses:start>' +
                    '   </soapenv:Body>' +
                    '</soapenv:Envelope>';
            var urlReschedule = 'http://soademo.eproseed.com:7003/soa-infra/services/testing/AttendanceApplication/SessionProcess.service';
            var msgReschedule =
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ses="http://xmlns.oracle.com/bpmn/bpmnCloudProcess/AttendanceApplication/SessionProcess">' +
                    '   <soapenv:Header/>' +
                    '   <soapenv:Body>' +
                    '      <ses:createASession>' +
                    '        <presentationId>{0}</presentationId>' +
                    '        <sessionDateTime>{1}</sessionDateTime>' +
                    '        <sessionDuration>{2}</sessionDuration>' +
                    '      </ses:createASession>' +
                    '   </soapenv:Body>' +
                    '</soapenv:Envelope>';

            return SessionViewModel;
        });
