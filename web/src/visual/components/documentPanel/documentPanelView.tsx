import React, {Component} from 'react';
import './documentPanel.css';
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import ScrollBar from "../../theme/widgets/scrollBar/scrollBar";
import {ParamType} from "../../../model";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Tag from "../../theme/widgets/tag/tag";
import GlobalSwitchButton from "../../theme/widgets/globalSwitchButton/globalSwitchButton";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";
import {DocumentPanelProps, DocumentPanelState, DocumentInfoVM, EditPropertyVM} from "./documentPanelModel";

class DocumentPanelView extends Component<DocumentPanelProps, DocumentPanelState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            isExpanded: false,
            tmpDocument: {},
            isDirty: false,
            isGlobal: true,
        }
    }


    componentDidMount() {
        const { document } = this.props;
        const { id } = document || {};

        this.setTmpDocument({id});
    }

    componentDidUpdate(prevProps: Readonly<DocumentPanelProps>, prevState: Readonly<DocumentPanelState>, snapshot?: any) {
        const { document } = this.props;

        if (document !== prevProps.document) {
            this.refreshDirtyFlag();

            const {id} = document || {};
            const {id: prevId } = prevProps.document || {};

            if (id !== prevId) {
                this.setTmpDocument({id});
            }
        }
    }

    download() {
        const { document, userProfile, token } = this.props;

        let username = userProfile.username;
        let id = userProfile.id;
        let email = userProfile.email;
        let firstName = userProfile.firstName;
        let lastName = userProfile.lastName;

        let xhr = new XMLHttpRequest;

        xhr.open( "GET", document.original_url || "");

        xhr.addEventListener( "load", function(){
            window.open(document.original_url);
        }, false);

        xhr.setRequestHeader("km_token", `bearer ${token}` );
        xhr.setRequestHeader("km_user_name", username );
        xhr.setRequestHeader("km_user_id", id );
        xhr.setRequestHeader("km_email", email );
        xhr.setRequestHeader("km_first_name", firstName );
        xhr.setRequestHeader("km_last_name", lastName );

        xhr.send();
    }

    setTmpDocument(doc: DocumentInfoVM) {
        this.setState({
            ...this.state,
            tmpDocument: doc
        }, () => this.refreshDirtyFlag());
    }

    setExpanded(value: boolean) {
        this.setState({
            ...this.state,
            isExpanded: value
        });
    }

    onTmpDocumentChanged(name: string, value: any) {

        const { tmpDocument } = this.state;
        const { document } = this.props;

        console.log(`${name} - ${value}`)

        if (document) {
            let nextDoc = {
                ...tmpDocument,
                [name]: value
            };
            if (document[name] === value) {
                delete nextDoc[name];
            }
            this.setTmpDocument(nextDoc);
        }
    }

    refreshDirtyFlag() {
        const {document} = this.props;
        const {tmpDocument } = this.state;

        if (!document) return;

        let nextTmpDocument = {
            ...tmpDocument
        };
        let dirty = false;

        let keysToDelete = [];
        let itemKeys = Object.keys(nextTmpDocument), itemsLength = itemKeys.length;
        for (let index = 0; index < itemsLength; index++) {
            let key = itemKeys[index];

            if (Array.isArray(tmpDocument[key])) {
                if (arrayEquals(tmpDocument[key], document[key])) {
                    keysToDelete.push(key);
                }
                else {
                    dirty = true;
                }
            }
            else {
                if (tmpDocument[key] === document[key]) {
                    keysToDelete.push(key);
                }
                else {
                    dirty = true;
                }
            }
        }

        forEach(keysToDelete, (key: string) => {
            if (key !== 'id') {
                delete nextTmpDocument[key];
            }
        })

        this.setState({
            ...this.state,
            tmpDocument: nextTmpDocument,
            isDirty: dirty
        })
    }

    updateDocument() {
        const { onUpdateDocument } = this.props;
        const { tmpDocument } = this.state;

        onUpdateDocument({...tmpDocument});
    }

    removeDocument() {
        const { onRemoveDocument, document } = this.props;
        const { id } = document || {};

        if (id) {
            onRemoveDocument(id);
        }
    }

    cancelEdit() {
        const { document } = this.props;
        const { id } = document || {};

        this.setTmpDocument({
            id
        });
    }

    addNewPublicTag() {
        const { editProperties, document } = this.props;
        const { tmpDocument } = this.state;
        const {id, title} = editProperties['public_tag'];

        let originalValue = document ? document[id] : '';
        originalValue = originalValue || '';

        let editValue = tmpDocument ? tmpDocument[id] : '';

        let value = editValue ? editValue : originalValue;

        let text = '';
        forEach(value, (tag: string) => {
            text += `${tag}, `;
        });

        if (text.length > 0) {
            text = text.trim();
            text = text.slice(0, -1);
        }
        let values = text.split(',');
        let result = [];
        forEach(values, (tag: string) => {
            let text = tag.trim();
            result.push(text);
        });

        result.push("-1");

        this.onTmpDocumentChanged('public_tag', result)
    }

    addNewPrivateTag() {
        const { editProperties, document } = this.props;
        const { tmpDocument } = this.state;

        const {id, title} = editProperties['private_tag'];

        let originalValue = document ? document[id] : '';
        originalValue = originalValue || '';

        let editValue = tmpDocument ? tmpDocument[id] : '';

        let value = editValue ? editValue : originalValue;

        let text = '';
        forEach(value, (tag: string) => {
            text += `${tag}, `;
        });

        if (text.length > 0) {
            text = text.trim();
            text = text.slice(0, -1);
        }
        let values = text.split(',');
        let result = [];
        forEach(values, (tag: string) => {
            let text = tag.trim();
            result.push(text);
        });

        result.push("-1");

        this.onTmpDocumentChanged('private_tag', result.toString())
    }

    toggleGlobal() {
        const { isGlobal } = this.state;
        this.setState({
            ...this.state,
            isGlobal: !isGlobal,
        })
    }

    getCellRenderer(tmpDocument: DocumentInfoVM, document: DocumentInfoVM, editProperty: EditPropertyVM, isGlobal?: boolean) {
        const {id, type, title='test', options={}, long=false} = editProperty;
        const { id:document_id } = document;

        let cellRenderer = null;

        let originalValue = document ? document[id] : '';
        originalValue = originalValue || '';

        let editValue = tmpDocument ? tmpDocument[id] : '';

        let dirty = !!editValue
        let value = editValue ? editValue : originalValue;

        switch (type) {
            case ParamType.NUMBER:
            case ParamType.STRING: {
                cellRenderer = (
                    <div key={id}>
                        <TextEdit className={`text-field align-self-center ${long ? "long-text-edit" : ""}`}
                                  placeholder={title}
                                  name={id}
                                  dirty={dirty}
                                  value={value}
                                  disable={document_id === undefined}
                                  edit={document_id !== undefined}
                                  onSubmit={this.onTmpDocumentChanged}/>
                    </div>
                )
                break;
            }
            case ParamType.ARRAY: {
                let text = '';
                forEach(value, (tag: string) => {
                    text += `${tag}, `;
                });

                if (text.length > 0) {
                    text = text.trim();
                    text = text.slice(0, -1);
                }

                let onClick = (name: string, value: string) => {

                    let values = text.split(',');
                    let result: string[] = [];
                    forEach(values, (tag: string) => {
                        let text = tag.trim();
                        if (value !== text) {
                            result.push(text);
                        }
                    });
                    this.onTmpDocumentChanged(name, result);
                }

                let onSubmit = (name: string, oldValue: string, newValue: string) => {
                    let values = text.split(',');
                    let result = [];
                    forEach(values, (tag: string) => {
                        let text = tag.trim();
                        if (text !== '-1') {
                            result.push(text);
                        }
                    });
                    result.push(newValue);
                    this.onTmpDocumentChanged(name, result);
                }

                let tagsDivs = value ? value.map((tag: string) => {
                    return tag.length > 0 && <Tag name={id} text={tag.trim()} onDelete={onClick} isGlobal={isGlobal}
                                                  isEdit={tag.trim() === "-1"} editable={true} onSubmit={onSubmit}/>
                }) : <div/>

                cellRenderer = (
                    <div className={'d-flex flex-nowrap h-gap-2 align-self-center'} key={id}>
                        {tagsDivs}
                    </div>
                )
                break;
            }
            case ParamType.OPTIONS: {
                let cbTitle = title;
                if (options && options[value]) {
                    cbTitle = options[value].title;
                }
                else {
                    cbTitle = `Select ${title}`
                }

                cellRenderer = (
                    <div key={id}>
                        <ComboBox className={`align-self-center ${dirty ? 'dirty' : ''}`} title={cbTitle} items={Object.values(options)} onSelect={(value: string) => this.onTmpDocumentChanged(id, value)}/>
                    </div>
                )
                break;
            }
            default: {
                cellRenderer = (
                    <div>NO RENDERER</div>
                )
                break;
            }
        }
        return cellRenderer;
    }

    render() {
        const {
            document, onUpdateDocument, onRemoveDocument, pdfRenderer: PdfRenderer, editProperties, userProfile, token,
            className, ...rest
        } = this.props;
        const {id, preview_url = "", original_url, isUpdating=false, upload_date, publication_date} = document || {};

        const { tmpDocument, isDirty, isExpanded, isGlobal } = this.state;

        let cn = "document-panel d-flex";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <div className={'d-flex flex-fill flex-column align-items-stretch'}>
                    <div className={'header-1 title py-4 pl-5'}>DOCUMENT INFORMATION</div>
                    <div className={`header position-relative`}>
                        <div className={`d-flex flex-column p-4 v-gap-5 position-relative ${!id && 'disabled'} `}>
                            <div className={'d-flex align-items-end justify-content-end h-gap-2'}>

                                <div className={'d-flex h-gap-2 align-items-center'}>
                                    <Button text={'DELETE'} highlight={true} onClick={this.removeDocument}/>
                                    <Button text={'DOWNLOAD'} onClick={this.download}/>
                                    <Button
                                        disabled={!isDirty}
                                        text={'CANCEL'} onClick={this.cancelEdit}/>
                                    <Button
                                        disabled={!isDirty}
                                        text={'PUBLISH'} onClick={this.updateDocument}/>
                                </div>
                            </div>

                            {/*</Card>*/}
                            <ScrollBar className={`property-grid-container ${isExpanded ? 'expanded' : ''}`} renderTrackHorizontal={false}>
                                <div className={"d-flex flex-column v-gap-1 header-1"}>
                                    <div className={'property-grid'}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Title:</div>
                                        <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Author:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['title'])
                                        }
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['author'])
                                        }
                                    </div>

                                    <div className={'d-flex'}>
                                        <div className={'property-grid-2'}>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Dept:</div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Project: </div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>SME:</div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>2nd SME:</div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                                            <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Status:</div>
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['department'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['project'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_name'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_email'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_name'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_email'])
                                            }
                                            {
                                                this.getCellRenderer(tmpDocument, document, editProperties['status'])
                                            }
                                        </div>
                                        <div className={'d-flex flex-column v-gap-5'}>
                                            <div className={'property-grid-3'}>
                                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Purpose:</div>
                                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                                                {
                                                    this.getCellRenderer(tmpDocument, document, editProperties['purpose'])
                                                }
                                                {
                                                    this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_phone'])
                                                }
                                                {
                                                    this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_phone'])
                                                }
                                            </div>
                                            <TextEdit autoFocus={false} className={'custom-padding custom-width pl-5 ml-4'} placeholder={'+ New Field'}/>
                                        </div>
                                    </div>
                                </div>
                            </ScrollBar>

                            <div className={'d-flex flex-column v-gap-4 pl-4'} >
                                <div className={'d-flex h-gap-2 align-items-center header-2 text-info'}>
                                    {
                                        document && upload_date != null &&
                                        <div>Uploaded: {upload_date?.split(",")[0]}</div>
                                    }
                                    {
                                        (document === null || upload_date === undefined) &&
                                        <div>Upload Date/Time</div>
                                    }
                                    <div>|</div>
                                    {
                                        document && publication_date &&
                                        <div>Published: {publication_date}</div>
                                    }
                                    {
                                        (document === null || publication_date === undefined) &&
                                        <div>Publication Date/Time</div>
                                    }
                                </div>
                                <div className={'d-flex align-items-center justify-content-between'}>
                                    <div className={'d-flex h-gap-2'}>
                                        <GlobalSwitchButton isGlobal={isGlobal} light={false} onClick={this.toggleGlobal} className={'mr-3'}/>
                                        {
                                            isGlobal &&
                                            this.getCellRenderer(tmpDocument, document, editProperties['public_tag'], true)
                                        }
                                        {
                                            !isGlobal &&
                                            this.getCellRenderer(tmpDocument, document, editProperties['private_tag'], false)
                                        }
                                        <div className={'tag-button text-primary header-1 cursor-pointer align-self-center'}
                                             onClick={isGlobal ? this.addNewPublicTag : this.addNewPrivateTag}>+</div>
                                    </div>
                                    <Button text={isExpanded ? "Show Less" : "Show More"} onClick={() => this.setExpanded(!isExpanded)}/>
                                </div>
                            </div>
                        </div>

                        {
                            isUpdating &&
                            <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                                <LoadingIndicator/>
                            </div>
                        }
                    </div>
                    <div className={"body flex-fill d-flex align-self-stretch position-relative"}>
                        {
                            id ?
                                preview_url.length > 0 ?
                                    <PdfRenderer preview_url={preview_url} userProfile={userProfile} token={token}/> :
                                    <div className={"position-relative w-100 h-100"}>
                                        <LoadingIndicator/>
                                    </div>
                                :
                                <div
                                    className={'flex-fill d-flex flex-column align-items-center justify-content-center v-gap-5 bg-tertiary'}>
                                    <div className={'display-4 text-accent font-weight-semi-bold'}>No Preview Available
                                    </div>
                                    <div className={'header-2 text-info font-weight-light'}>(Select a document to see preview)</div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default DocumentPanelView;
