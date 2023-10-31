// color.js
/**
 * Converts r, g, b values into a CSS color string.
 * @param {Number} r The red value.
 * @param {Number} g The green value.
 * @param {Number} b The blue value.
 * @returns A string in the format "rgb(r, g, b)".
 */
export function colorToString(r, g, b) {
    return `rgb(${ r },${ g },${ b })`;
}

/**
 * Interpolate a percentage between two color values.
 * @param {Number} percent The percentage between the two colors.
 * @param {Number} r1      The red value of the first color.
 * @param {Number} g1      The green value of the first color.
 * @param {Number} b1      The blue value of the first color.
 * @param {Number} r2      The red value of the second color.
 * @param {Number} g2      The green value of the second color.
 * @param {Number} b2      The blue value of the second color.
 * @returns A string in the format "rgb(r, g, b)".
 */
export function lerpColors(percent, r1, g1, b1, r2, g2, b2) {
    if (percent > 1) percent = 1;
    let r = Math.round(r1 * (1 - percent) + r2 * percent);
    let g = Math.round(g1 * (1 - percent) + g2 * percent);
    let b = Math.round(b1 * (1 - percent) + b2 * percent);

    return colorToString(r, g, b);
}