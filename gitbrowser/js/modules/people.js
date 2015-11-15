/**
 * People module
 */
define(['knockout', 'ojs/ojcore', 'ojs/ojrouter', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojtable'], function (ko, oj) {
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
        var baseUrl = "https://api.github.com/";
        var UsersCollection = oj.Collection.extend({
            url: "https://api.github.com/users?per_page=100",
            customURL: function () {
                var search = peopleViewModel.searchName();
                var url = baseUrl + (search ? "search/users?q=" + encodeURIComponent(search) : "users?per_page=100");
                return url;
            }
        });
        peopleViewModel.users(new UsersCollection());
        peopleViewModel.usersDatasource(new oj.CollectionTableDataSource(peopleViewModel.users()));
        peopleViewModel.searchName.subscribe(function () {
            // reset collection when search field changes to force requery
            // without even using a button or form submit
            peopleViewModel.users().reset();
        });
    }
    return PeopleViewModel;
});
