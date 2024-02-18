export function LabToRgb(lab: string) {
    let labSplit = lab.split(',');
    let L = Number(labSplit[0].trim());
    let A = Number(labSplit[1].trim());
    let B = Number(labSplit[2].trim());

    let y = (L * 1 + 16) / 116;
    let x = A / 500 + y;
    let Z = y - B / 200;

    let modelValue = 0.008856;

    if ((y ** 3) > modelValue)
        y = y ** 3;
    else
        y = (y - 16 / 116) / 7.787;

    if ((x ** 3) > modelValue)
        x = x ** 3;
    else
        x = (x - 16 / 116) / 7.787;

    if ((Z ** 3) > modelValue)
        Z = Z ** 3;
    else
        Z = (Z - 16 / 116) / 7.787;

    x = x * 0.95047;
    y = y * 1.0;
    Z = Z * 1.08883;

    let r = x * 3.2406 + y * -1.5372 + Z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + Z * 0.0415;
    let b = x * 0.0557 + y * -0.204 + Z * 1.057;

    if (r > 0.0031308)
        r = 1.055 * (r ** (1 / 2.4)) - 0.055;
    else
        r = 12.92 * r;

    if (g > 0.0031308)
        g = 1.055 * (g ** (1 / 2.4)) - 0.055
    else
        g = 12.92 * g

    if (b > 0.0031308)
        b = 1.055 * (b ** (1 / 2.4)) - 0.055
    else
        b = 12.92 * b

    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)

    if (r < 0) r = 0
    if (r > 255) r = 255
    if (g < 0) g = 0
    if (g > 255) g = 255
    if (b < 0) b = 0
    if (b > 255) b = 255

    return [r, g, b].join(',');
}