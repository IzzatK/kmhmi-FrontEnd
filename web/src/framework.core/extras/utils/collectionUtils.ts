export const convertArrayToObject = (array: any[], key: string | number) => {
    const initialValue = {};
    let result = {};
    if (array && array.length > 0) {
        result = array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: {
                    id: item[key],
                    ...item
                },
            };
        }, initialValue);
    }
    return result;
};

export const convertObjectToArray = (object: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    let result: unknown[] = [];

    if (object) {
        result = Object.values(object);
    }

    return result;
};

export const convertObjectToKeyObject = (object: { [s: string]: any; } | ArrayLike<any>) => {
    let result: any[] = [];

    if (object) {
        result = Object.values(object);
    }

    return result;
};

export function forEach(items: any, consumer: any) {
    if (items) {
        let itemKeys = Object.keys(items), itemsLength = itemKeys.length;
        for (let index = 0; index < itemsLength; index++) {
            let key = itemKeys[index];
            let value = items[key];

            let result = consumer(value);
            if (result) {
                break;
            }
        }
    }
}

// Need to consolidate into other for each, but not right now
export const forEachKVP = (items: Record<string, any>, consumer: any) => {
    let itemKeys = Object.keys(items), itemsLength = itemKeys.length;
    for (let index = 0; index < itemsLength; index++) {
        let key = itemKeys[index];
        let value = items[key];

        let result = consumer(key, value);
        if (result) {
            break;
        }
    }
}

export const sortByProperty = (items: { [s: string]: any; } | ArrayLike<any>, sortProperty: string) => {

    let property = sortProperty;

    let sortFunction = null;

    if (property.startsWith('-')) {
        property = property.substring(1);

        sortFunction = (a: { [x: string]: any; }, b: { [x: string]: any; }) => {

            let aElement: any = a[property];
            let bElement: any = b[property];

            let result;

            if (aElement instanceof Date && bElement instanceof Date) {
                const _MS_PER_DAY = 1000 * 60 * 60 * 24;

                // Discard the time and time-zone information.
                const utc1 = Date.UTC(aElement.getFullYear(), aElement.getMonth(), aElement.getDate());
                const utc2 = Date.UTC(bElement.getFullYear(), bElement.getMonth(), bElement.getDate());
                result = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }
            else if (aElement && bElement) {
                result = bElement.localeCompare(aElement);
            }
            else {
                result = -1;
            }

            return result;
        }
    }
    else sortFunction = (a: { [x: string]: any; }, b: { [x: string]: any; }) => {

        let aElement: any = a[property];
        let bElement: any = b[property];

        let result;

        if (aElement instanceof Date && bElement instanceof Date) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;

            // Discard the time and time-zone information.
            const utc1 = Date.UTC(aElement.getFullYear(), aElement.getMonth(), aElement.getDate());
            const utc2 = Date.UTC(bElement.getFullYear(), bElement.getMonth(), bElement.getDate());
            result = Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
        else if (aElement && bElement) {
            result = aElement.localeCompare(bElement);
        }
        else {
            result = -1;
        }

        return result;
    }

    return Object.values(items).sort(sortFunction);
}

export const findFirstByProperty = (items: any[], propertyName: string, propertyValue: any) => {
    let result = null;

    forEach(items, (item: { [x: string]: any; }) => {
        if (item[propertyName] === propertyValue) {
            result = item;
            return true;
        }
    })

    return result? result[0] : null; // or undefined
}

export function arrayEquals(a: any[], b: string | any[]) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

