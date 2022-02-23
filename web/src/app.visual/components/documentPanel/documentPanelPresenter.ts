import DocumentPanelView from "./documentPanelView";
import {createSelector} from "@reduxjs/toolkit";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import DocumentPdfPreview from "./documentPdfPreview";
import {DocumentInfo, ParamType, ReferenceType} from "../../../app.model";
import {
    authenticationService,
    authorizationService,
    documentService,
    referenceService,
    selectionService,
    userService,
} from "../../../app.core/serviceComposition";
import {DocumentInfoVM, PermissionsVM} from "./documentPanelModel";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../app.core.api";
import {PermissionInfo} from "../../../app.model/permissionInfo";
import {StatusType} from "../../../app.model/statusType";

class DocumentPanel extends Presenter {

    private pollingForNLPStatus: boolean;
    private documentLookup: Record<string, boolean>;
    private showAnimation: boolean;

    constructor() {
        super();

        this.id = 'components/documentPanel';

        this.view = DocumentPanelView;

        this.displayOptions = {
            containerId: '',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'shrinkHorizontal-active',
        };

        this.mapStateToProps = (state: any) => {
            return {
                document: this.getDocument(state),
                pdfRenderer: DocumentPdfPreview,
                editProperties: this._getEditProperties(),
                userProfile: authenticationService.getUserProfile(),
                token: authenticationService.getToken(),
                permissions: this.getPermissions(state),
                nlpCompleteAnimation: this.showAnimation,
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onUpdateDocument: (document: DocumentInfoVM) => documentService.updateDocument(document),
                onRemoveDocument: (id: string) => documentService.removeDocument(id)
            };
        }

        this.pollingForNLPStatus = false;
        this.documentLookup = {};
        this.showAnimation = false;
    }

    _getEditProperties = () => {
        return {
            ['title']: {
                id: 'title',
                title: 'Document Title goes here',
                type: ParamType.STRING,
                long: true,
            },
            ['author']: {
                id: 'author',
                title: 'Authors go here',
                type: ParamType.STRING,
                long: true,
            },
            ['publication_date']: {
                id: 'publication_date',
                title: 'Publication Date',
                type: ParamType.STRING,
            },
            ['project']: {
                id: 'project',
                title: 'Project',
                type: ParamType.STRING
            },
            ['purpose']: {
                id: 'purpose',
                title: 'Purpose',
                type: ParamType.OPTIONS,
                options: referenceService.getAllReferences(ReferenceType.PURPOSE)
            },
            ['department']: {
                id: 'department',
                title: 'Department',
                type: ParamType.OPTIONS,
                options: referenceService.getAllReferences(ReferenceType.DEPARTMENT)
            },
            ['status']: {
                id: 'status',
                title: 'Status',
                type: ParamType.OPTIONS,
                options: referenceService.getAllReferences(ReferenceType.STATUS)
            },
            ['private_tag']: {
                id: 'private_tag',
                title: 'Personal Tags',
                type: ParamType.ARRAY
            },
            ['public_tag']: {
                id: 'public_tag',
                title: 'Shared Tags',
                type: ParamType.ARRAY
            },
            ['primary_sme_name']: {
                id: 'primary_sme_name',
                title: 'Full Name',
                type: ParamType.STRING
            },
            ['primary_sme_email']: {
                id: 'primary_sme_email',
                title: 'Email Address',
                type: ParamType.STRING
            },
            ['primary_sme_phone']: {
                id: 'primary_sme_phone',
                title: 'Phone Number',
                type: ParamType.STRING
            },
            ['secondary_sme_name']: {
                id: 'secondary_sme_name',
                title: 'Full Name',
                type: ParamType.STRING
            },
            ['secondary_sme_email']: {
                id: 'secondary_sme_email',
                title: 'Email Address',
                type: ParamType.STRING
            },
            ['secondary_sme_phone']: {
                id: 'secondary_sme_phone',
                title: 'Phone Number',
                type: ParamType.STRING
            },
        };
    }

    getSelectedDocumentId = selectionService.makeGetContext("selected-document");

