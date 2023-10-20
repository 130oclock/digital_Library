// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===          Initialize Book           ===
    // ==========================================


    
    // ==========================================
    // ===            Editing Books           ===
    // ==========================================
    
    // Store the content of the text field when it is focused.
    $("#book-list tbody").on("focus", "[contenteditable]", function() {
        $(this).attr("before", $(this).text());
    });

    // Send a POST request when a book's details are changed.
    $("#book-list tbody").on("keydown", "[contenteditable]", function(e) {
        // check if the 'enter' key is pressed in the focused content.
        if (e.which === 13) {
            e.preventDefault();
            let editable = $(this);
            // get the row index where the content was changed.
            let rowIndex = editable.closest("tr").data("index");
            // get the name of the column that was changed.
            let column = editable.attr("column");
            // get the text before it was edited.
            let beforeText = editable.attr("before");
            // get the text after it was edited.
            let text = editable.text();
            
            // check if the text has been changed.
            if (text !== beforeText) {
                let dataString = `column=${column}&id=${rowIndex}&text=${text}`;

                // validate that the form content is in the right format.
                if (!validateTextFormat([column], [text])) {
                    // the text does not match the correct format, 
                    // so do not send the POST request.
                    return false;
                }

                // change the color of the indicator if 
                // the number of pages read was changed.
                if (column === "page") {
                    let indicator = editable.parent();
                    let pageTotal = indicator.children().eq(1).text();
                    // update the color of the indicator.
                    indicator.css("background-color", getReadingColor(text, pageTotal))
                    // check if the book has been completed.
                    if (pageTotal !== 0 && text === pageTotal) 
                        indicator.toggleClass("read-all", true);
                    else indicator.toggleClass("read-all", false);
                    // update the number of completed books.
                    updateCompletedBookCount();
                }
                // send a POST request to server to edit the value in the database.
                $.ajax({
                    type: "POST",
                    url: "/edit-data",
                    data: dataString,
                    success: function() {
                        editable.attr("before", text).blur();
                    }
                });
            }
        }
    });
});