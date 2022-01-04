export function binarySearch(element: { children: string | any[] | null; }, propSelector: (arg0: any) => any, propMatch: any): any {
    if(propSelector(element) === propMatch){
        return element;
    }
    else if (element.children != null){
        let result = null;
        for(let i=0; result == null && i < element.children.length; i++){
            result = binarySearch(element.children[i], propSelector, propMatch);
        }
        return result;
    }
    return null;
}