    getDocument = createSelector(
        [this.getSelectedDocumentId, documentService.getAllDocuments, userService.getCurrentUserId], // if this changes, will re-evaluate the combiner and trigger a re-render
        (documentId, documents: DocumentInfo[], currentUserId: string) => {

            let document = documents[documentId];

            let itemVM: DocumentInfoVM = {};

            if (document) {
                const {
                    id,
                    author="",
                    department="",
                    file_name="",
                    file_size="",
                    file_type="",
                    file_page_count="",
                    primary_sme_email="",
                    primary_sme_name="",
                    primary_sme_phone="",
                    private_tag={},
                    project="",
                    public_tag={},
                    publication_date="",
                    purpose="",
                    secondary_sme_email="",
                    secondary_sme_name="",
                    secondary_sme_phone="",
                    status=StatusType.DRAFT,
                    scope="",
                    title="",
                    upload_date="",
                    uploadedBy_id="",
                    preview_url="",
                    original_url="",
                    isUpdating,
                    isPending,
                    suggested_author,
                    suggested_title,
                    suggested_publication_date,
                } = document || {};

                let nlpComplete;

                if (uploadedBy_id === currentUserId) {
                    nlpComplete = (status === StatusType.NLP_COMPLETE);
                    if (this.documentLookup[id] !== undefined) {
                        if (nlpComplete && this.documentLookup[id] === false) {
                            this.showAnimation = true;
                            setTimeout(() => {
                                this.showAnimation = false;
                                //TODO this is a temporary solution - if this stays around, may want to look into an animation service or something
                                //TODO right now this call only serves to update mapStateToProps - otherwise it is completely unnecessary
                                documentService.fetchDocument(id);
                            }, 3000)
                        }
                    }
                    this.documentLookup[id] = nlpComplete;
                } else {
                    nlpComplete = true;
                }

                let displayAuthor = author;
                if (!author || author === "") {
                    displayAuthor = suggested_author;
                }

                let displayTitle = title;
                if (!title || title === "") {
                    if (!suggested_title || suggested_title === "") {
                        displayTitle = file_name;
                    } else {
                        displayTitle = suggested_title;
                    }
                }

                let displayPublicationDate = new Date(publication_date).toLocaleString().split(",")[0];
                if (!publication_date || publication_date === "") {
                    if (!suggested_publication_date || suggested_publication_date === "") {
                        displayPublicationDate = "No Publication Date";
                    } else {
                        displayPublicationDate = new Date(suggested_publication_date).toLocaleString().split(",")[0];
                    }
                }

                let displayStatus = "";
                displayStatus = status.toString();

                if (status !== StatusType.NLP_COMPLETE && !nlpComplete) {

                    if (!this.pollingForNLPStatus) {
                        setTimeout(() => {
                            this.pollingForNLPStatus = false;
                            documentService.fetchDocument(id);
                        }, 10000);
                    }

                    this.pollingForNLPStatus = true;
                }

                let previewAvailable = false;
                if (status === StatusType.PDF_AVAILABLE || status === StatusType.SEARCHABLE || status === StatusType.NLP_COMPLETE) {
                    previewAvailable = true;
                }

                let displayPrivateTags: Record<string, string> = {};
                if (private_tag) {
                    const current_user_id = userService.getCurrentUserId()
                    if (private_tag[current_user_id]) {
                        displayPrivateTags = private_tag[current_user_id];
                    }
                }

                itemVM  = {
                    id: id,
                    author: displayAuthor,
                    department: department,
                    file_name: file_name,
                    file_size: file_size,
                    file_type: file_type,
                    file_page_count: file_page_count,
                    primary_sme_email: primary_sme_email,
                    primary_sme_name: primary_sme_name,
                    primary_sme_phone: primary_sme_phone,
                    private_tag: displayPrivateTags,
                    original_private_tag: private_tag,
                    project: project,
                    public_tag: public_tag,
                    publication_date: displayPublicationDate,
                    purpose: purpose,
                    secondary_sme_email: secondary_sme_email,
                    secondary_sme_name: secondary_sme_name,
                    secondary_sme_phone: secondary_sme_phone,
                    status: displayStatus,
                    scope: scope,
                    title: displayTitle,
                    upload_date: upload_date ? new Date(upload_date).toLocaleString() : 'No Upload Date',
                    uploadedBy_id: uploadedBy_id,
                    preview_url: previewAvailable ? preview_url : '',
                    original_url: previewAvailable ? original_url : '',
                    isUpdating: isUpdating,
                    isPending: isPending,
                    nlpComplete: nlpComplete,
                }
            }

            return itemVM;
        }
    );

    getPermissions = createSelector<any, DocumentInfoVM, string, Record<string, PermissionInfo>, PermissionsVM>(
        [this.getDocument, () => userService.getCurrentUserId(), authorizationService.getPermissions],
        (documentInfoVM, currentUserId, permissionInfoLookup) => {

            let uploadedBy = documentInfoVM?.uploadedBy_id || null;

            return {
                canDelete: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DELETE, currentUserId, uploadedBy),
                canDownload: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DOWNLOAD, currentUserId, uploadedBy),
                canModify: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.MODIFY, currentUserId, uploadedBy)
            }
        }
    )
}

export const {
    connectedPresenter: DocumentPanelPresenter,
    componentId: DocumentPanelId
} = createComponentWrapper(DocumentPanel);
