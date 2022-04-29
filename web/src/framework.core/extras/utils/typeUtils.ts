import {forEachKVP} from "./collectionUtils";

export const nameOf = <T>(name: keyof T) => name;

export const getValueOrDefault = (object: any, propertyName: string, defaultValue: any) => {

    let result = defaultValue;
    if (object && object.hasOwnProperty(propertyName)) {
        if (object[propertyName]) {
            result = object[propertyName];
        }
    }
    else {
        // console.log(`Property <${propertyName}> does not exist in object: ${JSON.stringify(object)}`);
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

export function deepCopy<T>(source: T): T {
    return Array.isArray(source)
        ? source.map(item => deepCopy(item))
        : source instanceof Date
            ? new Date(source.getTime())
            : source && typeof source === 'object'
                ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
                    Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
                    o[prop] = deepCopy((source as { [key: string]: any })[prop]);
                    return o;
                }, Object.create(Object.getPrototypeOf(source)))
                : source as T;
}

export type Nullable<T> = T | null;

export interface KeyValuePair<S, T> {
    key: S;
    value: T;
}
