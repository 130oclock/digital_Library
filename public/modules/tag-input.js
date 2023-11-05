
/**
 * Find the first object in the array that has a matching name.
 * Returns -1 if no objects are found.
 * @param {Array} list  An array of objects.
 * @param {String} name The name to search for.
 * @returns The object that 
 */
export function findItemsWithName(list, name) {
    const index = list.map(e => e.name).indexOf(name);
    if (index === -1) return -1;
    return list[index];
}

/**
 * Adds a tag with text inside of a tag input field.
 * @param {Object} tagField   The tag input field DOM element.
 * @param {string} tagContent The string to go inside the tag.
 * @returns The tag's DOM element.
 */
export function addTag(tagField, tagContent, tagId) {
    const tag = `<li data-id="${ tagId }">${ tagContent }
                    <button type="button" class="delete-button"></button>
                </li>`;
    const tagElement = $(tag);
    tagField.children("ul").append(tagElement);
    return tagElement;
}

/**
 * Find the ids of all tags in an input field.
 * @param {HTMLElement} tagField The div containing the tag input.
 * @returns An array containing the ids of the current tags.
 */
export function getTagIds(tagField) {
    return tagField.find("li").map(function() {
        let tag = $(this);
        return tag.attr("data-id");
    }).get();
}

/**
 * Removes all tags from an input field.
 * @param {HTMLElement} tagField The div containing the tags.
 */
export function removeTags(tagField) {
    tagField.find("li").remove();
}

/**
 * Handles input from a tag input element. Checks if the input text matches
 * a cached value and adds the tag if it exists.
 * @param {HTMLElement} input   The tag input element.
 * @param {Array} cachedList    The cached list of items to check against.
 * @param {Function} noMatch    The function to call when no item is found.
 * @returns 0 if it succeeds, -1 if it fails.
 */
export function tagInputHandler(input, cachedList, noMatch, validate = null) {
    const content = input.val().trim();
    const field = input.parent();

    // Check if the input exists in database.
    if (content === "") {
        field.find(".error-text").text("");
        return -1;
    }
    const match = findItemsWithName(cachedList, content);
    if (match === -1) {
        // Do something if there is no match...
        noMatch(404, field, content);
        return -1;
    }

    // Check if there is a validate function and if the content
    // passes the validation.
    if (validate && !validate(field, content)) {
       return -1;
    }
    // Clear the input.
    input.val("");
    // Check if the tag has already been added.
    if (getTagIds(field).includes(match.id.toString())) {
        return 0;
    }
    
    field.find(".error-text").text("");
    // Add the tag.
    addTag(field, content, match.id);
    return 0;
}