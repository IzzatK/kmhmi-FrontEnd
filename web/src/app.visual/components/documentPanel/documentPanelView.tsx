import React, {Component} from 'react';
import './documentPanel.css';
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {ParamType} from "../../../app";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Tag from "../../theme/widgets/tag/tag";
import GlobalSwitchButton from "../../theme/widgets/globalSwitchButton/globalSwitchButton";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";
import {DocumentPanelProps, DocumentPanelState, DocumentInfoVM, EditPropertyVM} from "./documentPanelModel";
import {InfoSVG} from "../../theme/svgs/infoSVG";
import Card from "../../theme/widgets/card/card";
import CheckBox from "../../theme/widgets/checkBox/checkBox";

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
        const { canModify } = this.props.permissions;
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
                if (id === 'publication_date') {
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
                                      onSubmit={this.onTmpDocumentChanged}/>
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
                                                  isEdit={tag.trim() === "-1"} readonly={!canModify} onSubmit={onSubmit}/>
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

    _getStatus(title: string) {
        const { editProperties } = this.props;
        const { options={} } =  editProperties['status'];

        let result = "";

        forEach(Object.values(options), (option: { title: string; id: any; }) => {
            console.log(JSON.stringify(option))
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
            className, permissions, ...rest
        } = this.props;
        const {id, preview_url = "", original_url, isUpdating=false, upload_date, publication_date, file_type, uploaded_by,
            primary_sme_name, primary_sme_phone, primary_sme_email, secondary_sme_name, secondary_sme_phone, secondary_sme_email,
        file_name, file_size} = document || {};

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
                                    {
                                        permissions.canModify &&
                                        <div className={"d-flex h-gap-2 pr-3"}>
                                            <div className={"text-accent display-4 font-weight-light"}>Publish as Private</div>
                                            <CheckBox onClick={(selected) => {selected ? this.onTmpDocumentChanged("status", this._getStatus("Private")) : this.onTmpDocumentChanged("status", this._getStatus("Public"))}
                                            }/>
                                        </div>
                                    }
                                    {
                                        permissions.canDelete &&
                                        <Button text={'DELETE'} onClick={this.removeDocument}/>
                                    }
                                    {
                                        permissions.canModify && isDirty &&
                                        <Button
                                            disabled={!isDirty}
                                            text={'CANCEL'} onClick={this.cancelEdit}/>
                                    }
                                    {
                                        permissions.canModify &&
                                        <Button
                                            disabled={!isDirty}
                                            text={'PUBLISH'} highlight={true} onClick={this.updateDocument}/>
                                    }
                                </div>
                            </div>

                            {/*</Card>*/}
                            <div className={"d-flex flex-column v-gap-1 header-1"}>
                                <div className={'title-grid'}>
                                    <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Title:</div>
                                    <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Author:</div>
                                    {
                                        this.getCellRenderer(tmpDocument, document, editProperties['title'])
                                    }
                                    {
                                        this.getCellRenderer(tmpDocument, document, editProperties['author'])
                                    }
                                </div>
                                <div className={'property-grid'}>
                                    <div className={"d-flex h-gap-5"}>
                                        <div className={'header-1 font-weight-semi-bold align-self-center text-right label'}>Date:</div>
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

                                                  <div className={'align-self-center header-2'}>{primary_sme_name}</div>

                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>PHONE</div>
                                                  <div className={'align-self-center header-2'}>{primary_sme_phone}</div>
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>EMAIL</div>

                                                  <div className={'align-self-center header-2'}>{primary_sme_email}</div>

                                              </div>

                                          </div>

                                          <div className={'sme-grid'}>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>SECONDARY SME</div>

                                                  <div className={'align-self-center header-2'}>{secondary_sme_name}</div>

                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>PHONE</div>
                                                  <div className={'align-self-center header-2'}>{secondary_sme_phone}</div>
                                              </div>
                                              <div className={"d-flex h-gap-5"}>
                                                  <div className={'align-self-center text-right header-3 label'}>EMAIL</div>
                                                  <div className={'align-self-center header-2'}>{secondary_sme_email}</div>


                                              </div>
                                          </div>
                                      </div>
                                  }
                            />

                            <div className={'d-flex flex-column v-gap-4 pl-4'} >

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
                                        {
                                            permissions.canModify &&
                                            <div className={'tag-button text-primary header-1 cursor-pointer align-self-center'}
                                                 onClick={isGlobal ? this.addNewPublicTag : this.addNewPrivateTag}>+</div>
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
                </div>
            </div>
        );
    }
}

export default DocumentPanelView;
