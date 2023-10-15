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

/**
 * Returns an HTML formatted string containing the book data.
 * @param {number} id The id number of the row.
 * @param {string} title The title of the book.
 * @param {string} author The author(s) of the book.
 * @param {string} genre The genre(s) of the book.
 * @param {string} date The publication date of the book.
 * @returns A Jquery.
 */
function createTableRow(id, title, author, genre, date, page_now = 0, page_total = 0) {
    let row = $(`<tr data-index="${ id }"></tr>`)
        .append($('<td><input type="checkbox"></td>'))
        .append($(`<td><div column="title" contenteditable spellcheck="false">${ title }</div></td>`))
        .append($(`<td><div column="author" contenteditable spellcheck="false">${ author }</div></td>`))
        .append($(`<td><div column="genre" contenteditable spellcheck="false">${ genre }</div></td>`))
        .append($(`<td><div column="date" contenteditable spellcheck="false">${ date }</div></td>`))
        .append($(`<td></td>`)
            .append($(`<div column="pages"></div>`)
                .toggleClass("read-all", (page_total !== 0 && page_now === page_total))
                .append(`<span column="page" contenteditable spellcheck="false">${ page_now }</span> /`)
                .append(` <span column="total_pages" contenteditable spellcheck="false">${ page_total }</span>`)
            )  
        )
    ;
    return row;
}

/**
 * Verifies that the text content matches an accepted format.
 * @param {Array} columnTypes An array of strings representing the column type 
 * corresponding to the elements in columnContent.
 * @param {Array} columnContent An array of strings representing the text in each 
 * column that should be checked.
 * @returns A true if all checks are passed. Returns false if one fails.
 */
function verifyTextFormat(columnTypes, columnContent) {
    /*let dateCheck = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (dateCheck.text($("#form-book-date").val())) {
        
    }*/
    return true;
}

/**
 * Maps an integer value to a color value.
 * @param {number} n The level of the color.
 * @returns A string containing the color information.
 */
function assignColor(intVal) {
    let minR = 231, minG = 231, minB = 231;
    let maxR = 91, maxG = 187, maxB = 231;
    let percent = intVal / 200;
    if (percent > 1) percent = 1;
    let r = Math.round(minR * (1 - percent) + maxR * percent);
    let g = Math.round(minG * (1 - percent) + maxG * percent);
    let b = Math.round(minB * (1 - percent) + maxB * percent);

    return `rgb(${ r },${ g },${ b })`;
}

function randomLevels() {
    $("#reading-map div").each(function() {
        $(this).data("level", Math.random() * 200 | 0);
    });
}

function updateHeatMapLevels() {
    $(".reading-table div").each(function() {
        let cell = $(this);
        cell.css("background-color", assignColor(cell.data("level")));
        cell.children("span").eq(0).text(`${cell.data("level")} pages read`);
    });
}

var bookCount = 0;

