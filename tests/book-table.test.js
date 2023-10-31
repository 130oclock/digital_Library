import { createRowID, createTableRow, sortTableByColumn } from "../public/modules/book-table.js";

test('create a standard row id', () => {
    expect(createRowID(15)).toBe("row-15");
});