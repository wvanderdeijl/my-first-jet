/**
 * Example of Require.js boostrap javascript
 */


requirejs.config({
    // Path mappings for the logical module names
    paths: {
        'knockout': 'libs/knockout/knockout-3.3.0',
        'jquery': 'libs/jquery/jquery-2.1.3.min',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.11.4.min',
        'promise': 'libs/es6-promise/promise-1.0.0.min',
        'hammerjs': 'libs/hammer/hammer-2.0.4.min',
        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
        'ojs': 'libs/oj/v1.1.2/debug',
        'ojL10n': 'libs/oj/v1.1.2/ojL10n',
        'ojtranslations': 'libs/oj/v1.1.2/resources',
        'signals': 'libs/js-signals/signals.min',
        'text': 'libs/require/text'
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        },
        'crossroads': {
            deps: ['signals'],
            exports: 'crossroads'
        }
    },
    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation 
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
            }
        }
    }
});




/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojrouter',
    'ojs/ojknockout',
    'ojs/ojbutton',
    'ojs/ojtoolbar',
    'ojs/ojmenu',
    'ojs/ojmodule'
],
        function (oj, ko, $) // this callback gets executed when all required modules are loaded
        {

            oj.ModuleBinding.defaults.modelPath = 'modules/';
            oj.ModuleBinding.defaults.viewPath = 'text!../templates/';
            oj.ModuleBinding.defaults.viewSuffix = '.tmpl.html';

            var router = oj.Router.rootInstance;
            router.configure({
                'home': {label: 'Home', isDefault: true},
                'people': {label: 'People'},
                'library': {label: 'Library'},
                'graphics': {label: 'Graphics'},
                'performance': {label: 'Performance'}
            });
            

            function RootViewModel() {
                var self = this;
                self.router = router;

                self.optionChangeHandler = function (event, data) {
                    if (data.value == undefined) {
                        data.value = 'home';
                    }
                    // Only go for user action events
                    if ('ojAppNav2' === event.target.id && event.originalEvent) {
                        self.router.go(data.value);
                    }
                };
            }

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            oj.Router.sync().then(
                    function () {
                        //bind your ViewModel for the content of the whole page body.
                        ko.applyBindings(new RootViewModel(), document.getElementById('globalBody'));
                        $('#globalBody').show();
                    },
                    function (error) {
                        oj.Logger.error('Error in root start: ' + error.message);
                    });

        }
);