// Run once the document has loaded all html elements.
$(function() {
    /*const COLUMN = 7;
    for (i = 0; i < 26; i++) {
        let rowString = "";
        for(j = 0; j < COLUMN; j++) {
            let level = 0;
            rowString += `<td><div data-index="${ j + (COLUMN * i) }" 
                data-level="${ level }"><span class="tooltiptext"></span></div></td>`;
        }
        $("#reading-map").append(`<tr>${ rowString }</tr>`);
    }
    updateHeatMapLevels();*/

    // Add an event listener to sort a column when its header is clicked.
    $(".table-sortable thead").on("click", ".sortable", function() {
        const table = $(this).parents("table").eq(0);
        const columnIndex = $(this).index();
        const ascending = $(this).hasClass("th-sort-asc");
        // sort the table by column
        sortTableByColumn(table, columnIndex, !ascending);
        // change the column class to match its sorting
        $(this).parent().find(".sortable").removeClass("th-sort-asc th-sort-desc");
        $(this).toggleClass("th-sort-asc", !ascending)
               .toggleClass("th-sort-desc", ascending);
    });

    // Add an event listener to set all checkboxes to the same value as the header checkbox.
    $("#select_all_checkboxes").on("click", function() {
        $(this).closest("table").find("input:checkbox").not(this)
            .prop("checked", this.checked);
    });
    
    // Send a GET request for books in the database. Once the rows are received,
    // add each book to the table.
    $.get("/books", (rows) => {
        bookCount = rows.length + 1;
        $("#book-count").text(bookCount);
        document.title = document.title.replace(/\[.*?\]/, `[${ bookCount }]`);
        for (i = 0; i < rows.length; i++) {
            let row = rows[i];
            $("#book-list tbody").append(createTableRow(row.id, row.title, 
                row.author, row.genre, row.date.substring(0,10), row.page, row.total_pages));
        }
    
        // Sort by title ascending once the table has data.
        sortTableByColumn($("#book-list"), $("#book-list thead .sortable").eq(0).index());
        $("#book-list thead .sortable").eq(0).toggleClass("th-sort-asc", true);
    });

    // Add an event listener to hide rows that do not match the searched content.
    $(".search-input").on("input", function() {
        $(this).parent().parent().find(".table-scroll").eq(0).scrollTop(0);
        const tableRows = $(this).parent().parent().find("tbody tr");
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

    // Add an event listener to store the content of the text field when it is focused.
    $("#book-list tbody").on("focus", "[contenteditable]", function() {
        $(this).attr("before", $(this).text());
    });

    // Send a POST request when a book's details are changed.
    $("#book-list tbody").on("keydown", "[contenteditable]", function(e) {
        // Check if the 'enter' key is pressed and check if the text has been changed.
        if (e.which === 13) {
            e.preventDefault();
            let content = $(this);
            let i = content.closest("tr").data("index");
            let column = content.attr("column")
            let before = content.attr("before");
            let text = content.text();
            if (text !== before) {
                let dataString = `column=${column}&id=${i}&text=${text}`;

                if (!verifyTextFormat([column], [text])) {
                    // the text does not match the correct format, 
                    // so do not send the POST request.
                    return false;
                }

                if (column === "page") {
                    let page_total = content.parent().children().eq(1).text();
                    if (page_total !== 0 && text === page_total) 
                        content.parent().toggleClass("read-all", true);
                    else content.parent().toggleClass("read-all", false);
                }
                // Send a POST request to server to change the value in the database.
                $.ajax({
                    type: "POST",
                    url: "/edit-book",
                    data: dataString,
                    success: function() {
                        content.attr("before", text).blur();
                    }
                });
            }
        }
    });
    
    // Add an event listener to handle toggling the menu for adding books.
    $("#add-book-btn").on("click", function() {
        $("#add-book-form-popup").toggleClass("popup-hidden");
        $("#book-list-scroll").toggleClass("table-scroll-short");
    });
    
    // Change the default behaviour of the form submit so that it does not reload the page.
    $("#add-book-form").on("submit", function(e) {
        e.preventDefault();
        let dataString = $(this).serializeArray();

        let title = $("#form-book-title").val(), author = $("#form-book-author").val(),
            genre = $("#form-book-genre").val(), date = $("#form-book-date").val(),
            pages = $("#form-book-pages").val();
    
        // form data validation
        if (!verifyTextFormat(["title", "author", "genre", "date", "pages"], 
                              [title, author, genre, date, pages])) {
            return false;
        }
    
        $.ajax({
            type: "POST",
            url: "/add-book",
            data: dataString,
            success: function(res) {
                $("#book-list tbody").prepend(
                    createTableRow(res.id, title, author, genre, date, 0, pages)
                );
                $(".table-scroll").eq(0).scrollTop(0);
                $("#book-count").text(++bookCount);
                document.title = document.title.replace(/\[.*?\]/, `[${ bookCount }]`);
                $("#add-book-form")[0].reset();
            },
            dataType: "json"
        });
    });

    // Add an event listener to send the id's of each selected row 
    // when the mark_delete button is pressed.
    $("#delete-book-btn").on("click", function() {
        const checkedRows = Array.from($("#book-list td").find(":checked"))
            .map(checked => {
                let row = $(checked).parent().parent();
                let index = row.data("index");
                row.remove();
                return index;
            });
        $.ajax({
            type: "POST",
            url: "/delete-books",
            data: { ids: checkedRows }
        });
    });
});