export const getFormattedSize = (bytes: number) => {
    let result = bytes + " bytes";
    let tmpSize = bytes;

    if (tmpSize > 1024) {
        tmpSize = tmpSize / 1024;
        result = tmpSize.toFixed(1) + " KB";
    }

    if (tmpSize > 1024) {
        tmpSize = tmpSize / 1024;
        result = tmpSize.toFixed(1) + " MB";
    }

    if (tmpSize > 1024) {
        tmpSize = tmpSize / 1024;
        result = tmpSize.toFixed(1) + " GB";
    }

    return result;
}
