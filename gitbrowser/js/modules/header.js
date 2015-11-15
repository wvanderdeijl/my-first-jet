/**
 * Header module
 */
define(['knockout','ojs/ojcore', 'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojoffcanvas', 'ojs/ojdatacollection-common', 'ojs/ojdialog'
], function (ko, oj) {
    /**
     * The view model for the header module
     */

    function HeaderViewModel() {
        var self = this;

        // 
        // Button used for toggling off screen data.
        // 
        var offScreenDataButton = {
            "label": "offscreen-toggle",
            "iconClass": "oj-fwk-icon oj-fwk-icon-hamburger",
            "url": "#"
        };

        // 
        // Dropdown menu states
        // 

        self.menuItemSelect = function (event, ui) {
            switch (ui.item.attr("id")) {
                case "About":
                    $("#aboutDialog").ojDialog("open");
                    break;
                default:
            }
        };

        // Data for application name
        var appName = {
            "id": "qs",
            "name": "JET QuickStart Basic"
        };

        // 
        // Toolbar buttons
        // 
        var toolbarData = {
            // user name in toolbar
            "userName": "john.hancock@oracle.com",
            "toolbar_buttons": [
                {
                    "label": "toolbar_search_button",
                    "iconClass": "oj-fwk-icon-magnifier oj-fwk-icon",
                    "url": "#"
                }
            ],
            // Data for global nav dropdown menu embedded in toolbar.
            "global_nav_dropdown_items": [
                {"label": "Preferences",
                    "url": "#"
                },
                {"label": "Help",
                    "url": "#"
                },
                {"label": "About",
                    "url": "#"
                },
                {"label": "Sign Out",
                    "url": "#"
                }
            ]
        };

        self.offScreenButtonIconClass = offScreenDataButton.iconClass;
        self.offScreenButtonLabel = offScreenDataButton.label;

        self.appId = appName.id;
        self.appName = appName.name;

        self.userName = ko.observable(toolbarData.userName);
        self.toolbarButtons = toolbarData.toolbar_buttons;
        self.globalNavItems = toolbarData.global_nav_dropdown_items;

        self.appDrawer =
                {
                    "edge": "start",
                    "displayMode": "push",
                    "selector": "#appDrawer",
                    "selection": "selectedItem"
                };

        // 
        // Data for application navigation
        // 
        var appNavData = [
            {
                name: 'Home',
                id: 'home',
                iconClass: 'demo-home-icon-24 demo-icon-font-24 oj-navigationlist-item-icon'
            },
            {
                name: 'People',
                id: 'people',
                iconClass: 'demo-education-icon-24 demo-icon-font-24 oj-navigationlist-item-icon'
            },
            {
                name: 'Library',
                id: 'library',
                iconClass: 'demo-library-icon-24 demo-icon-font-24 oj-navigationlist-item-icon'
            },
            {
                name: 'Graphics',
                id: 'graphics',
                iconClass: 'demo-palette-icon-24  demo-icon-font-24 oj-navigationlist-item-icon'
            },
            {
                name: 'Performance',
                id: 'performance',
                iconClass: 'demo-grid-icon-16 demo-icon-font-24 oj-navigationlist-item-icon'
            }];

        self.dataSource = new oj.ArrayTableDataSource(appNavData, {idAttribute: 'id'});
     
        self.toggleAppDrawer = function ()
        {
            return oj.OffcanvasUtils.toggle(self.appDrawer);
        };

        //
        // Close off-screen content once window becomes larger.
        //
        var query = window.matchMedia("(min-width: 39.375rem)");
        var mqListener = function (event)
        {
            oj.OffcanvasUtils.close(self.appDrawer);
        };
        query.addListener(mqListener);

    }
    return HeaderViewModel;
});
