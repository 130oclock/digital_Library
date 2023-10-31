import { lerpColors } from "./color.js";

/**
 * Generates a standardized HTML id for a row.
 * @param {Number} id The id number of the book.
 * @returns A string containing the id of the row element.
 */
export function createRowID(id) {
    return "row-" + id;
}

/**
 * Calculates the percentage of the book that has been read and 
 * returns a color indicative of the progress.
 * @param {Number} pages     The number of pages read.
 * @param {Number} pageTotal The number of pages in the book.
 * @returns A string in the format "rgb(r, g, b)".
 */
function getReadingColor(pages, pageTotal) {
    let r1 = 231, g1 = 231, b1 = 231;
    let r2 = 138, g2 = 204, b2 = 138; // green color
    //let r2 = 91, g2 = 187, b2 = 231; // blue color
    let percent = 0;
    if (pageTotal !== 0) percent = pages / pageTotal;
    return lerpColors(percent, r1, g1, b1, r2, g2, b2);
}

/**
 * Generates a string containing the HTML elements for a row.
 * @param {Number} id     The id number of the book.
 * @param {String} title  The title of the book.
 * @param {String} author The author(s) of the book.
 * @param {String} genre  The genre(s) of the book.
 * @param {String} date   The publication date of the book.
 * @returns A string containing the HTML elements for a row.
 */
export function createTableRow(id, title, author, genre, date, pageNow, pageTotal) {
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