export function validateTitle(value, field) {
    if (!value) {
        field.find(".error-text").text("Please add a title");
        return false;
    }
    return true;
}

export function validateDate(value, field) {
    if (!value) {
        field.find(".error-text").text("Please select a date");
        return false;
    }
    return true;
}

export function validateAuthors(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add the number of pages");
        return false;
    }
    return true;
}

export function validateGenres(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add an author");
        return false;
    }
    return true;
}

export function validateTotalPages(value, field) {
    if (!value) {
        field.find(".error-text").text("Please add a genre");
        return false;
    }
    return true;
}

/**
 * Separates a full name into its components. Returns first, middle, and last names as an array.
 * If there is no middle name provided, provides an empty string.
 * @param {string} fullName The full name meant to be split.
 * @returns An array with first, middle, and last name.
 */
export function splitFullName(fullName) {
    const parts = fullName.split(" ");
    const count = parts.length;
    if (count === 3) {
        return [parts[0], parts[1], parts[2]];
    } else if (count=== 2) {
        return [parts[0], "", parts[1]];
    }
    return count;
}

export function formatDate(date) {
    return date;
}