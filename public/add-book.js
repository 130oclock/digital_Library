/**
 * Finds the author's id from a list of authors.
 * @param {Array} authors An array of authors.
 * @param {string} name The author name to search for.
 * @returns The id of the author in the array that matches the name.
 */
function getAuthorFromName(authors, name) {
    const index = authors.map(e => e.fullName).indexOf(name);
    if (index === -1) return -1;
    return authors[index];
}

var cachedAuthorNames = new Array();

// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===                Tags                ===
    // ==========================================

    $(".tags-input").on("keydown", "input", function(event) {
        const input = $(this);
        const code = event.keyCode || event.which;
        if (code == 13) {
            event.preventDefault();
            const tagContent = input.val().trim();
            if (tagContent === "") return;

            const tag = `<li>${ tagContent }
                        <button class="delete-button"></button>
                        </li>`;
            input.parent().children("ul").append(tag);
            input.val("");
        }
    });

    $(".tags-input").on("click", ".delete-button", function(event) {
        event.target.parentNode.remove();
    });

    // ==========================================
    // ===          Compare Authors           ===
    // ==========================================

    // Send a GET request for authors in the database.
    $.get("/authors/all", (rows) => {
        let authorList = "";
        rows.forEach(row => {
            authorList += `<option value="${ row.fullName }">`;
        });
        cachedAuthorNames = rows;
        $("#authors-list").append(authorList);
    });

    // ==========================================
    // ===           Compare Genres           ===
    // ==========================================



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