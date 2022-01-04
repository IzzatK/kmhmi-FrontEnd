export function convertCssTimeToMS(time_string: string) {
    let num = parseFloat(time_string),
        unit = time_string.match(/m?s/)?.toString(),
        milliseconds;

    if (unit) {
        unit = unit[0];
    }

    switch (unit) {
        case "s": // seconds
            milliseconds = num * 1000;
            break;
        case "ms": // milliseconds
            milliseconds = num;
            break;
        default:
            milliseconds = 0;
            break;
    }

    return milliseconds;
}
