
// add a registry of the type you expect
import {IBasePlugin} from "../../api";

export namespace IApplicationService {
    type Constructor<T> = {
        new(...args: any[]): T;
        readonly prototype: T;
    }
    const implementations: Constructor<IBasePlugin>[] = [];
    export function GetImplementations(): Constructor<IBasePlugin>[] {
        return implementations;
    }
    export function register<T extends Constructor<IBasePlugin>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }
}
