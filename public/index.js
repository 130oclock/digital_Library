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

$(".table-sortable thead").on("click", "th", function() {
    const table = $(this).parents("table").eq(0);
    const columnIndex = $(this).index();
    const ascending = $(this).hasClass("th-sort-asc");
    // sort the table by column
    sortTableByColumn(table, columnIndex, !ascending);
    // change the column class to match its sorting
    $(this).parent().find("th").removeClass("th-sort-asc th-sort-desc");
    $(this).toggleClass("th-sort-asc", !ascending).toggleClass("th-sort-desc", ascending);
});

// add data from database to table
$.get('/books', (rows, fields) => {
    for (i = 0; i < rows.length; i++) {
        let row = rows[i];
        $('#book-list tbody').append(`<tr value="${ row.id }"><td>${ row.title }</td><td>${ row.author }</td><td>${ row.genre }</td><td>${ row.date.substring(0,10) }</td><td>000.000</td></tr>`);
    }

    $(".search-input").on("input", function() {
        const rows = $(this).parent().find("tbody tr");
        const searchIndex = 0;
        const searchableCells = Array.from(rows)
            .map(row => $(row).children("td")[searchIndex]);

        const searchQuery = $(this).val().toLowerCase();
        for (const cell of searchableCells) {
            const row = $(cell).parent();
            const value = $(cell).text().toLowerCase().replace(",", "");

            $(row).css("visibility", "visible");
            if (value.search(searchQuery) === -1) {
                $(row).css("visibility", "collapse");
            }
        }
    });
});
