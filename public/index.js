/**
 * Returns an HTML formatted string containing the book data.
 * @param {number} id The id number of the row.
 * @param {string} title The title of the book.
 * @param {string} author The author(s) of the book.
 * @param {string} genre The genre(s) of the book.
 * @param {string} date The publication date of the book.
 * @returns A Jquery.
 */
function createTableRow(id, title, author, genre, date, pageNow = 0, pageTotal = 0) {
    let row = $(`<tr class="visible" data-index="${ id }"></tr>`)
        .append($('<td><input type="checkbox"></td>'))
        .append($(`<td><div column="title" contenteditable spellcheck="false">${ title }</div></td>`))
        .append($(`<td><div column="author" contenteditable spellcheck="false">${ author }</div></td>`))
        .append($(`<td><div column="genre" contenteditable spellcheck="false">${ genre }</div></td>`))
        .append($(`<td><div column="date" contenteditable spellcheck="false">${ date }</div></td>`))
        .append($(`<td></td>`)
            .append($(`<div column="pages" class="page-count"></div>`)
                .toggleClass("read-all", (pageTotal !== 0 && pageNow === pageTotal))
                .css("background-color", getReadingColor(pageNow, pageTotal))
                .append(`<span column="page" contenteditable spellcheck="false">${ pageNow }</span> /`)
                .append(` <span column="total_pages" contenteditable spellcheck="false">${ pageTotal }</span>`)
            )  
        )
    ;
    return row;
}

/**
 * Sorts the rows of a table based on the content of a specific column.
 * @param {HTMLTableElement} table  The table to sort.
 * @param {number} column The index of the column to sort.
 * @param {boolean} asc  Determine if the sorting will be ascending.
 */
