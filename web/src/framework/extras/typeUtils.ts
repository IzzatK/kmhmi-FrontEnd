import {forEach, forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";

export const nameOf = <T>(name: keyof T) => name;

export const getValueOrDefault = (object: any, propertyName: string, defaultValue: any) => {

    let result = defaultValue;
    if (object && object.hasOwnProperty(propertyName)) {
        if (object[propertyName]) {
            result = object[propertyName];
        }
    }
    else {
        console.log(`Property <${propertyName}> does not exist in object: ${JSON.stringify(object)}`);
    }
    return result;
}

export const promiseFulfilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';

export const bindInstanceMethods = (o: object) => {
    // Get all defined class methods
    const propertyDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(o));
    const dictionary: Record<string, any> = o;

    forEachKVP(propertyDescriptors, (key: string, value: PropertyDescriptor) => {
        try {
            if (key !== 'constructor') {
                const element = dictionary[key];
                if (element != null) {
                    dictionary[key] = element.bind(o);
                }
            }
            // if (value['get'] || value['set']) {
            //     console.log(`binding: skipping property accessor: ${key}`)
            // }
            // if (key === 'constructor') {
            //     console.log(`binding: skipping constructor: ${key}`)
            // }
            // else {
            //     dictionary[key] = dictionary[key].bind(o);
            // }
        }
        catch (ex) {

        }

    });
}

export type Nullable<T> = T | null;
