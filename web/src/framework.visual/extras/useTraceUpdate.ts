import {useEffect, useRef} from "react";

export const traceUpdate = (prevProps: Readonly<any>, prevState: Readonly<any>, props: { [s: string]: any; } | ArrayLike<any>, state: Readonly<any>) => {
    Object.entries(props).forEach(([key, val]) =>
        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    if (state) {
        Object.entries(state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
        );
    }
};

export function useTraceUpdate(tracedObject: any, traceName: string) {
    const prev = useRef(tracedObject);
    useEffect(() => {
        const tracedItems = Object.entries(tracedObject).reduce((accumulator: any, [key, value]) => {
            if (prev.current[key] !== value) {
                accumulator[key] = [prev.current[key], value];
            }
            return accumulator;
        }, {});
        if (Object.keys(tracedItems).length > 0) {
            console.log(`Changed ${traceName}:`, tracedItems);
        }
        prev.current = tracedObject;
    });
}
