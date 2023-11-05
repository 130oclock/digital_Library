import { Color, getProgressColor } from "../public/modules/color.js";

describe('Color', () => {
    let color1 = new Color();
    let color2 = new Color(255, 255, 255);
    it('should default r, g, b values to 0', () => {
        expect(color1.r()).toEqual(0);
        expect(color1.g()).toEqual(0);
        expect(color1.b()).toEqual(0);
    });
    it('should initialize r, g, b values properly', () => {
        expect(color2.r()).toEqual(255);
        expect(color2.g()).toEqual(255);
        expect(color2.b()).toEqual(255);
    });
    describe('toString()', () => {
        it('should return a string formatted like "rgb(r,g,b)"', () => {
            expect(color1.toString()).toBe('rgb(0,0,0)');
            expect(color2.toString()).toBe('rgb(255,255,255)');
        });
    });
    describe('lerpColor()', () => {
        let blend1 = Color.lerpColor(color1, color2, 0);
        let blend2 = Color.lerpColor(color1, color2, 1);
        let blend3 = Color.lerpColor(color1, color2, 0.5);
        it('should return the first color when amount is 0', () => {
            expect(blend1.toString()).toBe('rgb(0,0,0)');
        });
        it('should return the second color when amount is 1', () => {
            expect(blend2.toString()).toBe('rgb(255,255,255)');
        });
        it('should return the middle color when amount is 0.5', () => {
            expect(blend3.toString()).toBe('rgb(128,128,128)');
        });
    });
});

describe('getProgressColor()', () => {
    let totalPages = 300;
    it('should return grey when 0 pages are read', () => {
        expect(getProgressColor(0, totalPages).toString())
            .toBe('rgb(231,231,231)');
    });
    it('should return green when all pages are read', () => {
        expect(getProgressColor(totalPages, totalPages).toString())
            .toBe('rgb(138,204,138)');
    });
});