import 'react-app-polyfill/stable';
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {appDataStore, authenticationService} from "./application/serviceComposition";
import { KnowledgeManagementPresenter } from './visual/views/knowledgeManagement/knowledgeManagementPresenter';

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<div></div>}>
            <Provider store={appDataStore.getStorage()}>
                {/*<ServiceContext.Provider value={application}>*/}
                <DndProvider backend={HTML5Backend} >
                    <KnowledgeManagementPresenter />
                </DndProvider>
                {/*</ServiceContext.Provider>*/}
            </Provider>
        </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
);


// const interval = setInterval(() => {
//     let href = document.location.href;
//     if (href.includes('state=')) {
//         clearInterval(interval);
//         authenticationService.doLogin();
//     }
//
//     if (authenticationService.isLoggedIn()) {
//         clearInterval(interval);
//     }
//
// }, 100);
//
// var oldHref = document.location.href;


if (document.location.href.includes('state=')) {
    if (!authenticationService.isLoggedIn()) {
        authenticationService.doLogin();
    }
}

// window.onload = function() {
//     const bodyList = document.querySelector("body")
//
//     const observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//
//             if (document.location.href.includes('state=')) {
//                 if (!authenticationService.isLoggedIn()) {
//                     authenticationService.doLogin();
//                 }
//             }
//
//             // if (oldHref != document.location.href) {
//             //     oldHref = document.location.href;
//             //     /* Changed ! your code here */
//             // }
//         });
//     });
//
//     const config = {
//         childList: true,
//         subtree: true
//     };
//
//     if (bodyList != null) {
//         observer.observe(bodyList, config);
//     }
// };



// const renderRegister = () => {
//     ReactDOM.render(
//         <React.StrictMode>
//             <Suspense fallback={<div></div>}>
//                 <div className={'header-1 text-secondary'}>Please register</div>
//             </Suspense>
//         </React.StrictMode>,
//         document.getElementById('root')
//     );
// };

// window.onunload = (ev => {
//     alert('unloaded!')
// });

// if (keycloakEnabled) {
//     authenticationService.initKeycloak(renderApp, renderRegister);
// }
// else {
//     renderApp();
// }


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();


