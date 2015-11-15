/**
 * People module
 */
define(['knockout', 'ojs/ojcore', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'], function (ko, oj, $) {
    /**
     * The view model for the People module
     */
    function PeopleViewModel() {
        var peopleViewModel = this;
        peopleViewModel.searchName = ko.observable("");
        peopleViewModel.searchClick = searchClick;
        
        // ----- implementation details -----
        function searchClick() {
            alert('clicked');
        }
    }
    return PeopleViewModel;
});
