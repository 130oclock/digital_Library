import { createRowID, createTableRow, sortTableByColumn } from "./modules/book-table.js";

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