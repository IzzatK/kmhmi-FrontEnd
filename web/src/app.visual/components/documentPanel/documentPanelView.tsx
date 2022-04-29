import React, {Component} from 'react';
import './documentPanel.css';
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {ParamType} from "../../../app.model";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Tag from "../../theme/widgets/tag/tag";
import GlobalSwitchButton from "../../theme/widgets/globalSwitchButton/globalSwitchButton";
import {bindInstanceMethods, nameOf} from "../../../framework.core/extras/utils/typeUtils";
import {
    DocumentPanelProps,
    DocumentPanelState,
    DocumentInfoVM,
    EditPropertyVM,
    CreateExcerptEventData, DocumentUpdateParams
} from "./documentPanelModel";
import {InfoSVG} from "../../theme/svgs/infoSVG";
import CheckBox from "../../theme/widgets/checkBox/checkBox";
import {EllipsisSVG} from "../../theme/svgs/ellipsisSVG";
import Portal from "../../theme/widgets/portal/portal";
import {AddNewSVG} from "../../theme/svgs/addNewSVG";
import {MinimizeSVG} from "../../theme/svgs/minimizeSVG";
import {CSSTransition} from "react-transition-group";
import {CheckMarkSVG} from "../../theme/svgs/checkMarkSVG";
import {Size} from "../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import DocumentPdfPreview from "./documentPdfPreview";
import {getClassNames} from "../../../framework.visual";
import {formatFileType} from "./presenters/fileTypePresenter";

