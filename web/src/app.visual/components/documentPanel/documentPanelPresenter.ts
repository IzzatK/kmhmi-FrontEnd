import DocumentPanelView from "./documentPanelView";
import {createSelector} from "@reduxjs/toolkit";
import {
    DocumentInfo,
    ExcerptInfo,
    NoteInfo,
    ParamType,
    PocketInfo,
    ReferenceType,
    ResourceInfo
} from "../../../app.model";
import {
    authenticationService,
    authorizationService,
    documentService, pocketService,
    referenceService, repoService,
    selectionService,
    userService,
} from "../../../serviceComposition";
import {
    DocumentInfoVM,
    PermissionsVM,
    PocketVM
} from "./documentPanelModel";
import {
    ExcerptParamType,
    NoteParamType,
    PERMISSION_ENTITY,
    PERMISSION_OPERATOR,
    PocketParamType,
    ResourceParamType
} from "../../../app.core.api";
import {StatusType} from "../../../app.model";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {createComponentWrapper, Presenter} from "../../../framework.visual";

class DocumentPanel extends Presenter {

    private pollingForNLPStatus: boolean;
    private readonly documentLookup: Record<string, boolean>;

    constructor() {
        super();

        this.id = 'components/documentPanel';

        this.view = DocumentPanelView;

        this.displayOptions = {
            containerId: 'document-preview-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'shrinkHorizontal-active',
        };

        this.mapStateToProps = (state: any) => {
            return {
                document: this.getDocument(state),
                // pdfRenderer: DocumentPdfPreview,
                editProperties: this._getEditProperties(),
                userProfile: authenticationService.getUserProfile(),
                token: authenticationService.getToken(),
                permissions: this.getPermissions(state),
                pockets: this.getPockets(state),
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onUpdateDocument: (document: DocumentInfoVM) => documentService.updateDocument(document),
                onRemoveDocument: (id: string) => documentService.removeDocument(id),
                onSaveExcerpt: (documentId: string, excerptText: string, excerptContent: string, location: string, noteText: string, noteContent: string) => {
                    this._saveExcerpt(documentId, excerptText, excerptContent, location, noteText, noteContent);
                },
            };
        }

        this.pollingForNLPStatus = false;
        this.documentLookup = {};
    }

    _saveExcerpt(documentId: string, excerptText: string, excerptContent: string, location: string, noteText: string, noteContent: string) {
        // console.log(documentId + " " + excerptText + " " + excerptContent + " " + location + " " + noteText + " " + noteContent);

        const excerptParams: ExcerptParamType = {
            text: excerptText,
            content: excerptContent,
            location: location,
        };

        const noteParams: NoteParamType = {
            text: noteText,
            content: noteContent,
        };

        const resourceParams: ResourceParamType = {

        }

        const pocketParams: PocketParamType = {

        }

        pocketService.addNoteToExcerpt(noteParams, excerptParams, resourceParams, pocketParams);
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
        [(s) => this.getSelectedDocumentId(s),(s) => documentService.getAllDocuments(), (s) => userService.getCurrentUserId()], // if this changes, will re-evaluate the combiner and trigger a re-render
        (documentId, documents: Record<string, DocumentInfo>, currentUserId: string) => {

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

                let nlpComplete: boolean;
                let showAnimation: boolean = false;
                let showStatusBanner: boolean;

                if (uploadedBy_id === currentUserId) {
                    nlpComplete = (status === StatusType.NLP_COMPLETE);
                    if (this.documentLookup[id] !== undefined) {
                        if (nlpComplete && this.documentLookup[id] === false) {
                            showAnimation = true;
                            setTimeout(() => {
                                //TODO this is a temporary solution - if this stays around, may want to look into an animation service or something
                                //TODO right now this call only serves to update mapStateToProps - otherwise it is completely unnecessary
                                documentService.fetchDocument(id);
                            }, 3000)
                        } else {
                            showAnimation = false;
                        }
                    }
                    this.documentLookup[id] = nlpComplete;
                } else {
                    nlpComplete = true;
                }

                showStatusBanner = !nlpComplete || showAnimation;

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
                    showStatusBanner: showStatusBanner,
                    nlpCompleteAnimation: showAnimation,
                }
            }

            return itemVM;
        }
    );

    getPermissions = createSelector(
        [(s) => this.getDocument(s), (s) => userService.getCurrentUserId(), (s) => authorizationService.getPermissions],
        (documentInfoVM, currentUserId, permissionInfoLookup) => {

            let uploadedBy = documentInfoVM?.uploadedBy_id || null;

            return {
                canDelete: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DELETE, currentUserId, uploadedBy),
                canDownload: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DOWNLOAD, currentUserId, uploadedBy),
                canModify: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.MODIFY, currentUserId, uploadedBy)
            }
        }
    )

    getPockets = createSelector(
        [() => pocketService.getPocketInfos()],
        (items) => {
            let itemVMs: Record<string, PocketVM> = {};

            forEachKVP(items, (itemKey: string, itemValue: PocketVM) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    tmpMethod(documentId: string) {

        const noteParams: NoteParamType = {
            text: 'something',
            content: 'maybe'
        };

        const excerptParams: ExcerptParamType = {
            text: 'something',
            location: 'hard-coded',
            content: 'maybe'
        }

        const reportDocumentParams: ResourceParamType = {
            id: documentId
        }

        // pocketService.addNoteToExcerpt(noteParams, excerptParams, reportDocumentParams);

        // pocketService.getOrCreateNote(null, 'my text here', 'whatever blob')
        //     .then(note => {
        //         let excerptId = null;
        //         if (note != null) {
        //             pocketService.getOrCreateExcerpt(null, 'my test', 'some content', 'location', [note.id])
        //                 .then(excerpt => {
        //                     if (excerpt != null) {
        //
        //                     }
        //                 })
        //         }
        //
        //     })

    }
}

export const {
    connectedPresenter: DocumentPanelPresenter,
    componentId: DocumentPanelId
} = createComponentWrapper(DocumentPanel);
