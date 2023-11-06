import getRowId, { sortTableByColumn, makeTableSortable, makeTableSearchable, getAllSelectedRows } from "./modules/table.js";
import Color from "./modules/color.js";
import { formatDate } from "./modules/form-validation.js";

/**
 * Calculates the percentage of the book that has been read and 
 * returns a color indicative of the progress.
 * @param {Number} pages     The number of pages read.
 * @param {Number} pageTotal The number of pages in the book.
 * @returns A string in the format "rgb(r, g, b)".
 */
export function getProgressColor(pages, pageTotal) {
    let percent = 0;
    if (pageTotal !== 0) percent = pages / pageTotal;
    
    return Color.lerpColor(Color.LIGHT_GREY, Color.GREEN, percent).toString();
}

/**
 * Formats the data from a book and creates a string containing HTML.
 * @param {String} rowId The unique id generated for this row.
 * @param {Object} book  A book object.
 * @returns A string containing the HTML elements for a row.
 */
function bookToRow(rowId, book) {
    let current  = book.pageCurrent,
        total    = book.pageTotal,
        progress = (total !== 0 && current === total) ? "read-all" : "";
    let rowHTML  = 
    `<tr id="${ rowId }" index="${ book.id }">
        <td><div column="input"><input type="checkbox"></div></td>
        <td><div column="title">${ book.title }</div></td>
        <td><div column="author">${ book.authors }</div></td>
        <td><div column="genre">${ book.genres }</div></td>
        <td><div column="date">${ formatDate(book.date) }</div></td>
        <td>
            <div column="pages" class="page-count ${ progress }" style="background-color: ${ getProgressColor(current, total) }">
                <span column="page">${ current }</span> / <span column="total_pages">${ total }</span>
            </div>
        </td>
        <td>
            <div column="edit">
                <a href="/books/${ book.id }" class="edit-btn">
                    <i class='fa fa-pencil'></i>
                </a>
            </div>
        </td>
    </tr>`;
    return rowHTML;
}

/**
 * Adds a row to the table for each book in the list.
 * @param {Array} books            An array of book objects.
 * @param {HTMLTableElement} table The table to add the rows to.
 * @param {Array} cache            A cache for the book data.
 */
function addBooksToTable(books, table, cache) {
    let rowElements = "";

    books.forEach(book => {
        let rowId = getRowId();
        rowElements += bookToRow(rowId, book);
        cache.push({
            id: '#' + rowId, 
            text: [book.title, book.authors, book.genres].join(' ').toLowerCase()
        });
    });
    // Append the rows to the table all at once.
    table.find("tbody").append(rowElements);
}

// An array of the text in each row for faster searching.
var cachedRowText = new Array();

// Run once the document has loaded all html elements.
$(function() {
    const BOOK_TABLE = $("#book-list");
    
    makeTableSortable(BOOK_TABLE);
    makeTableSearchable($("#search-input"), BOOK_TABLE, cachedRowText);

    // Create a new row for each book in the database.
    $.get("/books/all", (books) => {
        addBooksToTable(books, BOOK_TABLE, cachedRowText);
        // Sort the rows by title ascending.
        sortTableByColumn(BOOK_TABLE, 1);
    });

    // Set all checkboxes to the same value as the header checkbox.
    $("#select_all_checkboxes").on("click", function() {
        $(this).closest("table").find("input:checkbox").not(this)
            .prop("checked", this.checked);
    });
    
    $("#delete-book-btn").on("click", function() {
        const checkedRows = getAllSelectedRows(BOOK_TABLE);
        checkedRows.forEach(row => {
            row.toggleClass("hidden", true);
        });
    });
});