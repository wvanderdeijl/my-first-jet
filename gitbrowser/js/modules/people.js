/**
 * People module
 */
define(['knockout', 'ojs/ojcore', 'jquery', 'ojs/ojrouter', 'ojs/ojknockout-model', 'ojs/ojmodel', 
        'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojtable', 'ojs/ojlistview', 'ojs/ojgauge'], 
function (ko, oj, $) {
    /**
     * The view model for the People module
     */
    function PeopleViewModel(params) {
        // ----- public fields and methods -----
        var peopleViewModel = this;
        peopleViewModel.searchName = ko.observable("");
        peopleViewModel.users = ko.observable();
        peopleViewModel.usersDatasource = ko.observable(); // datasource for ojTable
        peopleViewModel.maxScore = ko.observable();

        // ----- private implementation details -----
        var UsersCollection = oj.Collection.extend({customURL: _buildUrl});
        peopleViewModel.searchName.subscribe(function () {
            peopleViewModel.users().refresh().then(function(x){
                console.log(x);
                // unfortunately an ojListView doesn't refresh itself when
                // the underlying collection refresh, so we have to do it
                // ojTable does do it automatically.
                $('#ghusers').ojListView('refresh')
                var row0 = peopleViewModel.users().at(0);
                peopleViewModel.maxScore(row0 && row0.get('score'));
            });
        });
        peopleViewModel.users(new UsersCollection());
        peopleViewModel.usersDatasource(new oj.CollectionTableDataSource(peopleViewModel.users()));
        // ----- methods -----
        function _buildUrl() {
            var baseUrl = "https://api.github.com/";
            var search = peopleViewModel.searchName();
            var url = baseUrl + (search ? "search/users?q=" + encodeURIComponent(search) : "users?per_page=100");
            return url;
        }
    }
    return PeopleViewModel;
});
