import getRowId, {} from "../public/modules/table.js";

test('getRowId() returns a string in format "row-#"', () => {
    expect(getRowId()).toBe("row-0");
    expect(getRowId()).toBe("row-1");
    expect(getRowId()).toBe("row-2");
});
