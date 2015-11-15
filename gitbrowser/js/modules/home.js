/**
 * Main content module
 */
define(['ojs/ojcore' ,'knockout'
   ], function(oj, ko) {
   /**
    * The view model for the main content view template
    */
            function mainContentViewModel() {
                var self = this;
                
                self.something = ko.observable("This paragraph uses content from its own 'home' ViewModel. The module is found in the /js/module folder");
            }

   return mainContentViewModel;
});
