export function validateTitle(value, field) {
    if (!value) {
        field.find(".error-text").text("Please add a title");
        return false;
    }
    if(value.length > 100) {
        field.find(".error-text").text("The title cannot be longer than 100 characters");
        return false;
    }
    field.find(".error-text").text("");
    return true;
}

export function validateDate(value, field) {
    if (!value) {
        field.find(".error-text").text("Please select the publication date");
        return false;
    }
    if (!value.match(/^\d{4}-\d{2}-\d{2}/)) {
        field.find(".error-text").text("Date must be YYYY-MM-DD format");
        return false;
    }
    field.find(".error-text").text("");
    return true;
}

export function validateAuthors(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add at least one author");
        return false;
    }
    field.find(".error-text").text("");
    return true;
}

export function validateGenres(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add at least one genre");
        return false;
    }
    field.find(".error-text").text("");
    return true;
}

export function validateTotalPages(value, field) {
    if (!value) {
        field.find(".error-text").text("Please count the total number of pages");
        return false;
    }
    if (value > 30000) {
        field.find(".error-text").text("There cannot be more than 30,000 pages in the book");
        return false;
    }
    field.find(".error-text").text("");
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