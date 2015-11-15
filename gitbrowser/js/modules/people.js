/**
 * People module
 */
define(['knockout', 'ojs/ojcore', 'ojs/ojrouter', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojtable', 'ojs/ojlistview'], function (ko, oj) {
    /**
     * The view model for the People module
     */
    function PeopleViewModel() {
        // ----- public fields and methods -----
        var peopleViewModel = this;
        peopleViewModel.searchName = ko.observable("");
        peopleViewModel.users = ko.observable();
        peopleViewModel.usersDatasource = ko.observable(); // datasource for ojTable

        // ----- private implementation details -----
        var UsersCollection = oj.Collection.extend({customURL: _buildUrl});
        peopleViewModel.users(new UsersCollection());
        peopleViewModel.searchName.subscribe(function () {
            _fetch();
        });
        _fetch();
        
        // ----- methods -----
        function _buildUrl() {
            var baseUrl = "https://api.github.com/";
            var search = peopleViewModel.searchName();
            var url = baseUrl + (search ? "search/users?q=" + encodeURIComponent(search) : "users?per_page=100");
            return url;
        }
        function _fetch() {
            peopleViewModel.users().reset();
            peopleViewModel.usersDatasource(new oj.CollectionTableDataSource(peopleViewModel.users()));
        }
    }
    return PeopleViewModel;
});
