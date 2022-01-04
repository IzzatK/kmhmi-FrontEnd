import 'react-app-polyfill/stable';
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {keycloakEnabled} from "./config/config";
import {appDataStore, authenticationService} from "./application/serviceComposition";

const Bumed = React.lazy(() => import('./visual/views/bumed'));

const renderApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Suspense fallback={<div></div>}>
                <Provider store={appDataStore.getStorage()}>
                    {/*<ServiceContext.Provider value={application}>*/}
                        <DndProvider backend={HTML5Backend} >
                                <Bumed />
                        </DndProvider>
                    {/*</ServiceContext.Provider>*/}
                </Provider>
            </Suspense>
        </React.StrictMode>,
        document.getElementById('root')
    );
};

const renderRegister = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Suspense fallback={<div></div>}>
                <div className={'header-1 text-secondary'}>Please register</div>
            </Suspense>
        </React.StrictMode>,
        document.getElementById('root')
    );
};

if (keycloakEnabled) {
    authenticationService.initKeycloak(renderApp, renderRegister);
}
else {
    renderApp();
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();


