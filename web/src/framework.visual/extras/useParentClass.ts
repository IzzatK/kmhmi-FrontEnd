import {useMemo} from "react";


export const useParentClass = (props: any, className: string) => {
    const {className: parentClassName = ''} = props;

    const result = useMemo(() => {
        let result = "";

        if (className) {
            result += ` ${className}`;
        }

        if (parentClassName) {
            result += ` ${parentClassName}`;;
        }

        return result;
    }, [className, parentClassName]);

    return result;
};
