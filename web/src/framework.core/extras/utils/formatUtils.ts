export function JSONtoXML(obj: any) {
    let xml = '';
    for (const prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (const array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += JSONtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += JSONtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]+>/g, '');
    return xml
}

function XMLtoJSON(obj: any) {
    // take that future developer!
    return null;
}
