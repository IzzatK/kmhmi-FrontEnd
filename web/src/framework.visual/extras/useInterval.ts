import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, interval: any, runAtStart=true) => {
    const savedCallback: any = useRef();

    useEffect(
        () => {
            savedCallback.current = callback;
        },
        [callback]
    );

    useEffect(
        () => {
            const handler = (...args: any[]) => savedCallback.current(...args);

            if (interval !== null) {

                if (runAtStart) {
                    handler();
                }

                const id = setInterval(handler, interval);
                return () => clearInterval(id);
            }
        },
        [interval]
    );
};
