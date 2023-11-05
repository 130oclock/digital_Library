import { getProgressColor } from "./color.js";
import { formatDate } from "./form-validation.js";

/**
 * Generates a standardized unique ID for each row.
 * @returns A string containing the id of the row element.
 */
var __runningId = 0;
export function getRowId() {
    return `row-${ __runningId++ }`;
}

/**
 * Formats the data from a book and creates a string containing HTML.
 * @param {String} rowId The unique id generated for this row.
 * @param {Object} book The book object from the database.
 * @returns A string containing the HTML elements for a row.
 */
export function bookToRow(rowId, book) {
    let current = book.pageCurrent,
        total = book.pageTotal;
    let progress = (total !== 0 && current === total) ? "read-all" : "";
    return `
    <tr id="${ rowId }" data-index="${ book.id }">
        <td><input type="checkbox"></td>
        <td><div column="title">${ book.title }</div></td>
        <td><div column="author">${ book.authors }</div></td>
        <td><div column="genre">${ book.genres }</div></td>
        <td><div column="date">${ formatDate(book.date) }</div></td>
        <td><div column="pages" class="page-count ${ progress }" 
            style="background-color: ${ getProgressColor(current, total) }">
        <span column="page">${ current }</span> / <span column="total_pages">${ total }</span>
        </div></td>
        <td><a href="/books/${ book.id }" class="edit-btn">
            <i class='fa fa-pencil'></i>
        </a></td>
    </tr>`;
}

/**
 * Adds a row to the table for each book in the list.
 * @param {Array} books The array of book objects from the database.
 * @param {HTMLTableElement} table The table to add the rows to.
 * @param {Array} cache The cache of the book data for searching.
 */
export function addBooksToTable(books, table, cache) {
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

/**
 * Gets the trimmed text value from a cell in a row.
 * @param {Array} row    The row containing the cell.
 * @param {Number} index The index of the cell in the row.
 * @returns A string containing the text value of the cell.
 */
function getCellValue(row, index) {
    return $(row).children("td").eq(index).text().trim();
}

/**
 * Sorts the rows of a table based on the content of a specific column.
 * @param {HTMLTableElement} table The table to be sorted.
 * @param {Number} column          The index of the column to sort by.
 */
export function sortTableByColumn(table, column) {
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
 * Adds an event listener to the column headers of all tables 
 * with the .sortable-table class. Clicking on the column header
 * causes the rows to be sorted based on the content of that column.
 * @param {HTMLTableElement} table The table to sort through.
 */
export function makeTableSortable(table) {
    table.on("click", ".sortable", function() {
        const header = $(this);
        const table = header.parents("table").eq(0);
        const columnIndex = header.index();
        sortTableByColumn(table, columnIndex);
    });
}

/**
 * Adds an event listener to the search input. On input
 * check the query against the cached values of all rows in the
 * table and hide rows that do not match.
 * @param {HTMLInputElement} search The search input.
 * @param {HTMLTableElement} table  The table to search through.
 * @param {Array} cache             A cache of the rows of the table.
 */
export function makeTableSearchable(search, table, cache) {
    // When the search input is changed, hide rows that do not 
    // match all of the search terms.
    search.on("input", function() {
        // Get the search query from the input.
        const searchQuery = $(this).val().toLowerCase().trim().split(" ");
        // Check if each row contains all of the search terms.
        for (let i = 0; i < cache.length; ++i) {
            let cachedRow = cache[i];
            let row = table.find(cachedRow.id);

            if (!searchQuery.every(term => cachedRow.text.includes(term))) {
                // Hide the row if it does not contain the search term.
                row.toggleClass("hidden", true);
                continue;
            }
            // Show the row by default.
            row.toggleClass("hidden", false);
        }
    });
}

/**
 * Gets all rows with a checked box.
 * @param {HTMLTableElement} table The table to look at.
 * @returns An array of all row objects that had a checked box.
 */
export function getAllSelectedRows(table) {
    return Array.from(table.find("td").find(":checked")).map(checked => {
        return $(checked).parent().parent();
    });
}