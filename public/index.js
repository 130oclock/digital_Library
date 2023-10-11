/**
 * Sorts the rows of a table based on the content of a specific column.
 * @param {HTMLTableElement} table  The table to sort.
 * @param {number} column The index of the column to sort.
 * @param {boolean} asc  Determine if the sorting will be ascending.
 */
function sortTableByColumn(table, column, asc = true) {
    const sortDir = asc ? 1 : -1;
    const rows = table.find("tr").slice(1).toArray();

    var sortedRows = rows.sort((a, b) => {
        let aText = getCellValue(a, column), bText = getCellValue(b, column);

        return aText > bText ? (1 * sortDir) : (-1 * sortDir);
    });

    for (i = 0; i < sortedRows.length; i++) {
        table.append(sortedRows[i]);
    }
}

/**
 * Returns the text value within a table cell.
 * @param {Array} row The row containing the cell.
 * @param {number} index The index of the cell in the row.
 * @returns A string containing the text value of the cell.
 */
function getCellValue(row, index) {
    return $(row).children("td").eq(index).text().trim();
}

/**
 * Returns a string that contains the text from all cells in the row.
 * @param {Array} row The row to sum.
 * @returns A string cintaining the text value of all cells.
 */
function sumCellValues(row) {
    const cells = Array.from($(row).children("td"))
        .map(cell => $(cell).text().toLowerCase().replace(",", ""));
    return cells.join();
}

// run once the document is ready
$(function() {
    $(".table-sortable thead").on("click", "th", function() {
        const table = $(this).parents("table").eq(0);
        const columnIndex = $(this).index();
        const ascending = $(this).hasClass("th-sort-asc");
        // sort the table by column
        sortTableByColumn(table, columnIndex, !ascending);
        // change the column class to match its sorting
        $(this).parent().find("th").removeClass("th-sort-asc th-sort-desc");
        $(this).toggleClass("th-sort-asc", !ascending)
               .toggleClass("th-sort-desc", ascending);
    });
    
    // on page load, get books from the database
    // add each book to the table
    $.get('/books', (rows, fields) => {
        $("#book-count").text(rows.length);
        for (i = 0; i < rows.length; i++) {
            let row = rows[i];
            $('#book-list tbody').append(`<tr value="${ row.id }">
                                          <td><div contenteditable spellcheck="false">${ row.title }</div></td>
                                          <td><div contenteditable spellcheck="false">${ row.author }</div></td>
                                          <td><div contenteditable spellcheck="false">${ row.genre }</div></td>
                                          <td><div contenteditable spellcheck="false">${ row.date.substring(0,10) }</div></td>
                                          </tr>`);
        }
    
        $(".search-input").on("input", function() {
            $(this).parent().find(".table-scroll").eq(0).scrollTop(0);
            const tableRows = $(this).parent().find("tbody tr");
            //const searchIndex = parseInt($(this).parent().find("select").val());
            const searchableRows = Array.from(tableRows);
    
            const searchQuery = $(this).val().toLowerCase();
            for (const row of searchableRows) {
                // show all cells by default
                $(row).css("visibility", "visible");
                if (sumCellValues(row).search(searchQuery) === -1) {
                    // if the row does not contain the search query
                    // collapse the row
                    $(row).css("visibility", "collapse");
                }
            }
        });
    
        // Sort by title ascending once the table has data
        sortTableByColumn($("#book-list"), 0);
        $("#book-list thead th").eq(0).toggleClass("th-sort-asc", true);
    });
    
    // add an event listener to handle toggling the menu for adding books
    $("#add-book-btn").on("click", function() {
        $("#add-book-form-popup").toggleClass("popup-hidden");
        $("#book-list-scroll").toggleClass("table-scroll-short");
    });
    
    $("#add-book-form").on("submit", function(e) {
        e.preventDefault();
        let dataString = $(this).serializeArray();
    
        // form data validation
        /*let dateCheck = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        if (dateCheck.text($("#form-book-date").val())) {
            
        }*/
    
        $.ajax({
            type: "POST",
            url: "/add-book",
            data: dataString,
            success: function() {
                let bookCount = parseInt($("#book-count").text());
    
                $('#book-list tbody').append(`<tr value="${ bookCount }">
                                            <td><div contenteditable spellcheck="false">${ $("#form-book-title").val() }</div></td>
                                            <td><div contenteditable spellcheck="false">${ $("#form-book-author").val() }</div></td>
                                            <td><div contenteditable spellcheck="false">${ $("#form-book-genre").val() }</div></td>
                                            <td><div contenteditable spellcheck="false">${ $("#form-book-date").val() }</div></td>
                                            </tr>`);
                
                $("#book-count").text(bookCount + 1);
            }
        });
    });
});