import { addBooksToTable, sortTableByColumn, makeTableSortable, makeTableSearchable, getAllSelectedRows } from "./modules/table.js";

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