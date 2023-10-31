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