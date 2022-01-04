import * as documentAPI from "../../application/documents/providers/documentProvider";
// import * as documents from "../../application/documents/documents";


function waitForSocket(socket: { readyState: number; }, callback: { (): any; (): any; }) {
    setTimeout(() => {
        socket.readyState === 1 ? callback() : waitForSocket(socket, callback);
    }, 10);
}

export const configureSocket = (socket: any) => (store: any) => {
    socket.onmessage = (event: { data: string; }) => {
        // console.log(event.data);
        if(event.data !== "") {
            // console.log(event.data)
            const json = JSON.parse(event.data);
            console.log(json)

            const id = json.key.replace(/^.*[\\\/]/, '');
            const action = {
                "type": 'application/document/updateOne',
                "payload": {
                    "name": id,
                    "status": json.status,
                    "percentComplete": 100,
                }
            };

            //remove the doc from pending
            store.dispatch(action);
            const action2 = {
                "type": 'application/document/removePendingDocument',
                "payload": {id}
            };
            store.dispatch(action2)

            console.log(json.status)
            if(json.status !== 'Success')
                return;
            else {
                //getDoc(json.docid, redux)

                // redux.dispatch(action3);
                // select the document
                const action4 = {
                    "type": 'selectionService/setContextHandler',
                    "payload": {
                        key: "selected-document",
                        // value: "d2ac1221-be4f-4bd1-bf3f-52d73961ed9e"
                        value: json.docid
                    }
                };
                store.dispatch(action4);
                //show the document panel
                store.dispatch(createUIAction("components/documentPanel", true))
                //hide the upload panel
                // redux.dispatch(createUIAction("components/uploadPanel", false))
                //hide the upload panel


                // setTimeout(()=>{redux.dispatch(action2)}, 1500)
                // visibilityUpdatedHandler({ nodeId, visible }));
                // DisplayService2.hideNode(UploadPanelId);
                // DisplayService2.showNode(DocumentPanelId);
                // redux.dispatch(action)

                // console.log(redux.getState())
            }
        }
    }
    return (next: (arg0: any) => any) => (action: any) => {
        if (action.socket && action.socket.send) {
            if (!action.socket.keepSocket) {
                let {socket, ...action2} = action;
                action = action2;
            }
            waitForSocket(socket, () => socket.send(JSON.stringify(action)));
        }
        return next(action);
    };
};

// export const configureSocket = socket => redux => {
export const createUIAction = (nodeId: string, visible: boolean) => {
    return {
        "type": 'displayService/visibilityUpdatedHandler',
        "payload": { nodeId, visible }
    }
}
// export const getDoc = (id, redux) => {
//     referenceProvider.getDocument(id)
//         .then(function(data) {
//             // dispatch(getDocumentMeta.actions.SUCCESS(data));
//             const document = {
//                 id: data._id,
//                 ...data,
//             };
//             // if (document._id) {
//             //     delete document._id;
//             // }
//
//             const action = {
//                 type: "application/document/addOrUpdateDocument",
//                 payload: {
//                     id: document.id,
//                     document:document
//                 }
//             }
//             redux.dispatch(action);
//         })
//         .catch(function(error) {
//             // dispatch(getDocumentMeta.actions.ERROR(error));
//         })
// }
