export const clamp = (number: number | undefined, lower: number | undefined, upper: number | undefined) => {
    if (number !== undefined) {
        if (upper !== undefined) {
            number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
            number = number >= lower ? number : lower;
        }
    }
    return number;
}
