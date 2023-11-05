import { validateTitle, validateDate, validateTotalPages, 
    validateAuthors, validateGenres, splitFullName } from "./modules/form-validation.js";
import { getTagIds, removeTags, tagInputHandler } from "./modules/tag-input.js";

var cachedAuthorNames = new Array();
var cachedGenreNames = new Array();

// Run once the document has loaded all html elements.
$(function() {
    // Send a GET request for authors in the database.
    $.get("/authors/all", (authors) => {
        let authorList = "";
        authors.forEach(row => {
            authorList += `<option value="${ row.name }">`;
        });
        cachedAuthorNames = authors;
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

    const authorError = function(error, field, content) {
        switch(error) {
            case 404: // Check if they want to add a new author.
                field.find(".error-text").text(`"${ content }" is not a known author`);
                break;
        }
    };

    const authorValid = function(field, content) {
        let name = splitFullName(content);
        if (name < 2) {
            field.find(".error-text").text("Must include at least first and last name");
            return false;
        } else if (name > 3) {
            field.find(".error-text").text("Cannot search for more than one name at a time");
            return false;
        }
        return true;
    };

    $("#author-tags").on("keydown", "input", function(event) {
        const code = event.keyCode || event.which;
        if (code == 13) {
            event.preventDefault();
            const input = $(this);
            tagInputHandler(input, cachedAuthorNames, authorError, authorValid);
        }
    }).on("blur", "input", function(event) {
        const input = $(this);
        tagInputHandler(input, cachedAuthorNames, authorError, authorValid);
    });

    /*$("#author-tags-input").on("keydown", "input", function(event) {
        const input = $(this);
        const code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            // get elements.
            const tagContent = input.val().trim();
            const tagField = input.parent();
            const alert = tagField.find(".alert-text");
            // check if the author exists in database.
            if (tagContent === "") return;
            if (findItemsWithName(cachedAuthorNames, tagContent) === -1) {
                // check the format of the author name.
                let name = splitFullName(tagContent);
                if (name < 2) {
                    alert.text("ERROR: Must include at least first and last name.");
                    return;
                } else if (name > 3) {
                    alert.text("ERROR: Cannot search for more than one name at a time.");
                    return;
                }
                // notify that the author does not match.
                alert.text("ALERT: This is not a known author. Try again or add a new author.");
                $("#new-authors").find("input").each(function(index) {
                    $(this).val(name[index]);
                }).end().toggleClass("hidden", false);
                return;
            }
            // clear the inputs and add the tag.
            alert.text("");
            input.val("");
            addTag(tagField, tagContent);
        }
    });

    $("#hide-new-author").on("click", function(event) {
        event.preventDefault();
        const tagField = $("#author-tags-input");

        $("#new-authors").toggleClass("hidden", true);
        tagField.find("input").val("");
        tagField.find(".alert-text").text("");
    });

    $("#add-new-author").on("click", function(event) {
        event.preventDefault();
        const first = $("#new-author-first").val().trim(), 
              middle = $("#new-author-middle").val().trim(), 
              last = $("#new-author-last").val().trim();
        const tagContent = [first, middle, last].join(" ");
        const tagField = $("#author-tags-input");

        $("#new-authors").toggleClass("hidden", true);
        tagField.find("input").val("");
        tagField.find(".alert-text").text("");
        let tag = addTag(tagField, tagContent);
        tag.addClass("is-new")
           .data("first", first)
           .data("middle", middle)
           .data("last", last);
    });*/

    const genreError = function(error, field, content) {
        switch(error) {
            case 404: // Add an error message.
                field.find(".error-text").text(`"${ content }" is not a valid genre`);
                break;
        }
    };

    $("#genre-tags").on("keydown", "input", function(event) {
        const code = event.keyCode || event.which;
        if (code == 13) {
            event.preventDefault();
            const input = $(this);
            tagInputHandler(input, cachedGenreNames, genreError);
        }
    }).on("blur", "input", function(event) {
        const input = $(this);
        tagInputHandler(input, cachedGenreNames, genreError);
    });

    $(".tag-input").on("click", ".delete-button", function(event) {
        event.target.parentNode.remove();
    });

    // ==========================================
    // ===            Adding Books            ===
    // ==========================================

    // Change the default behaviour of the form submit 
    // so that it does not reload the page.
    $("#add-book-form").on("submit", function(event) {
        event.preventDefault();
        // Get the content from the form.
        const title = $("#title").val().trim(), 
              date = $("#date").val().trim(),
              totalPages = $("#pages").val().trim(),
              authors = getTagIds($("#author-tags")),
              genres = getTagIds($("#genre-tags"));
        const form = $(this);
        form.find(".error-text").text("");
        let valid = true;
        if (!validateTitle(title, $("#title").parent()))
            valid = false;
        if (!validateDate(date, $("#date").parent()))
            valid = false;
        if (!validateTotalPages(totalPages, $("#pages").parent()))
            valid = false;
        if (!validateAuthors(authors, $("#author-tags")))
            valid = false;
        if (!validateGenres(genres, $("#genre-tags")))
            valid = false;

        if (!valid) {
            console.log("invalid form");
            return;
        }

        const dataString = `title=${ title }&date=${ date }&totalPages=${ totalPages }&` +
                `authors=[${ authors.toString() }]&genres=[${ genres.toString() }]`;
        console.log(dataString);
        /*
        // send a POST request to the server to add a new row.
        $.ajax({
            type: "POST",
            url: "/add-book",
            data: dataString,
            success: function(res) {
                if (typeof res.redirect === 'string')
                    window.location = res.redirect;
            },
            dataType: 'json' 
        });*/
    });
});