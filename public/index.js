/**
 * Generates a standardized HTML id for a row.
 * @param {Number} id   The id number of the book.
 * @returns A string containing the id of the row element.
 */
function createRowID(id) {
    return "row-" + id;
}

/**
 * Generates a string containing the HTML elements for a row.
 * @param {Number} id       The id number of the book.
 * @param {String} title    The title of the book.
 * @param {String} author   The author(s) of the book.
 * @param {String} genre    The genre(s) of the book.
 * @param {String} date     The publication date of the book.
 * @returns A string containing the HTML elements for a row.
 */
function createTableRow(id, title, author, genre, date, pageNow, pageTotal) {
    return `
    <tr id="${ createRowID(id) }" data-index="${ id }">
        <td><input type="checkbox"></td>
        <td><div column="title">${   title   }</div></td>
        <td><div column="author">${  author  }</div></td>
        <td><div column="genre">${   genre   }</div></td>
        <td><div column="date">${    date    }</div></td>
        <td>
            <div column="pages" class="page-count ${ 
                (pageTotal !== 0 && pageNow === pageTotal) ? "read-all" : "" 
            }" style="background-color: ${ getReadingColor(pageNow, pageTotal) }">
            <span column="page">${ pageNow }</span> / <span column="total_pages">${ pageTotal }</span>
            </div>
        </td>
        <td><a href="/books/${ id }" class="edit-btn">
            <i class='fa fa-pencil'></i>
        </a></td>
    </tr>`;
}

/**
 * Gets the trimmed text value from a cell in a row.
 * @param {Array} row       The row containing the cell.
 * @param {Number} index    The index of the cell in the row.
 * @returns A string containing the text value of the cell.
 */
function getCellValue(row, index) {
    return $(row).children("td").eq(index).text().trim();
}

/**
 * Sorts the rows of a table based on the content of a specific column.
 * @param {HTMLTableElement} table  The table to be sorted.
 * @param {Number} column           The index of the column to sort by.
 */
function sortTableByColumn(table, column) {
    const headers = table.find("th");
    const columnHeader = headers.eq(column);
    const tableBody = table.find("tbody");
    const rows = tableBody.find("tr").toArray();
    // Check if the column is ascending or descending.
    const asc = columnHeader.hasClass("th-sort-asc");
    // Sort the rows in the table and update their order.
    rows.sort((r1, r2) => ((a, b) =>
            b.localeCompare(a)
        )(getCellValue(asc ? r1 : r2, column), 
          getCellValue(asc ? r2 : r1, column))
    ).forEach(row => tableBody.append(row));
    // Mark the sorting direction in the header's class.
    headers.removeClass("th-sort-asc th-sort-desc");
    columnHeader.toggleClass("th-sort-asc", !asc)
                .toggleClass("th-sort-desc", asc);
}

/**
 * Interpolate a percentage between two color values.
 * @param {Number} percent  The percentage between the two colors.
 * @param {Number} minR     The red value of the first color.
 * @param {Number} minG     The green value of the first color.
 * @param {Number} minB     The blue value of the first color.
 * @param {Number} maxR     The red value of the second color.
 * @param {Number} maxG     The green value of the second color.
 * @param {Number} maxB     The blue value of the second color.
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
 * Calculates the percentage of the book that has been read and 
 * returns a color indicative of the progress.
 * @param {Number} pages        The number of pages read.
 * @param {Number} pageTotal    The number of pages in the book.
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

// An array of the text in each row for faster searching.
var cachedRowText = new Array();

// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===        Table Initialization        ===
    // ==========================================

    // GET all books from the database and create a new row in the table
    // for each book.
    $.get("/books/all", (rows) => {
        var bookTable = $("#book-list");
        var rowElements = '';
        // Create a new row for each book.
        rows.forEach(row => {
            let id = row.id,
                title = row.title,
                authors = row.authors,
                genres = row.genres, 
                date = row.date.substring(0,10);
            
            rowElements += createTableRow(
                id, 
                title, 
                authors, 
                genres, 
                date, 
                row.page, 
                row.pageTotal
            );
            // Cache the id of the row and the row's text for faster searching. 
            cachedRowText.push({
                id: '#' + createRowID(id), 
                text: [title, authors, genres, date].join(' ').toLowerCase()
            });
        });
        // Append the rows to the table all at once.
        bookTable.find("tbody").append(rowElements);
        // Sort the rows by title ascending.
        sortTableByColumn(bookTable, 1);
    });

    // When the search input is changed, hide rows that do not 
    // match all of the search terms.
    $("#search-input").on("input", function() {
        // Get the search query from the input.
        const searchQuery = $(this).val().toLowerCase().trim().split(" ");
        // Check if each row contains all of the search terms.
        for (let i = 0; i < cachedRowText.length; i++) {
            let cachedRow = cachedRowText[i];
            let row = $(cachedRow.id);
            let compareText = cachedRow.text;

            if (!searchQuery.every(term => compareText.includes(term))) {
                // Hide the row if it does not contain the search term.
                row.toggleClass("hidden", true);
                continue;
            }
            // Show the row by default.
            row.toggleClass("hidden", false);
        }
    });

    // Sort the table by a column when that column's header is clicked.
    $(".sortable-table").on("click", ".sortable", function() {
        const table = $(this).parents("table").eq(0);
        const columnIndex = $(this).index();
        sortTableByColumn(table, columnIndex);
    });

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
    /*$("#delete-book-btn").on("click", function() {
        // get the indeces of the selected rows.
        const checkedRows = Array.from($("#book-list").find("td").find(":checked"))
            .map(checked => {
                let row = $(checked).parent().parent();
                let index = row.data("index");
                row.toggleClass("deleted", true);
                return index;
            });
        updateBookCount($("#book-list tbody tr").length);
        // send a POST request to mark the books as deleted.
        $.ajax({
            type: "POST",
            url: "/delete-books",
            data: { ids: checkedRows }
        });
    });*/
});