export default class DocumentPanelView extends Component<DocumentPanelProps, DocumentPanelState> {
    private tagsResizeObserver: ResizeObserver;
    private readonly characterWidth: number;
    private tagCharactersAllowed: number;
    private tagCharactersDisplayed: number;
    private nextTagWidth: number;

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpDocument: {},
            isDirty: false,
            isGlobal: true,
            isPrivate: false,
            showTagEditor: false,
            renderTrigger: 0,
            tmpExcerpt: {},
            zoomScale: 1,
            moreInfoExpanded: false,
        }

        this.characterWidth = 8.15;//pixels
        this.tagCharactersAllowed = 0;
        this.tagCharactersDisplayed = 0;
        this.nextTagWidth = 0;

        this.tagsResizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const { renderTrigger } = this.state;

                    const width = entry.contentRect.width - 170;
                    this.tagCharactersAllowed = width / this.characterWidth;

                    if ((this.tagCharactersDisplayed > this.tagCharactersAllowed) || (this.tagCharactersDisplayed + this.nextTagWidth < this.tagCharactersAllowed)) {
                        this.setState({
                            ...this.state,
                            renderTrigger: renderTrigger + 1,
                        })
                    }
                }
            }
        })
    }

    componentDidMount() {
        const { document:doc } = this.props;
        const { id, scope } = doc || {};

        let tmpDocument = {
            id, scope
        }

        this.setTmpDocument(tmpDocument);

        let element = document.getElementById('tag-row');
        if (element) {
            this.tagsResizeObserver.observe(element);
        }
    }

    componentDidUpdate(prevProps: Readonly<DocumentPanelProps>, prevState: Readonly<DocumentPanelState>, snapshot?: any) {
        const { document } = this.props;

        if (document !== prevProps.document) {
            this.refreshDirtyFlag();

            const {id, scope} = document || {};
            const {id: prevId } = prevProps.document || {};

            let tmpDocument = {
                id,
                scope
            }

            if (id !== prevId) {
                this.setTmpDocument(tmpDocument);
            }
        }
    }

    componentWillUnmount() {
        let element = document.getElementById('tag-row');
        if (element) {
            this.tagsResizeObserver.unobserve(element);
        }
    }

    setTmpDocument(doc: DocumentUpdateParams) {

        const { scope } = doc;

        let isPrivate = false;

        if (scope) {
            isPrivate = scope === "Private";
        }

        this.setState({
            ...this.state,
            tmpDocument: doc,
            isPrivate: isPrivate,
        }, () => this.refreshDirtyFlag());
    }

    onTmpDocumentChanged(name: string, value: any) {
        const { tmpDocument } = this.state;
        const { document } = this.props;

        if (document) {
            let nextDoc: DocumentUpdateParams = {
                ...tmpDocument,
                [name]: value
            };

            if (typeof value === 'object') {
                if (document[name] === value) {

                    forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
                        if (name === itemKey) {
                            delete nextDoc[itemKey];
                        }
                    });
                }
            } else if (document[name] === value) {
                forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
                    if (name === itemKey) {
                        delete nextDoc[itemKey];
                    }
                });
            }
            this.setTmpDocument(nextDoc);
        }
    }

    refreshDirtyFlag() {
        const { document } = this.props;
        const { tmpDocument } = this.state;

        if (!document) return;

        let nextTmpDocument = {
            ...tmpDocument
        };
        let dirty = false;

        let keysToDelete: string[] = [];

        forEachKVP(nextTmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
            if (Array.isArray(itemValue)) {
                if (arrayEquals(itemValue, document[itemKey])) {
                    keysToDelete.push(itemKey);
                }
                else {
                    dirty = true;
                }
            }
            else if (typeof itemValue === 'object') {
                if (itemValue === document[itemKey]) {
                    keysToDelete.push(itemKey);
                }
                else {
                    dirty = true;
                }
            }
            else {
                if (itemValue === document[itemKey]) {
                    keysToDelete.push(itemKey);
                }
                else {
                    dirty = true;
                }
            }
        });

        forEach(keysToDelete, (key: string) => {
            if (key !== 'id') {
                forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
                    if (key === itemKey) {
                        delete nextTmpDocument[itemKey];
                    }
                });
            }
        })

        this.setState({
            ...this.state,
            tmpDocument: nextTmpDocument,
            isDirty: dirty
        })
    }

    updateDocument() {
        const { onUpdateDocument, document } = this.props;
        const { tmpDocument } = this.state;

        const { id } = document;

        if (onUpdateDocument) {
            let updatedDocument = Object.assign({}, tmpDocument);

            updatedDocument['id'] = id;

            onUpdateDocument(updatedDocument);
        }
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
        const {id} = editProperties['public_tag'];

        let originalValue = document ? document[id] : [];
        originalValue = originalValue || [];

        let editValue = '';

        forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
            if (id === itemKey) {
                editValue = itemValue;
            }
        })

        let value = editValue ? editValue : originalValue;

        let result: Record<string, string> = {};

        forEachKVP(value, ((item: string) => {
            result[item] = item;
        }));

        result["-1"] = "";

        this.onTmpDocumentChanged('public_tag', result)
    }

    addNewPrivateTag() {
        const { editProperties, document } = this.props;
        const { tmpDocument } = this.state;
        const {id} = editProperties['private_tag'];

        let originalValue = document ? document[id] : [];
        originalValue = originalValue || [];

        let editValue = '';

        forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
            if (id === itemKey) {
                editValue = itemValue;
            }
        })

        let value = editValue ? editValue : originalValue;

        let result: Record<string, string> = {};

        forEachKVP(value, ((item: string) => {
            result[item] = item;
        }));

        result["-1"] = "";

        this.onTmpDocumentChanged('private_tag', result)
    }

    toggleGlobal() {
        const { isGlobal } = this.state;
        this.setState({
            ...this.state,
            isGlobal: !isGlobal,
        })
    }

    _toggleIsPrivate() {
        const { isPrivate } = this.state;

        this.setState({
            ...this.state,
            isPrivate: !isPrivate,
        });

        if (isPrivate) {
            this.onTmpDocumentChanged('scope', "Public");
        } else {
            this.onTmpDocumentChanged('scope', "Private");
        }
    }

    _onSubmitTags() {
        this._setShowTagEditor(false);
    }

    _setShowTagEditor(showTagEditor: boolean) {
        this.setState({
            ...this.state,
            showTagEditor: showTagEditor,
        })
    }

    _onCreateExcerpt(excerpt_text: string, excerpt_content: any, excerpt_location: string) {
        const { onCreateExcerpt, document:doc } = this.props;
        const { tmpExcerpt } = this.state;
        const { pocketId='', note_text='' } = tmpExcerpt;
        const { id:docId='' } = doc;

        if (onCreateExcerpt) {

            const params: CreateExcerptEventData = {
                excerpt_content: excerpt_content,
                excerpt_text: excerpt_text,
                note_text: note_text,
                note_content: note_text,
                pocketId: pocketId,
                doc_id: docId,
                excerpt_location: excerpt_location
            }

            onCreateExcerpt(params);
        }

        this.setState({
            ...this.state,
            tmpExcerpt: {

            },
        })

    }

    _onTmpExcerptChanged(name: string, value: string) {
        const { tmpExcerpt } = this.state;

        let nextExcerpt = {
            ...tmpExcerpt,
            [name]: value
        };

        this.setTmpExcerpt(nextExcerpt);
    }

    _onTmpNoteChanged(name: string, value: string) {
        const { tmpExcerpt } = this.state;

        let nextExcerpt = {
            ...tmpExcerpt,
            [name]: value
        };

        this.setTmpExcerpt(nextExcerpt);
    }

    setTmpExcerpt(excerpt: Partial<CreateExcerptEventData>) {
        this.setState({
            ...this.state,
            tmpExcerpt: excerpt,
        })
    }

    _onZoom(zoom: number) {
        this.setState({
            ...this.state,
            zoomScale: zoom,
        });
    }

    getCellRenderer(tmpDocument: DocumentUpdateParams, document: DocumentInfoVM, editProperty: EditPropertyVM, isGlobal?: boolean) {
        const { permissions, tagSuggestionSupplier } = this.props;
        const { canModify } = permissions;
        const {id, type, title='test', options={}, long=false} = editProperty;
        const { id:document_id } = document;
        const { showTagEditor } = this.state;

        let cellRenderer;

        let originalValue = document ? document[id] : '';
        originalValue = originalValue || '';

        let editValue = '';

        forEachKVP(tmpDocument, (itemKey: keyof DocumentUpdateParams, itemValue: any) => {
            if (id === itemKey) {
                editValue = itemValue;
            }
        })

        let dirty = !!editValue
        let value = editValue ? editValue : originalValue;

        switch (type) {
            case ParamType.NUMBER:
            case ParamType.STRING: {
                if (id === 'publication_date') {
                    if (value !== "No Publication Date") {
                        let dateArray = value.split('/');

                        if (dateArray[0] && dateArray[1] && dateArray[2]) {
                            let yyyy = dateArray[2];
                            let mm = dateArray[0].length === 1 ? "0" + dateArray[0] : dateArray[0];
                            let dd = dateArray[1].length === 1 ? "0" + dateArray[1] : dateArray[1];

                            value = yyyy + "-" + mm + "-" + dd;
                        }
                    }

                    cellRenderer = (
                        <div key={id}>
                            <TextEdit className={`text-field align-self-center ${long ? "w-100" : ""}`}
                                      type={'date'}
                                      placeholder={title}
                                      name={id}
                                      dirty={dirty}
                                      value={value}
                                      disable={document_id === undefined}
                                      edit={document_id !== undefined && canModify}
                                      onSubmit={(name, value) => this.onTmpDocumentChanged(name, value)}/>
                        </div>
                    )
                } else {
                    cellRenderer = (
                        <div key={id}>
                            <TextEdit className={`text-field align-self-center ${long ? "w-100" : ""}`}
                                      placeholder={title}
                                      name={id}
                                      dirty={dirty}
                                      value={value}
                                      disable={document_id === undefined}
                                      edit={document_id !== undefined && canModify}
                                      onSubmit={this.onTmpDocumentChanged}/>
                        </div>
                    )
                }
                break;
            }
            case ParamType.ARRAY: {
                let onClick = (name: string, entry: string) => {

                    let result: Record<string, string> = {};

                    forEachKVP(value, (item: string) => {
                        if (item !== entry) {
                            result[item] = item;
                        }
                    })

                    this.onTmpDocumentChanged(name, result);
                }

                let onSubmit = (name: string, oldValue: string, newValue: string) => {
                    let result: Record<string, string> = {};

                    forEachKVP(value, (item: string) => {
                        if (newValue !== "") {
                            if (item !== "-1") {
                                result[item] = item;
                            }
                        } else {
                            result[item] = item;
                        }
                    })

                    if (newValue !== "") {
                        result[newValue] = newValue;
                    }

                    this.onTmpDocumentChanged(name, result);
                }

                let tagDivs: any[] = [];
                let displayTagDivs: any[] = [];

                let length = 0;
                let totalLength = 0;

                let nextTagRecorded = false;

                this.tagCharactersDisplayed = 0;
                this.nextTagWidth = 0;

                if (id === "public_tag" || id === "private_tag") {
                    if (value) {
                        forEachKVP(value, (tag: string) => {
                            if (tag.length > 0) {
                                this.tagCharactersDisplayed += (tag.length + (46 / this.characterWidth));

                                if (this.tagCharactersDisplayed < this.tagCharactersAllowed) {
                                    displayTagDivs?.push(<Tag name={id}
                                                              text={tag}
                                                              onDelete={onClick}
                                                              isGlobal={isGlobal}
                                                              className={"mr-4"}
                                                              key={tag + "_short"}
                                                              isEdit={tag.trim() === "-1"}
                                                              readonly={!canModify}
                                                              onSubmit={onSubmit}
                                                              suggestionSupplier={tagSuggestionSupplier}
                                    />)
                                    length++;
                                } else if (!nextTagRecorded) {
                                    this.nextTagWidth = tag.length;
                                    nextTagRecorded = true;
                                }

                                totalLength++;

                                tagDivs?.push(<Tag name={id}
                                                   text={tag}
                                                   onDelete={onClick}
                                                   isGlobal={isGlobal}
                                                   className={"mr-4"}
                                                   isEdit={tag.trim() === "-1"}
                                                   key={tag}
                                                   readonly={!canModify}
                                                   onSubmit={onSubmit}
                                                   suggestionSupplier={tagSuggestionSupplier}
                                />)
                            }
                        })
                    }
                }

                cellRenderer = (
                    <div className={'d-flex flex-nowrap align-self-center align-items-center overflow-hidden w-100'}>

                        {
                            !showTagEditor &&
                            <div className={'d-flex flex-nowrap align-self-center overflow-hidden'} key={id}>
                                {displayTagDivs}
                            </div>
                        }
                        {
                            (permissions.canModify && (length === totalLength)) &&
                            <Button className={'tag-button fill-primary'}
                                 onClick={isGlobal ? this.addNewPublicTag : this.addNewPrivateTag}>
                                <AddNewSVG className={"nano-image-container"}/>
                            </Button>
                        }

                        {
                            (length < totalLength) &&
                            <Portal
                                isOpen={showTagEditor}
                                zIndex={9999}
                                enterClass={'growVertical'}
                                exitClass={'shrinkVertical'}
                                timeout={200}
                                autoLayout={false}
                                onShouldClose={() => this._setShowTagEditor(false)}
                                portalContent={
                                    ({}) =>
                                        <div className={'portal position-absolute tags-portal'}>
                                            <div className={'advanced d-flex flex-column v-gap-5 shadow position-relative'}>
                                                <div className={'d-inline-flex flex-wrap align-self-center align-items-center overflow-auto w-100 p-3'} key={id}>
                                                    {tagDivs}
                                                    {
                                                        permissions.canModify &&
                                                        <Button className={'tag-button fill-primary'}
                                                             onClick={isGlobal ? this.addNewPublicTag : this.addNewPrivateTag}>
                                                            <AddNewSVG className={"nano-image-container"}/>
                                                        </Button>
                                                    }
                                                </div>
                                                <div className={'d-flex flex-fill justify-content-end align-items-end'}>
                                                    <div className={'d-flex flex-fill justify-content-end align-items-end footer p-4'}>
                                                        <Button light={true} onClick={this._onSubmitTags}>Submit Tags</Button>
                                                    </div>
                                                </div>
                                                <div className={"position-absolute close"}>
                                                    <Button className={"bg-transparent fill-primary"} onClick={() => this._setShowTagEditor(false)}>
                                                        <MinimizeSVG className={"nano-image-container"}/>
                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                }>

                                {
                                    (length < totalLength) &&
                                    <Button className={`ellipsis-button ${showTagEditor ? "invisible" : ""}`} onClick={(() => this._setShowTagEditor(!showTagEditor))}>
                                        <EllipsisSVG className={'small-image-container'}/>
                                    </Button>
                                }

                            </Portal>
                        }

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
                        <ComboBox disable={!canModify}
                                  className={`align-self-center ${dirty ? 'dirty' : ''}`}
                                  title={cbTitle}
                                  items={Object.values(options)}
                                  onSelect={(value: string) => this.onTmpDocumentChanged(id, value)}/>
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
            document,
            editProperties,
            userProfile,
            token,
            className,
            permissions,
            pockets,
            excerpts,
            onSaveNote
        } = this.props;

        const {
            id,
            preview_url = "",
            original_url,
            isUpdating=false,
            upload_date,
            file_type,
            uploaded_by,
            file_name,
            file_size,
            status,
            nlpComplete,
            showStatusBanner
        } = document || {};

        const {
            tmpDocument,
            isDirty,
            isGlobal,
            isPrivate,
            tmpExcerpt,
            zoomScale
        } = this.state;

        let cn = "document-panel d-flex";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'d-flex flex-fill flex-column align-items-stretch'}>
                    <div className={`header position-relative`}>
                        <div className={`d-flex flex-column p-4 position-relative`}>
                            <div className={"d-flex flex-row v-gap-1 header-1"}>
                                <div className={'title-grid flex-grow-1 pr-4'}>
                                    <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-right'}>Title:</div>
                                    {
                                        this.getCellRenderer(tmpDocument, document, editProperties['title'])
                                    }
                                </div>
                                <Button className={"info-button"} onClick={() => this.setState({
                                    ...this.state,
                                    moreInfoExpanded: !this.state.moreInfoExpanded
                                })}>
                                    <div className={"d-flex info-button justify-content-start"}>
                                        <div className={'d-flex h-gap-2 align-items-center'}>
                                            <div className={'header-2'}>More Info</div>
                                            <InfoSVG className={'small-image-container'}/>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                            {
                                this.state.moreInfoExpanded &&
                                <div className={'d-flex flex-column'}>

                                    <div className={'title-grid'}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-right'}>Author:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['author'])
                                        }
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right'}>Publication Date:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['publication_date'])
                                        }
                                    </div>

                                    <div className={'property-grid py-4'}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right'}>Project:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['project'])
                                        }
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right'}>Dept:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['department'])
                                        }
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right'}>Purpose:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['purpose'])
                                        }
                                    </div>

                                    <div className={'sme-grid'}>
                                        <div className={'align-self-center text-right header-3'}>Primary SME:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_name'])
                                        }
                                        <div className={'align-self-center text-right header-3'}>Phone:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_phone'])
                                        }
                                        <div className={'align-self-center text-right header-3'}>Email:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_email'])
                                        }
                                        <div className={'align-self-center text-right header-3'}>Second SME:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_name'])
                                        }
                                        <div className={'align-self-center text-right header-3'}>Phone:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_phone'])
                                        }
                                        <div className={'align-self-center text-right header-3'}>Email:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_email'])
                                        }
                                    </div>

                                    <div className={'info-grid pt-4 text-info overflow-hidden'}>
                                        <div className={'align-self-center text-right header-3'}>Uploaded By:</div>
                                        <div className={'align-self-center header-2'}>{uploaded_by}</div>
                                        <div className={'align-self-center text-right header-3'}>Original File Name:</div>
                                        <div className={'align-self-center header-2 overflow-hidden text-break'}>{file_name}</div>
                                        <div className={'align-self-center text-right header-3'}>Upload Date:</div>
                                        <div className={'align-self-center header-2'}>{upload_date?.split(",")[0]}</div>
                                        <div className={'align-self-center text-right header-3'}>Type:</div>
                                        <div className={'align-self-center header-2'}>{formatFileType(file_type || "")}</div>
                                        <div className={'align-self-center text-right header-3'}>Size:</div>
                                        <div className={'align-self-center header-2'}>{file_size}</div>
                                    </div>
                                </div>
                            }

                            <div className={'d-flex flex-column v-gap-4 pl-4 pt-4'} >
                                <div id={'tag-row'} className={'d-flex align-items-center justify-content-between'}>
                                    <div className={'d-flex h-gap-2 overflow-hidden'}>
                                        <GlobalSwitchButton isGlobal={isGlobal} light={false} onClick={this.toggleGlobal} className={'mr-3'}/>
                                        {
                                            isGlobal &&
                                            this.getCellRenderer(tmpDocument, document, editProperties['public_tag'], true)
                                        }
                                        {
                                            !isGlobal &&
                                            this.getCellRenderer(tmpDocument, document, editProperties['private_tag'], false)
                                        }
                                    </div>
                                    {
                                        permissions.canModify &&
                                        <Button className={"bg-transparent display-4 font-weight-light info-button"} text={"Static Field +"}/>
                                    }

                                </div>
                            </div>
                        </div>

                        {
                            isUpdating || status === "PROCESSING" || status === "CREATED" &&
                            <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                                <LoadingIndicator/>
                            </div>
                        }
                    </div>
                    <div className={"body flex-fill d-flex align-self-stretch position-relative"}>
                        {
                            id ?
                                preview_url.length > 0 ?
                                    <DocumentPdfPreview
                                        preview_url={preview_url}
                                        original_url={original_url || ""}
                                        userProfile={userProfile}
                                        token={token}
                                        permissions={permissions}
                                        excerpts={excerpts}
                                        tmpExcerpt={tmpExcerpt}
                                        pockets={pockets}
                                        zoomScale={zoomScale}
                                        onUpdateTmpNote={(text: string) => this._onTmpNoteChanged(nameOf<CreateExcerptEventData>("note_text"), text)}
                                        onCreateExcerpt={this._onCreateExcerpt}
                                        onSaveNote={onSaveNote}
                                        onPocketSelectionChanged={(value: string) => this._onTmpExcerptChanged(nameOf<CreateExcerptEventData>("pocketId"), value)}
                                        onZoom={this._onZoom}
                                        />
                                    :
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
                    <CSSTransition
                        in={showStatusBanner}
                        timeout={300}
                        classNames={getClassNames('fadeIn', 'fadeIn', 'slideRightOut') }>
                        <div>
                            {
                                showStatusBanner &&
                                <div className={"d-flex align-items-center py-3 px-5 bg-advisory display-4 h-gap-3"}>
                                    <div>{nlpComplete ? "Processing Complete" : "Auto-Populating Fields"}</div>
                                    {
                                        nlpComplete === true &&
                                        <CheckMarkSVG className={"nano-image-container fill-primary"}/>
                                    }
                                    {
                                        nlpComplete !== true &&
                                        <LoadingIndicator size={Size.nano} className={"nlp-loader"}/>
                                    }
                                </div>
                            }
                        </div>
                    </CSSTransition>
                    {
                        ((permissions.canModify || permissions.canDelete) && Object.keys(document).length > 0) &&
                        <div className={'d-flex align-items-end justify-content-between h-gap-2 bg-selected py-3 px-5'}>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                {
                                    permissions.canModify &&
                                    <div className={"d-flex h-gap-2 pr-3"}>
                                        <div className={"text-primary display-4 font-weight-light"}>Publish as Private</div>
                                        <CheckBox light={true} selected={isPrivate} onClick={() => this._toggleIsPrivate()}/>
                                    </div>
                                }
                            </div>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                {
                                    permissions.canDelete &&
                                    <Button light={true} text={'DELETE'} onClick={this.removeDocument}/>
                                }
                                {
                                    permissions.canModify && isDirty &&
                                    <Button
                                        light={true}
                                        disabled={!isDirty}
                                        text={'PUBLISH'}
                                        onClick={this.updateDocument}/>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
