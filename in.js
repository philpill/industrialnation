(function (window, $, _, undefined) {

    var linksUrl = 'https://raw.githubusercontent.com/philpill/industrialnation/master/bookmarks.json';

    var $linksContainer = $('#Bookmarks');

    function setupUnderscore () {
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
        };
    }

    function load () {
        getData()
        .done(function (data) {
            var bookmarks = parseDataToJson(data);
            var sortedTags = getTagsFromData(bookmarks);
            sortedTags.map(createTagBlock);
            var container = getBookmarksContainer(sortedTags);
            bookmarks.map(function (bookmark) {
                container[bookmark.tag].push({
                    title : bookmark.title,
                    tag : bookmark.tag,
                    url : bookmark. url,
                });
            });
            sortedTags.map(function (tag) {
                addLinks(tag, container[tag]);
            });
            activateContainer();
        });
    }

    function getBookmarksContainer (tags) {
        var sortedBookmarks = {};
        tags.map(function (tag) {
            sortedBookmarks[tag] = [];
        });
        return sortedBookmarks;
    }

    function activateContainer () {
        $linksContainer.addClass('active');
    }

    function getData () {
        return $.get(linksUrl);
    }

    function parseDataToJson (data) {
        return JSON.parse(data);
    }

    function getTagsFromData (data) {
        var allTags = _.pluck(data, 'tag');
        var tags = _.uniq(allTags);
        return tags.sort();
    }

    function createTagBlock (tag) {
        var compiled = _.template($('.templates__tag-block').html());
        var tagBlock = compiled({ 'tag' : tag });
        $linksContainer.append(tagBlock);
    }

    function addLinks (tag, links) {
        $('.js-' + tag).append(compileLinks(links));
    }

    function compileLinks (links) {
        var $list = $('.templates__links-list ul').clone();
        var compiled = _.template($('.templates__link').html());
        links.map(function (link) {
            $list.append(compiled(link));
        });
        return $list;
    }

    function init () {
        setupUnderscore();
        load();
    }

    init();

})(window, jQuery, _);
