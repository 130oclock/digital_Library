import { colorToString, lerpColors } from "../public/modules/color.js";

test('convert r, g, b values to a CSS string', () => {
    expect(colorToString(128,200,0)).toBe("rgb(128,200,0)");
});

test('0% interpolation should return first color', () => {
    let r1 = 0, g1 = 0, b1 = 0;
    let r2 = 255, g2 = 255, b2 = 255;
    expect(lerpColors(0, r1, g1, b1, r2, g2, b2)).toBe("rgb(0,0,0)");
});

test('50% interpolation should return middle color', () => {
    let r1 = 0, g1 = 0, b1 = 0;
    let r2 = 255, g2 = 255, b2 = 255;
    expect(lerpColors(0.5, r1, g1, b1, r2, g2, b2)).toBe("rgb(128,128,128)");
});

test('100% interpolation should return second color', () => {
    let r1 = 0, g1 = 0, b1 = 0;
    let r2 = 255, g2 = 255, b2 = 255;
    expect(lerpColors(1, r1, g1, b1, r2, g2, b2)).toBe("rgb(255,255,255)");
});