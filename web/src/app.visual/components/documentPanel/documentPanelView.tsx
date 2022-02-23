import React, {Component} from 'react';
import './documentPanel.css';
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach, forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {ParamType} from "../../../app.model";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Tag from "../../theme/widgets/tag/tag";
import GlobalSwitchButton from "../../theme/widgets/globalSwitchButton/globalSwitchButton";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";
import {DocumentPanelProps, DocumentPanelState, DocumentInfoVM, EditPropertyVM} from "./documentPanelModel";
import {InfoSVG} from "../../theme/svgs/infoSVG";
import Card from "../../theme/widgets/card/card";
import CheckBox from "../../theme/widgets/checkBox/checkBox";
import {EllipsisSVG} from "../../theme/svgs/ellipsisSVG";
import Portal from "../../theme/widgets/portal/portal";
import {AddNewSVG} from "../../theme/svgs/addNewSVG";
import {MinimizeSVG} from "../../theme/svgs/minimizeSVG";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getClassNames} from "../../../framework.visual/extras/utils/animationUtils";
import {CheckMarkSVG} from "../../theme/svgs/checkMarkSVG";
import {Size} from "../../theme/widgets/loadingIndicator/loadingIndicatorModel";

class DocumentPanelView extends Component<DocumentPanelProps, DocumentPanelState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpDocument: {},
            isDirty: false,
            isGlobal: true,
            isPrivate: false,
            showTagEditor: false,
            showStatusBanner: true,
        }
    }

    componentDidMount() {
        const { document } = this.props;
        const { id, scope } = document || {};

        let tmpDocument = {
            id, scope
        }

        this.setTmpDocument(tmpDocument);
    }

    componentDidUpdate(prevProps: Readonly<DocumentPanelProps>, prevState: Readonly<DocumentPanelState>, snapshot?: any) {
        const { document, nlpCompleteAnimation } = this.props;
        const { nlpComplete } = document;
        const { showStatusBanner } = this.state;

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

        if (nlpCompleteAnimation === false && showStatusBanner && nlpComplete === true) {
            this.setState({
                ...this.state,
                showStatusBanner: false,
            })
        } else if (nlpComplete === false || nlpCompleteAnimation === true && !showStatusBanner) {
            this.setState({
                ...this.state,
                showStatusBanner: true,
            })
        }
    }

    setTmpDocument(doc: DocumentInfoVM) {

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
            let nextDoc = {
                ...tmpDocument,
                [name]: value
            };

            if (typeof value === 'object') {
                if (JSON.stringify(document[name]) === JSON.stringify(value)) {
                    delete nextDoc[name];
                }
            } else if (document[name] === value) {
                delete nextDoc[name];
            }
            this.setTmpDocument(nextDoc);
        }
        console.log(JSON.stringify(value));
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
            else if (typeof tmpDocument[key] === 'object') {
                if (JSON.stringify(tmpDocument[key]) === JSON.stringify(document[key])) {
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
        const { onUpdateDocument, document } = this.props;
        const { tmpDocument, isPrivate } = this.state;

        const { id } = document;

        if (onUpdateDocument) {
            let updatedDocument = tmpDocument;

            updatedDocument['id'] = id;

            onUpdateDocument({...updatedDocument});
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

        let editValue = tmpDocument ? tmpDocument[id] : [];

        let value = editValue ? editValue : originalValue;

        let result: Record<string, string> = {};

        forEachKVP(value, ((item: string) => {
            result[item] = item;
        }));

        result["-1"] = "";

        this.onTmpDocumentChanged('public_tag', result)
    }

    addNewPrivateTag() {
        const { editProperties, document, userProfile } = this.props;
        const { tmpDocument } = this.state;
        const { original_private_tag } = document;
        const { id:user_id } = userProfile;

        const {id} = editProperties['private_tag'];

        let originalValue = document ? document[id] : [];
        originalValue = originalValue || [];

        let editValue = tmpDocument ? tmpDocument[id] : [];

        let value = editValue ? editValue : originalValue;

        let result: Record<string, string> = {};

        forEachKVP(value, ((item: string) => {
            result[item] = item;
        }));

        result["-1"] = "";

        // let privateTags: Record<string, Record<string, string>> = {};
        // if (original_private_tag) {
        //     forEachKVP(original_private_tag, (itemKey: string, itemValue: Record<string, string>) => {
        //         if (itemKey !== user_id) {
        //             privateTags[itemKey] = itemValue;
        //         }
        //     })
        // }
        //
        // privateTags[user_id] = result;

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

    _convertDateFormat(date: string) {
        let result = "";

        let dateArray = date.split("-");

        if (dateArray[0] && dateArray[1] && dateArray[2]) {
            let yyyy = dateArray[0];
            let mm = dateArray[1];
            let dd = dateArray[2];

            result = mm + "/" + dd + "/" + yyyy;
        }

        return result;
    }

    getCellRenderer(tmpDocument: DocumentInfoVM, document: DocumentInfoVM, editProperty: EditPropertyVM, isGlobal?: boolean) {
        const { permissions } = this.props;
        const { canModify } = permissions;
        const {id, type, title='test', options={}, long=false} = editProperty;
        const { id:document_id, status } = document;
        const { showTagEditor } = this.state;

        let cellRenderer = null;

        let originalValue = document ? document[id] : '';
        originalValue = originalValue || '';

        let editValue = tmpDocument ? tmpDocument[id] : '';

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
                            let mm = dateArray[0].length == 1 ? "0" + dateArray[0] : dateArray[0];
                            let dd = dateArray[1].length == 1 ? "0" + dateArray[1] : dateArray[1];

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

                let publicTagDivs: any[] = [];
                let length = 0;
                let truncatedPublicTagDivs: any[] = [];

                if (id === "public_tag" || id === "private_tag") {
                    if (value) {
                        forEachKVP(value, (tag: string) => {

                            if (tag.length > 0) {
                                publicTagDivs?.push(<Tag name={id} text={tag} onDelete={onClick} isGlobal={isGlobal}
                                                         className={"mr-4"} isEdit={tag.trim() === "-1"} key={tag}
                                                         readonly={!canModify} onSubmit={onSubmit}/>)
                            }
                        })
                    }

                    if (value) {
                        forEachKVP(value, (tag: string) => {
                            if (tag.length > 0) {
                                if (length < 3) {
                                    truncatedPublicTagDivs?.push(<Tag name={id} text={tag} onDelete={onClick}
                                                                      isGlobal={isGlobal} className={"mr-4"} key={tag + "_short"}
                                                                      isEdit={tag.trim() === "-1"} readonly={!canModify}
                                                                      onSubmit={onSubmit}/>)
                                }
                                length++;
                            }
                        })
                    }
                }

                cellRenderer = (
                    <div className={'d-flex flex-nowrap align-self-center align-items-center overflow-hidden w-100'}>

                        {
                            !showTagEditor &&
                            <div className={'d-flex flex-nowrap align-self-center overflow-hidden'} key={id}>
                                {truncatedPublicTagDivs}
                            </div>
                        }
                        {
                            permissions.canModify && (length < 3) &&
                            <Button className={'tag-button fill-primary'}
                                 onClick={isGlobal ? this.addNewPublicTag : this.addNewPrivateTag}>
                                <AddNewSVG className={"nano-image-container"}/>
                            </Button>
                        }

                        {
                            length > 2 &&
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
                                                    {publicTagDivs}
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
                                    length > 2 &&
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

    _setShowStatusBanner(value: boolean) {
        this.setState({
            ...this.state,
            showStatusBanner: value,
        })
    }

    _getScope(title: string) {
        const { editProperties } = this.props;
        const { options={} } =  editProperties['scope'];

        let result = "";

        forEach(Object.values(options), (option: { title: string; id: any; }) => {
            if (option.title === title) {
                result = option.id;
            }
        })
        return result;
    }

    _formatType(type: string) {
        let result = type;

        switch (type.toLowerCase()) {
            case "application/msword":
            case "application/vnd.ms-word.document.macroEnabled.12":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
            case "application/vnd.ms-word.template.macroEnabled.12":
                result = "MS Word Doc";
                break;
            case "text/html":
                result = "HTML";
                break;
            case "application/pdf":
                result = "PDF";
                break;
            case "application/vnd.ms-powerpoint.template.macroEnabled.12":
            case "application/vnd.openxmlformats-officedocument.presentationml.template":
            case "application/vnd.ms-powerpoint.addin.macroEnabled.12":
            case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
            case "application/vnd.ms-powerpoint.slideshow.macroEnabled.12":
            case "application/vnd.ms-powerpoint":
            case "application/vnd.ms-powerpoint.presentation.macroEnabled.12":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                result = "PowerPoint";
                break;
            case "application/rtf":
                result = "rtf";
                break;
            case "text/rtf":
                result = "rtf2";
                break;
            case "text/plain":
                result = "Plain Text";
                break;
            case "text/csv":
                result = "csv";
                break;
            case "application/csv":
                result = "csv1";
                break;
            case "application/json":
                result = "JSON";
                break;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            case "application/vnd.ms-excel.sheet.binary.macroEnabled.12":
            case "application/vnd.ms-excel":
            case "application/vnd.ms-excel.sheet.macroEnabled.12":
                result = "Excel Spreadsheet";
                break;
            case "image/bmp":
                result = "BMP";
                break;
            case "image/gif":
                result = "GIF";
                break;
            case "image/jpeg":
                result = "JPEG";
                break;
            case "image/png":
                result = "PNG";
                break;
            case "multipart/form-data":
                result = "file";
                break;
            default:
                break;
        }

        return result;
    }

    render() {
        const {
            document, onUpdateDocument, onRemoveDocument, pdfRenderer: PdfRenderer, editProperties, userProfile, token,
            className, permissions, nlpCompleteAnimation, ...rest
        } = this.props;
        const {id, preview_url = "", original_url, isUpdating=false, upload_date, publication_date, file_type, uploaded_by,
            primary_sme_name, primary_sme_phone, primary_sme_email, secondary_sme_name, secondary_sme_phone, secondary_sme_email,
            file_name, file_size, status, nlpComplete} = document || {};

        const { tmpDocument, isDirty, isGlobal, isPrivate, showStatusBanner } = this.state;

        let cn = "document-panel d-flex";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <div className={'d-flex flex-fill flex-column align-items-stretch'}>
                    {/*<div className={'header-1 title py-4 pl-5'}>DOCUMENT INFORMATION</div>*/}
                    <div className={`header position-relative`}>
                        <div className={`d-flex flex-column p-4 v-gap-5 position-relative ${!id && 'disabled'} `}>
                            {/*</Card>*/}
                            <div className={"d-flex flex-column v-gap-1 header-1"}>
                                <div className={'title-grid'}>
                                    <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-right label'}>Title:</div>
                                    <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-right label'}>Author:</div>
                                    {
                                        this.getCellRenderer(tmpDocument, document, editProperties['title'])
                                    }
                                    {
                                        this.getCellRenderer(tmpDocument, document, editProperties['author'])
                                    }
                                </div>
                                <div className={'property-grid'}>
                                    <div className={"d-flex h-gap-5"}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right label'}>Publication Date:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['publication_date'])
                                        }
                                    </div>
                                    <div className={"d-flex h-gap-5"}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right label'}>Dept:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['department'])
                                        }
                                    </div>
                                    <div className={"d-flex h-gap-5"}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right label'}>Project:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['project'])
                                        }
                                    </div>
                                    <div className={"d-flex h-gap-5"}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right label'}>Purpose:</div>
                                        {
                                            this.getCellRenderer(tmpDocument, document, editProperties['purpose'])
                                        }
                                    </div>
                                </div>
                            </div>

                            <Card className={`d-flex flex-column overflow-hidden pl-5`}
                                  header={
                                      <div className={"d-flex info-button justify-content-start"}>
                                          <div className={'d-flex h-gap-3 align-items-center'}>
                                              <InfoSVG className={'small-image-container'}/>
                                              <div className={'header-2'}>More Info</div>
                                          </div>
                                      </div>
                                  }
                                  body={
                                      <div className={'d-flex flex-column pt-5 text-info'}>
                                          <div className={'info-grid'}>
                                              <div className={'align-self-center justify-self-end header-3'}>ORIGINAL FILE NAME</div>
                                              <div className={'align-self-center justify-self-end header-3'}>UPLOADED BY</div>
                                              <div className={'align-self-center justify-self-end header-3'}>UPLOAD DATE</div>
                                              <div className={'align-self-center justify-self-end header-3'}>TYPE</div>
                                              <div className={'align-self-center justify-self-end header-3'}>SIZE</div>
                                              <div className={'align-self-center header-2'}>{file_name}</div>
                                              <div className={'align-self-center header-2'}>{uploaded_by}</div>
                                              <div className={'align-self-center header-2'}>{upload_date?.split(",")[0]}</div>
                                              <div className={'align-self-center header-2'}>{this._formatType(file_type || "")}</div>
                                              <div className={'align-self-center header-2'}>{file_size}</div>
                                          </div>

                                          <div className={'sme-grid'}>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>PRIMARY SME</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_name'])
                                                  }
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>PHONE</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_phone'])
                                                  }
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>EMAIL</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['primary_sme_email'])
                                                  }
                                              </div>

                                          </div>

                                          <div className={'sme-grid'}>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>SECONDARY SME</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_name'])
                                                  }
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>PHONE</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_phone'])
                                                  }
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>EMAIL</div>
                                                  {
                                                      this.getCellRenderer(tmpDocument, document, editProperties['secondary_sme_email'])
                                                  }
                                              </div>
                                          </div>
                                      </div>
                                  }
                            />

                            <div className={'d-flex flex-column v-gap-4 pl-4'} >
                                <div className={'d-flex align-items-center justify-content-between'}>
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
                                    <PdfRenderer preview_url={preview_url} original_url={original_url} userProfile={userProfile} token={token} permissions={permissions}/> :
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
                        onExited={() => this._setShowStatusBanner(false)}
                        in={nlpComplete === false || nlpCompleteAnimation === true}
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
                        ((permissions.canModify || permissions.canDelete) && JSON.stringify(document) !== '{}') &&
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
                                {/*{*/}
                                {/*    permissions.canModify && isDirty &&*/}
                                {/*    <Button*/}
                                {/*        disabled={!isDirty}*/}
                                {/*        text={'CANCEL'} onClick={this.cancelEdit}/>*/}
                                {/*}*/}
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

export default DocumentPanelView;
