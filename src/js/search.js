/*!
 * A simple JSON search
 * @author Mat Hayward - Erskine Design (Original Author)
 * @author Chris Burnell <me@chrisburnell.com> (Slight, poor modifications)
 */

(() => {
    "use strict";

    let query;
    let searchContainer = document.querySelector(".js-search");
    let searchForm = document.querySelector(".js-search-form");
    let searchInput = document.querySelector(".js-search-input");
    let searchSubmit = document.querySelector(".js-search-submit");
    let resultsMeta = document.querySelector(".js-search-meta");
    let resultsList = document.querySelector(".js-search-results-list");
    const ALLOW_EMPTY = false;
    const ALLOW_AS_YOU_TYPE = false;
    const JSON_FEED_URL = "/search.json";
    const author = document.querySelector("meta[name=author]").content;
    const rootUrl = document.querySelector("link[rel=self]").href.replace("feed.xml", "");
    const SEARCH_PAGE_TEMPLATE =
`<li role="listitem">
    <article class="h-entry" role="article">
        <a class="u-url" href="#">
            <h3 class="delta  title  p-name">{{ title }}</h3>
            <p class="lede  p-summary">{{ lede }}</p>
        </a>
        <a class="p-author  h-card" href="${rootUrl}" hidden aria-hidden="true" tabindex="-1">${author}</a>
    </article>
</li>`;
    const SEARCH_POST_TEMPLATE =
`<li role="listitem">
    <article class="h-entry" role="article">
        <a class="u-url" href="#">
            <svg class="icon  icon--{{ icon }}" role="img"><use xlink:href="/images/sprites.svg#svg--{{ icon }}" /></svg>
            <h3 class="delta  title  p-name"{{ hidden }}>{{ title }}</h3>
            <p class="lede  p-summary">{{ lede }}</p>
            <time class="date" datetime="{{ date_full }}">{{ date_friendly }}</time>
        </a>
        <a class="p-author  h-card" href="${rootUrl}" hidden aria-hidden="true" tabindex="-1">${author}</a>
    </article>
</li>`;

    ////
    /// Initiate search functionality.
    /// Shows results based on querystring if present.
    /// Binds search function to form submission.
    ////
    let initSearch = () => {
        if (!searchContainer) {
            return;
        }

        // Get search results if query parameter is set in querystring
        if (helpers.getParameterByName("q") || helpers.getParameterByName("query")) {
            query = decodeURIComponent(helpers.getParameterByName("q") ? helpers.getParameterByName("q") : helpers.getParameterByName("query"));
            searchInput.value = query;
            execSearch(query);
        }

        query = searchInput.value;

        // Catch the form submission and initiate search lookup
        searchForm.addEventListener("submit", submitCallback);
        if (ALLOW_AS_YOU_TYPE) {
            let inputCheck;
            searchInput.addEventListener("focus", () => {
                inputCheck = setInterval(() => {
                    if (searchInput.value != query && searchInput.value.length >= 2 && searchInput.value.length <= 30) {
                        submitCallback(false);
                    }
                }, 50);
            });
            searchInput.addEventListener("blur", () => {
                window.clearInterval(inputCheck);
            });
        }
    };

    let submitCallback = (event = false) => {
        if (event) {
            event.preventDefault();
        }
        query = searchInput.value;

        if (query.length >= 2 && query.length <= 30) {
            execSearch(query);
        } else {
            resultsMeta.innerHTML = "Your search query must be 2–30 characters in length.";
        }
    };

    ////
    /// Executes search
    /// @param {String} query
    /// @return void
    ////
    let execSearch = query => {
        if (query !== "" || ALLOW_EMPTY) {
            getSearchResults();
        }
    };

    ////
    /// Get Search results from JSON
    /// @param {Function} callbackFunction
    /// @return void
    ////
    let getSearchResults = () => {
        fetch(JSON_FEED_URL)
            .then(helpers.getFetchResponse)
            .then(response => response.json())
            .then(data => {
                // Success!
                processData(data);
            })
            .catch(error => {
                // Fail!
                console.error(`Search request status error: ${error}`);
            });
    };

    ////
    /// Process search result data
    /// @return void
    ////
    let processData = data => {
        let resultsCount = 0,
            results = "";

        for (let item of data) {
            let queryFormatted = query.toLowerCase(),
                titleCheck = false,
                ledeCheck = false,
                dateCheck = false,
                contentCheck = false,
                categoriesCheck = false,
                tagsCheck = false,
                locationCheck = false;

            if (item.title) {
                titleCheck = item.title.toLowerCase().indexOf(queryFormatted) > -1;
            }

            if (item.lede) {
                ledeCheck = item.lede.toLowerCase().indexOf(queryFormatted) > -1;
            }
            else {
                item.lede = item.categories.charAt(0).toUpperCase() + item.categories.slice(1);
            }

            if (item.date || item.date_friendly) {
                if (queryFormatted.substring(0, 5) == "date:") {
                    dateCheck = item.date.toLowerCase().indexOf(queryFormatted.slice(5)) > -1;
                    if (!dateCheck) {
                        dateCheck = item.date_friendly.toLowerCase().indexOf(queryFormatted.slice(5)) > -1;
                    }
                } else {
                    dateCheck = item.date.toLowerCase().indexOf(queryFormatted) > -1;
                    if (!dateCheck) {
                        dateCheck = item.date_friendly.toLowerCase().indexOf(queryFormatted) > -1;
                    }
                }
            }
            if (item.content) {
                contentCheck = item.content.toLowerCase().indexOf(queryFormatted) > -1;
            }
            if (item.categories) {
                categoriesCheck = item.categories.toLowerCase().indexOf(queryFormatted) > -1;

                if (item.categories == "beer") {
                    item.lede = `Beer by ` + item.authors + ". " + (item.location ? "Drank at " + item.location + "." : "") + "<br>" + item.rating + (item.badges ? "<br>🏅 Earned " + item.badges + " badge" + (item.badges > 1 ? "s" : "") + "." : "");
                }
                else if (item.categories == "book") {
                    item.lede = `Book by ` + item.authors + "." + (item.rating ? "<br>" + item.rating : "");
                }
                else if (item.categories == "music") {
                    item.lede = `Album by ` + item.authors + ".<br>" + item.rating;
                }
                else if (item.categories == "talk") {
                    item.lede = 'Talk';
                    if (item.location) {
                        item.lede += ` – Given at ${item.location}`;
                    }
                }
            }
            if (item.banner || item.cover || item.has_image) {
                item.lede = `<span class="emoji">🖼️</span> ${item.lede}`;
            }
            if (item.rsvp) {
                item.lede = `<span class="emoji">📅</span> ${item.lede}`;
            }
            if (item.emoji) {
                item.lede = `<span class="emoji">${item.emoji}</span> ${item.lede}`;
            }
            if (item.in_reply_to) {
                let reply;
                if (item.in_reply_to.includes('mastodon.social')) {
                    reply = `<span class="h-cite  u-in-reply-to">a Toot</span>`;
                }
                else if (item.in_reply_to.includes('twitter.com')) {
                    if (item.in_reply_to.includes('/status/')) {
                        reply = `<span class="h-cite  p-in-reply-to">@${item.in_reply_to.split('/status/')[0].split('twitter.com/')[1]}</span>`;
                    }
                    else {
                        reply = `<span class="h-cite  p-in-reply-to">a Tweet</span>`;
                    }
                }
                else if (item.in_reply_to.includes('hwclondon.co.uk')) {
                    reply = `<span class="h-cite  p-in-reply-to">Homebrew Website Club London</span>`;
                }
                else {
                    reply = `<span class="h-cite  p-in-reply-to">${item.in_reply_to}</span>`;
                }
                item.lede = `<span class="emoji">↩️</span> In reply to: ${reply}<br>${item.lede}`;
            }
            if (item.tags) {
                if (queryFormatted.substring(0, 4) == "tag:") {
                    tagsCheck = item.tags.toLowerCase().indexOf(queryFormatted.slice(4)) > -1;
                }
                else if (queryFormatted.substring(0, 5) == "tags:") {
                    tagsCheck = item.tags.toLowerCase().indexOf(queryFormatted.slice(5)) > -1;
                }
                else {
                    tagsCheck = item.tags.toLowerCase().indexOf(queryFormatted) > -1;
                }
            }
            if (item.location) {
                locationCheck = item.location.toLowerCase().indexOf(queryFormatted) > -1;
            }

            // if performing a date check
            if (queryFormatted.substring(0, 5) == "date:" && dateCheck) {
                resultsCount++;
                results += populateResultContent(SEARCH_POST_TEMPLATE, item, query);
            }
            // if performing a tags check
            else if ((queryFormatted.substring(0, 4) == "tag:" || queryFormatted.substring(0, 5) == "tags:") && tagsCheck) {
                resultsCount++;
                results += populateResultContent(SEARCH_POST_TEMPLATE, item, query);
            }
            // or item type is a page, check if search term is in title,
            // content, or lede, categories, tags, or talk location
            else if (item.type == "page" && (titleCheck || ledeCheck || contentCheck)) {
                resultsCount++;
                results += populateResultContent(SEARCH_PAGE_TEMPLATE, item, query);
            }
            // check if search term is in title, lede, content, categories,
            // tags, or talk location
            else if (titleCheck || ledeCheck || dateCheck || contentCheck || categoriesCheck || tagsCheck || locationCheck) {
                resultsCount++;
                results += populateResultContent(SEARCH_POST_TEMPLATE, item, query);
            }
        }

        populateResultsString(resultsCount);
        showSearchResults(results);
    };

    ////
    /// Add search results to placeholder
    /// @param {String} results
    /// @return void
    ////
    let showSearchResults = results => {
        // Add results HTML to placeholder
        resultsList.innerHTML = results;
        // And mark the resultsList as `aria-expanded="true"`
        resultsList.setAttribute("aria-expanded", "true");
    };

    ////
    /// Add results content to item templates
    /// @param {String} html
    /// @param {object} item
    /// @return {String} Populated HTML
    ////
    let populateResultContent = (html, item, query) => {
        let queryHighlightRegex = new RegExp(query, "gi");

        // URL
        html = helpers.injectContent(html, "#", item.url);

        // ICON
        html = helpers.injectContent(html, /{{\s*icon\s*}}/, "bullhorn");
        if (item.categories == "article") {
            html = helpers.injectContent(html, /{{\s*icon\s*}}/, "article");
        } else if (item.categories == "bookmark") {
            html = helpers.injectContent(html, /{{\s*icon\s*}}/, "link");
        } else if (item.categories == "note") {
            html = helpers.injectContent(html, /{{\s*icon\s*}}/, "feather");
        } else if (item.categories == "pen") {
            html = helpers.injectContent(html, /{{\s*icon\s*}}/, "codepen");
        }

        // TITLE
        if (item.categories == "note") {
            html = helpers.injectContent(html, /{{\s*title\s*}}/, item.date_friendly.replace(queryHighlightRegex, `<mark>$&</mark>`));
        } else {
            html = helpers.injectContent(html, /{{\s*title\s*}}/, item.title.replace(queryHighlightRegex, `<mark>$&</mark>`));
        }

        // LEDE
        if (item.lede) {
            let ledeFormatted = item.lede
                // .replace(/(<([^>]+)>)/gi, "")
                // .split(/(?=\s)/gi)
                // .slice(0, 20)
                // .join("")
                .replace(queryHighlightRegex, `<mark>$&</mark>`);
            html = helpers.injectContent(html, /{{\s*lede\s*}}/, ledeFormatted);
        }

        // DATE
        if (item.type == "post") {
            html = helpers.injectContent(html, /{{\s*date_friendly\s*}}/, item.date_friendly);

            if (item.categories == "note") {
                html = helpers.injectContent(html, /{{\s*hidden\s*}}/, " hidden");
            } else {
                html = helpers.injectContent(html, /{{\s*hidden\s*}}/, "");
            }

            html = helpers.injectContent(html, /{{\s*date_full\s*}}/, item.date);
        }

        return html;
    };

    ////
    /// Populates results string
    /// @param {String} count
    /// @return void
    ////
    let populateResultsString = count => {
        let resultSuffix = count == 1 ? "" : "s";
        let searchMeta = `<strong>${count}</strong> result${resultSuffix} found for <q>${query}</q>`;

        resultsMeta.innerHTML = searchMeta;
    };

    // enable Search
    if (searchInput !== null && searchSubmit !== null) {
        searchInput.disabled = false;
        searchInput.setAttribute("aria-disabled", "false");
        searchSubmit.disabled = false;
        searchSubmit.setAttribute("aria-disabled", "false");
        initSearch();
    }
})();
