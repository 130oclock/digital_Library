// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===          Compare Authors           ===
    // ==========================================

    /*
    // Send a GET request for authors in the database.
    $.get("/authors/all", (rows) => {
        const ids = rows.map(author => author.id);
        const names = rows.map(author => author.fullName);
        console.log(ids, names);
    });*/

    // ==========================================
    // ===           Compare Genres           ===
    // ==========================================



    // ==========================================
    // ===            Adding Books            ===
    // ==========================================

    /*
    // Change the default behaviour of the form submit 
    // so that it does not reload the page.
    $("#add-book-form").on("submit", function(e) {
        e.preventDefault();
        // get the content in the form.
        let dataString = $(this).serializeArray();
        let title = $("#form-book-title").val(), author = $("#form-book-author").val(),
            genre = $("#form-book-genre").val(), date = $("#form-book-date").val(),
            pages = $("#form-book-pages").val();
    
        // validate that the form content is in the right format.
        if (!validateTextFormat(["title", "author", "genre", "date", "pages"], 
                              [title, author, genre, date, pages])) {
            return false;
        }
        // send a POST request to the server to add a new row.
        $.ajax({
            type: "POST",
            url: "/add-book",
            data: dataString,
            success: function(res) {
                // get the real index of the row from the database and add a row.
                $("#book-list tbody").prepend(
                    createTableRow(res.id, title, author, genre, date, 0, pages)
                );
                updateBookCount(++bookCount);
                // scroll to the top of the table.
                $(".table-scroll").eq(0).scrollTop(0);
                // reset the form.
                $("#add-book-form")[0].reset();
            },
            dataType: "json"
        });
    });*/
});