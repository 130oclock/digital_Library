/**
 * Finds the objects that have a matching name.
 * @param {Array} list An array of objects.
 * @param {string} name The name to search for.
 * @returns An array containing all objects with a matching name from the list.
 */
function findItemsWithName(list, name) {
    const index = list.map(e => e.name).indexOf(name);
    if (index === -1) return -1;
    return list[index];
}

/**
 * 
 * @param {Event} event 
 * @param {string} input 
 * @param {Array} cache 
 * @param {string} alertText 
 * @param {Function} alertCall 
 * @returns 
 */
function tagInputEntry(event, input, cache, alertText, alertCall = null) {
    const code = event.keyCode || event.which;
    if (code == 13) {
        event.preventDefault();
        const tagContent = input.val().trim();
        const tagInput = input.parent();
        if (tagContent === "") return;
        if (findItemsWithName(cache, tagContent) === -1) {
            // notify that the author does not match.
            tagInput.find(".alert-text").text(`"${ tagContent }" ${ alertText }`);
            if (alertCall) alertCall(tagContent);
            return;
        }
        tagInput.find(".alert-text").text("");

        const tag = `<li>${ tagContent }
                    <button class="delete-button"></button>
                    </li>`;
        tagInput.children("ul").append(tag);
        input.val("");
    }
}

/**
 * Separates a full name into its components. Returns first, middle, and last names as an array.
 * If there is no middle name provided, provides an empty string.
 * @param {string} fullName The full name meant to be split.
 * @returns An array with first, middle, and last name.
 */
function splitFullName(fullName) {
    const parts = fullName.split(" ");
    if (parts.length === 3) {
        return [parts[0], parts[1], parts[2]];
    }
    return [parts[0], "", parts[1]];
}

var cachedAuthorNames = new Array();
var cachedGenreNames = new Array();

// Run once the document has loaded all html elements.
$(function() {

    // Send a GET request for authors in the database.
    $.get("/authors/all", (rows) => {
        let authorList = "";
        rows.forEach(row => {
            authorList += `<option value="${ row.name }">`;
        });
        cachedAuthorNames = rows;
        $("#authors-list").append(authorList);
    });

    // Get the list of genres from the json file.
    $.getJSON("/genres", function(genres) {
        let genreList = "";
        genres.forEach(genre => {
            genreList += `<option value="${ genre.name }">`;
        });
        cachedGenreNames = genres;
        $("#genres-list").append(genreList);
    });

    // ==========================================
    // ===                Tags                ===
    // ==========================================

    $("#author-tags-input").on("keydown", "input", function(event) {
        const input = $(this);
        tagInputEntry(event, input, cachedAuthorNames, "is not a known author. Would you like to add them?", function(value) {
            let name = splitFullName(value);
            $("#new-authors").find("input").each(function(index) {
                $(this).val(name[index]);
            }).end().toggleClass("hidden", false);
        });
    });

    $("#hide-new-author").on("click", function() {
        $(this).parent().parent().toggleClass("hidden", true);
        $("#author-tags-input").find("input").val("");
    })

    $("#genre-tags-input").on("keydown", "input", function(event) {
        const input = $(this);
        tagInputEntry(event, input, cachedGenreNames, "is not a valid genre.");
    });

    $(".tags-input").on("click", ".delete-button", function(event) {
        event.target.parentNode.remove();
    });

    // ==========================================
    // ===            Adding Books            ===
    // ==========================================

    // Change the default behaviour of the form submit 
    // so that it does not reload the page.
    $("#add-book-form").on("submit", function(event) {
        event.preventDefault();
        // get the content in the form.
        const title = $("#form-book-title").val(), date = $("#form-book-date").val(),
            pages = $("#form-book-pages").val();

        // get the author ids.
        const authors = $("#author-tags").find("li").map(function() {
            return getAuthorFromName(cachedAuthorNames, $(this).text().trim());
        }).get();
    
        // validate that the form content is in the right format.
        if (!validateTextFormat(["title", "date", "pages"], 
                              [title, date, pages])) {
            return false;
        }

        // send a POST request to the server to add a new row.
        /*$.ajax({
            type: "POST",
            url: "/add-book",
            data: dataString,
            success: function(res) {
                
            }
        });*/
    });
});