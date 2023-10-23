/**
 * Creates a string to be used as an id for row elements in a table.
 * @param {number} id The id of the book.
 * @returns An id for the row element.
 */
function createRowID(id) {
    return "row-" + id;
}

/**
 * Returns an HTML formatted string containing the book data.
 * @param {number} id The id number of the row.
 * @param {string} title The title of the book.
 * @param {string} author The author(s) of the book.
 * @param {string} genre The genre(s) of the book.
 * @param {string} date The publication date of the book.
 * @returns A string containing the HTML of a row.
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
        <td><i class='fa fa-pencil'></i></td>
    </tr>`;
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
 * Sorts the rows of a table based on the content of a specific column.
 * @param {HTMLTableElement} table  The table to sort.
 * @param {number} column The index of the column to sort.
 * @param {boolean} asc  Determine if the sorting will be ascending.
 */
function sortTableByColumn(table, column) {
    const tableBody = table.find("tbody");
    const headers = table.find("th");
    const columnHeader = headers.eq(column);
    // check if the column is ascending or descending.
    const asc = columnHeader.hasClass("th-sort-asc");
    const rows = tableBody.find("tr").toArray();

    var sortedRows = rows.sort((r1, r2) => ((a, b) =>
            b.localeCompare(a)
        )(getCellValue(asc ? r1 : r2, column), 
          getCellValue(asc ? r2 : r1, column))
    ).forEach(row => tableBody.append(row));

    // update the column's class to match its sorting direction
    headers.removeClass("th-sort-asc th-sort-desc");
    columnHeader.toggleClass("th-sort-asc", !asc)
                .toggleClass("th-sort-desc", asc);
}

/**
 * Changes the text displaying the number of books listed.
 * @param {number} count The number of books.
 */
function updateBookCount(count) {
    $("#book-count").text(count);
    document.title = document.title.replace(/\[.*?\]/, `[${ count }]`);
}

/**
 * Counts the number of completed books.
 * A book is completed when all of its pages are read.
 */
function updateCompletedBookCount() {
    $("#book-complete").text($(".read-all").length);
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

var cachedRowText = new Array();

// Run once the document has loaded all html elements.
$(function() {
    // ==========================================
    // ===        Table Initialization        ===
    // ==========================================

    // Send a GET request for books in the database. Once the rows are received,
    // add each book to the table.
    $.get("/books/all", (rows) => {
        var bookTable = $("#book-list");
        var rowElements = '';
        // generate a cached list of search terms.
        let rowLength = rows.length;
        // create a new row for each book.
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

            cachedRowText.push({
                id: '#' + createRowID(id), 
                text: [title, authors, genres, date].join(' ').toLowerCase()
            });
        });
        bookTable.find("tbody").append(rowElements);
        // sort the rows by title ascending.
        sortTableByColumn(bookTable, 1);
        // update the number of books listed.
        updateBookCount(rows.length);
        updateCompletedBookCount();
    });

    // Hide rows that do not match the search terms.
    $("#search-input").on("input", function() {
        // get the search query.
        const searchQuery = $(this).val().toLowerCase().split(" ").filter(i => i);

        for (let i = 0; i < cachedRowText.length; i++) {
            let cachedRow = cachedRowText[i];
            let row = $(cachedRow.id);
            let compareText = cachedRow.text;

            if (!searchQuery.every(term => compareText.includes(term))) {
                // hide if the row does not contain the search query.
                row.toggleClass("hidden", true);
                continue;
            }
            // show rows by default.
            row.toggleClass("hidden", false);
        }
    });

    // Sort a column when its header is clicked.
    $(".sortable-table").on("click", ".sortable", function() {
        // get the index of the column and its parent table.
        const table = $(this).parents("table").eq(0);
        const columnIndex = $(this).index();
        // sort the table by column.
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