export interface IStorage {

    getState(): any;
    getStorage(): any;

    sendEvent(action: { type: string, payload: any }): any;
    sendEventAsync(action: any): (dispatch: any) => void;

    addEventHandlers(context: string, handlers: any): void;

    subscribe(listener: () => void): any;
    unsubscribe(listener: () => void): any;
}
