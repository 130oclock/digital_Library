function validateTitle(value, field) {
    if (!value) {
        field.find(".error-text").text("Please add a title");
        return false;
    }
    return true;
}

function validateDate(value, field) {
    if (!value) {
        field.find(".error-text").text("Please select a date");
        return false;
    }
    return true;
}

function validateAuthors(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add the number of pages");
        return false;
    }
    return true;
}

function validateGenres(values, field) {
    if (values.length === 0) {
        field.find(".error-text").text("Please add an author");
        return false;
    }
    return true;
}

function validateTotalPages(value, field) {
    if (!value) {
        field.find(".error-text").text("Please add a genre");
        return false;
    }
    return true;
}