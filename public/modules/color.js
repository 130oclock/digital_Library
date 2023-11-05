/**
 * Implements the Color class and functions related to color manipulation.
 * 
 * @file  This file defines the Color class.
 * @since 0.0.1
 */

export class Color {
    #r; 
    #g;
    #b;

    constructor(r = 0, g = 0, b = 0) {
        this.#r = r;
        this.#g = g;
        this.#b = b;
    }
    
    toString() {
        return `rgb(${ this.#r },${ this.#g },${ this.#b })`;
    }

    r() {
        return this.#r;
    }

    g() {
        return this.#g;
    }

    b() {
        return this.#b;
    }

    /**
     * Blends two colors to find a mixed color between them. The {@link amount}
     * parameter defines how much to interpolate between the two colors. It is clamped
     * between 0 and 1.
     * @see Color
     * @static
     * @param {Color} color1  The first color.
     * @param {Color} color2  The second color.
     * @param {Number} amount The amount to interpolate between the two values.
     * @returns A new {@link Color}.
     */
    static lerpColor(color1, color2, amount) {
        amount = Math.max(0, Math.min(1, amount));
        let r = Math.round(color1.r() * (1 - amount) + color2.r() * amount);
        let g = Math.round(color1.g() * (1 - amount) + color2.g() * amount);
        let b = Math.round(color1.b() * (1 - amount) + color2.b() * amount);
    
        return new Color(r, g, b);
    }
}

const LIGHT_GREY = new Color(231, 231, 231);
const GREEN = new Color(138, 204, 138);
const BLUE = new Color(91, 187, 31);

/**
 * Calculates the percentage of the book that has been read and 
 * returns a color indicative of the progress.
 * @param {Number} pages     The number of pages read.
 * @param {Number} pageTotal The number of pages in the book.
 * @returns A string in the format "rgb(r, g, b)".
 */
export function getProgressColor(pages, pageTotal) {
    let percent = 0;
    if (pageTotal !== 0) percent = pages / pageTotal;
    
    return Color.lerpColor(LIGHT_GREY, GREEN, percent).toString();
}