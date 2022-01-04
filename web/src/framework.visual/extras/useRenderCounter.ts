import {useEffect, useRef} from "react";

export function useRenderCounter(componentName: string) {
    const counter = useRef(1);
    useEffect(() => {
        console.log(`Render count for ${componentName}:  ${counter.current}`);

        counter.current = counter.current + 1;
    });
}
