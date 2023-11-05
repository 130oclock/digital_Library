import { getRowId, bookToRow, addBooksToTable } from "../public/modules/table.js";
import $ from "jquery";

test('getRowId() returns a string in format "row-#"', () => {
    for (let i = 0; i < 10; ++i) {
        expect(getRowId()).toBe("row-" + i);
    }
});

test('bookToRow() returns correctly formatted HTML', () => {
    let rowId = getRowId();
    let book = { id: 1, title: "Title", pageCurrent: 300, pageTotal: 354, date: "2023-10-23", authors: "Author 1, Author 2", genres: "Science fiction, Young adult fiction" };
    const row = bookToRow(rowId, book);
});