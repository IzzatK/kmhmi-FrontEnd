export const getClassNames = (appearClass: string, enterClass: string, exitClass: string) => {
    return {
        appear: appearClass,
        appearActive: appearClass ? `${appearClass}-active` : '',
        appearDone: ``,
        enter: enterClass,
        enterActive: enterClass ? `${enterClass}-active` : '',
        enterDone: ``,
        exit: exitClass,
        exitActive: exitClass ? `${exitClass}-active` : '',
        exitDone: ``,
    }
}
