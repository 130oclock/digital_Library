/**
 * @jest-environment jsdom
 */

import $ from "jquery";
import { validateTitle, validateDate, validateAuthors, validateGenres, validateTotalPages } from "../public/modules/form-validation.js";

const field = $(`<div>
        <small class="error-text"></small>
    </div>`);
const error = field.find(".error-text");

describe('validateTitle()', () => {
    it('should return false if there is no title', () => {
        expect(validateTitle("", field)).toBeFalsy();
        expect(error.text()).toBe("Please add a title");
    });
    it('should return false if the title is too long', () => {
        expect(validateTitle("a scelerisque purus semper eget duis at tellus at urna condimentum mattis pellentesque id nibh tortor id aliquet lectus proin", field)).toBeFalsy();
        expect(error.text()).toBe("The title cannot be longer than 100 characters");
    });
    it('should return true if there is a title', () => {
        expect(validateTitle("Lorum ipsum", field)).toBeTruthy();
        expect(error.text()).toBe("");
    });
});

describe('validateDate()', () => {
    it('should return false if there is no date', () => {
        expect(validateDate("", field)).toBeFalsy();
        expect(error.text()).toBe("Please select the publication date");
    });
    it('should return false if the date is not formatted YYYY-MM-DD', () => {
        expect(validateDate("10/20/2020", field)).toBeFalsy();
        expect(error.text()).toBe("Date must be YYYY-MM-DD format");
    });
    it('should return true if there is a date formatted YYYY-MM-DD', () => {
        expect(validateDate("2000-06-20", field)).toBeTruthy();
        expect(error.text()).toBe("");
    });
});

describe('validateAuthors()', () => {
    it('should return false if there are no authors', () => {
        expect(validateAuthors([], field)).toBeFalsy();
        expect(error.text()).toBe("Please add at least one author");
    });
});

describe('validateGenres()', () => {
    it('should return false if there are no genres', () => {
        expect(validateGenres([], field)).toBeFalsy();
        expect(error.text()).toBe("Please add at least one genre");
    });
});

describe('validateTotalPages()', () => {
    it('should return false if there are no pages', () => {
        expect(validateTotalPages(0, field)).toBeFalsy();
        expect(error.text()).toBe("Please count the total number of pages");
    });
    it('should return false if there are more than 30,000 pages', () => {
        expect(validateTotalPages(32000, field)).toBeFalsy();
        expect(error.text()).toBe("There cannot be more than 30,000 pages in the book");
    });
    it('should return true if there are 500 pages', () => {
        expect(validateTotalPages(500, field)).toBeTruthy();
        expect(error.text()).toBe("");
    });
});