function sortTableByColumn(table, column) {
    const headers = table.find("thead th");
    const columnHeader = headers.eq(column);
    // check if the column is ascending or descending.
    const asc = !columnHeader.hasClass("th-sort-asc");

    const sortDir = asc ? 1 : -1;
    const rows = table.find("tbody tr").toArray();

    var sortedRows = rows.sort((a, b) => {
        let aText = getCellValue(a, column), bText = getCellValue(b, column);

        return aText > bText ? (1 * sortDir) : (-1 * sortDir);
    });

    for (i = 0; i < sortedRows.length; i++) {
        table.append(sortedRows[i]);
    }

    // update the column's class to match its sorting direction
    headers.removeClass("th-sort-asc th-sort-desc");
    columnHeader.toggleClass("th-sort-asc", asc)
           .toggleClass("th-sort-desc", !asc);
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

/**
 * Changes the text displaying the number of books listed.
 * @param {number} count The number of books.
 */
function updateBookCount(count) {
    $("#book-count").text(bookCount);
    document.title = document.title.replace(/\[.*?\]/, `[${ bookCount }]`);
}

/**
 * Counts the number of completed books.
 * A book is completed when all of its pages are read.
 */
function updateCompletedBookCount() {
    $("#book-complete").text($(".read-all").length);
}

/**
 * Verifies that the text content matches an accepted format.
 * @param {Array} columnTypes An array of strings representing the column type 
 * corresponding to the elements in columnContent.
 * @param {Array} columnContent An array of strings representing the text in each 
 * column that should be checked.
 * @returns A true if all checks are passed. Returns false if one fails.
 */
function validateTextFormat(columnTypes, columnContent) {
    /*let dateCheck = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (dateCheck.text($("#form-book-date").val())) {
        
    }*/
    return true;
}

/**
 * Interpolate a percentage between two color values.
 * @param {number} percent The percentage between the two colors.
 * @param {int} minR The red value of the first color.
 * @param {int} minG The green value of the first color.
 * @param {int} minB The blue value of the first color.
 * @param {int} maxR The red value of the second color.
 * @param {int} maxG The green value of the second color.
 * @param {int} maxB The blue value of the second color.
 * @returns A string in the format "rgb(r, g, b)".
 */
function assignColor(percent, minR, minG, minB, maxR, maxG, maxB) {
    if (percent > 1) percent = 1;
    let r = Math.round(minR * (1 - percent) + maxR * percent);
    let g = Math.round(minG * (1 - percent) + maxG * percent);
    let b = Math.round(minB * (1 - percent) + maxB * percent);

    return `rgb(${ r },${ g },${ b })`;
}

/**
 * Returns a color based on progress through the book.
 * @param {number} pages The number of pages read.
 * @param {number} pageTotal The number of pages in the book.
 * @returns A string in the format "rgb(r, g, b)".
 */
function getReadingColor(pages, pageTotal) {
    let minR = 231, minG = 231, minB = 231;
    let maxR = 138, maxG = 204, maxB = 138; // green color
    //let maxR = 91, maxG = 187, maxB = 231; // blue color
    let percent = 0;
    if (pageTotal !== 0) percent = pages / pageTotal;
    return assignColor(percent, minR, minG, minB, maxR, maxG, maxB);
}

// Variable declaration
var bookCount = 0;

// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===        Table Initialization        ===
    // ==========================================

    // Hide rows that do not match the search terms.
    $(".search-input").on("input", function() {
        let tableWrapper = $(this).closest(".table-wrapper");
        // get the search terms.
        const searchQuery = $(this).val().toLowerCase();
        // get the rows of the table.
        const searchableRows = Array.from(tableWrapper.find("tbody tr"));
        for (const row of searchableRows) {
            // show all cells by default.
            $(row).toggleClass("visible", true);
            if (sumCellValues(row).search(searchQuery) === -1) {
                // if the row does not contain the search query
                // collapse the row.
                $(row).toggleClass("visible", false);
            }
        }
        // scroll the table to the top of the table.
        tableWrapper.children(".table-scroll").eq(0).scrollTop(0);
    });

    // Sort a column when its header is clicked.
    $(".table-sortable thead").on("click", ".sortable", function() {
        // get the index of the column and its parent table.
        const table = $(this).parents("table").eq(0);
        const columnIndex = $(this).index();
        // sort the table by column.
        sortTableByColumn(table, columnIndex);
    });
    
    // Send a GET request for books in the database. Once the rows are received,
    // add each book to the table.
    $.get("/get-book-rows", (rows) => {
        // update the number of books listed.
        bookCount = rows.length;
        updateBookCount(bookCount);
        // create a new row for each book.
        rows.forEach(row => {
            $("#book-list tbody").append(createTableRow(
                row.id, 
                row.title, 
                row.authors, 
                row.genres, 
                row.date.substring(0,10), 
                row.page, 
                row.pageTotal
            ));
        });
        // count the number of completed books.
        updateCompletedBookCount();
        // sort the rows by title ascending.
        sortTableByColumn($("#book-list"), $("#book-list thead th").eq(1).index());
    });

    /*// Send a GET request for authors in the database.
    $.get("/get-authors", (rows) => {
        const ids = rows.map(author => author.id);
        const names = rows.map(author => author.fullName);
        console.log(ids, names);
    });*/

    // ==========================================
    // ===         Table Multi-Select         ===
    // ==========================================

    // Set all checkboxes to the same value as the header checkbox.
    $("#select_all_checkboxes").on("click", function() {
        $(this).closest("table").find("input:checkbox").not(this)
            .prop("checked", this.checked);
    });
    
    // Send the id's of each selected row 
    // when the mark_delete button is pressed.
    $("#delete-book-btn").on("click", function() {
        // get the indeces of the selected rows.
        const checkedRows = Array.from($("#book-list td").find(":checked"))
            .map(checked => {
                let row = $(checked).parent().parent();
                let index = row.data("index");
                row.remove();
                return index;
            });
        // send a POST request to mark the books as deleted.
        $.ajax({
            type: "POST",
            url: "/delete-books",
            data: { ids: checkedRows }
        });
    });
});