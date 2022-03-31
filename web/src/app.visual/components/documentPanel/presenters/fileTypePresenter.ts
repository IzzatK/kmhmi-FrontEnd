export function formatFileType(type: string) {
    let result = type;

    switch (type.toLowerCase()) {
        case "application/msword":
        case "application/vnd.ms-word.document.macroEnabled.12":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
        case "application/vnd.ms-word.template.macroEnabled.12":
            result = "MS Word Doc";
            break;
        case "text/html":
            result = "HTML";
            break;
        case "application/pdf":
            result = "PDF";
            break;
        case "application/vnd.ms-powerpoint.template.macroEnabled.12":
        case "application/vnd.openxmlformats-officedocument.presentationml.template":
        case "application/vnd.ms-powerpoint.addin.macroEnabled.12":
        case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
        case "application/vnd.ms-powerpoint.slideshow.macroEnabled.12":
        case "application/vnd.ms-powerpoint":
        case "application/vnd.ms-powerpoint.presentation.macroEnabled.12":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            result = "PowerPoint";
            break;
        case "application/rtf":
            result = "rtf";
            break;
        case "text/rtf":
            result = "rtf2";
            break;
        case "text/plain":
            result = "Plain Text";
            break;
        case "text/csv":
            result = "csv";
            break;
        case "application/csv":
            result = "csv1";
            break;
        case "application/json":
            result = "JSON";
            break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel.sheet.binary.macroEnabled.12":
        case "application/vnd.ms-excel":
        case "application/vnd.ms-excel.sheet.macroEnabled.12":
            result = "Excel Spreadsheet";
            break;
        case "image/bmp":
            result = "BMP";
            break;
        case "image/gif":
            result = "GIF";
            break;
        case "image/jpeg":
            result = "JPEG";
            break;
        case "image/png":
            result = "PNG";
            break;
        case "multipart/form-data":
            result = "file";
            break;
        default:
            break;
    }

    return result;
}