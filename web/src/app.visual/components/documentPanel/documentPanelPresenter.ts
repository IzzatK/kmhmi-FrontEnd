import DocumentPanelView from "./documentPanelView";
import {createSelector} from "@reduxjs/toolkit";
import {
    DocumentInfo,
    ExcerptMapper,
    NoteInfo,
    ParamType,
    PocketMapper,
    ReferenceType, ReportInfo,
    ResourceMapper, TagInfo, UserInfo
} from "../../../app.model";
import {
    authenticationService,
    authorizationService,
    documentService, pocketService,
    referenceService, reportService,
    selectionService, tagService,
    userService,
} from "../../../serviceComposition";
import {
    CreateExcerptEventData,
    DocumentInfoVM, DocumentPanelDispatchProps, DocumentPanelStateProps, DocumentUpdateParams, ExcerptVM, NoteVM,
    PocketVM
} from "./documentPanelModel";
import {
    DocumentParamType,
    ExcerptParamType,
    NoteParamType,
    PERMISSION_ENTITY,
    PERMISSION_OPERATOR,
    PocketParamType,
    ResourceParamType,
} from "../../../app.core.api";
import {StatusType} from "../../../app.model";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {createVisualConnector, VisualWrapper} from "../../../framework.visual";
import {TagItemVM} from "../../theme/widgets/tag/tagModel";

class DocumentPanel extends VisualWrapper {

    private pollingForNLPStatus: boolean;
    private readonly documentLookup: Record<string, boolean>;

    constructor() {
        super();

        this.id = 'app.visual/components/documentPanel';

        this.view = DocumentPanelView;

        this.displayOptions = {
            containerId: 'document-preview-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: '',
        };

        this.mapStateToProps = (state: any): DocumentPanelStateProps => {
            return {
                document: this.getDocument(state),
                editProperties: this._getEditProperties(),
                userProfile: authenticationService.getUserProfile(),
                token: authenticationService.getToken(),
                permissions: this.getPermissions(state),
                pockets: this.getPockets(state),
                excerpts: this.getExcerpts(state),
                tagSuggestionSupplier: text => this._getSuggestedTags(text)
            }
        }

        this.mapDispatchToProps = (): DocumentPanelDispatchProps => {
            return {
                onUpdateDocument: (edits: DocumentUpdateParams) => this._onUpdateDocument(edits),
                onRemoveDocument: (id: string) => documentService.removeDocument(id),
                onCreateExcerpt: (params: CreateExcerptEventData) => this._createExcerpt(params),
                onSaveNote: (note) => this._onSaveNote(note)
            };
        }

        this.pollingForNLPStatus = false;
        this.documentLookup = {};
    }

    _onUpdateDocument(edits: DocumentUpdateParams) {
        const params: DocumentParamType = {};

        forEachKVP(edits, (itemKey: keyof DocumentParamType, itemValue: any) => {
            params[itemKey] = itemValue;
        });

        documentService.updateDocument(params);
    }

    _onSaveNote(note: NoteVM) {
        // pocketService.addOrUpdateNote({
        //     id: note.id,
        //     text: note.text,
        //     content: note.content
        // })

        // pocketService.addNoteAndExcerptToPocket(noteParams, excerptParams, resourceParams, pocketParams);
    }

    _createExcerpt(params: CreateExcerptEventData) {
        const excerptParams: ExcerptParamType = {
            text: params.excerpt_text,
            content: JSON.stringify(params.excerpt_content),
            location: params.excerpt_location,
        };

        const noteParams: NoteParamType = {
            text: params.note_text,
            content: params.note_content,
        };

        const resourceParams: ResourceParamType = {
            source_id: params.doc_id
        }

        if (params.pocketId === "") {
            pocketService.addOrUpdatePocket({title: "New Pocket"})
                .then(pocketMapper => {
                    if (pocketMapper) {
                        const pocketParams: PocketParamType = {
                            id: pocketMapper.id
                        }
                        if (params.note_text === "") {
                            pocketService.addExcerptToPocket(excerptParams, resourceParams, pocketParams);
                        } else {
                            pocketService.addNoteAndExcerptToPocket(noteParams, excerptParams, resourceParams, pocketParams);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            const pocketParams: PocketParamType = {
                id: params.pocketId
            }

            if (params.note_text === "") {
                pocketService.addExcerptToPocket(excerptParams, resourceParams, pocketParams);
            } else {
                pocketService.addNoteAndExcerptToPocket(noteParams, excerptParams, resourceParams, pocketParams);
            }
        }

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
    getSelectedReportId = selectionService.makeGetContext("selected-report");

    getSelectedId = createSelector(
        [
            (s) => this.getSelectedDocumentId(s),
            (s) => this.getSelectedReportId(s)
        ],
        (selectedDocumentId, selectedReportId) => {

            let result: string = "";

            if (selectedDocumentId && selectedDocumentId !== "") {
                result = selectedDocumentId;
            } else if (selectedReportId && selectedReportId !== "") {
                result = selectedReportId;
            }

            return result;
        }
    )

    getDocument = createSelector(
        [
            (s) => this.getSelectedId(s),
            (s) => documentService.getAllDocuments(),
            (s) => reportService.getReports(),
            (s) => userService.getCurrentUserId(),
            (s) => userService.getActiveUsers(),
        ], // if this changes, will re-evaluate the combiner and trigger a re-render
        (
            selectedId,
            documents: Record<string, DocumentInfo>,
            reports: Record<string, ReportInfo>,
            currentUserId: string,
            userLookup: Record<string, UserInfo>
        ) => {

            let searchResult: DocumentInfo | ReportInfo = documents[selectedId];

            let itemVM: DocumentInfoVM = {};

            // debugger

            if (searchResult) {
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
                } = searchResult;

                let nlpComplete: boolean;
                let showAnimation: boolean = false;
                let showStatusBanner: boolean;

                if (uploadedBy_id === currentUserId) {
                    nlpComplete = (status === StatusType.NLP_COMPLETE);
                    if (this.documentLookup[id] !== undefined) {
                        if (nlpComplete && !this.documentLookup[id]) {
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
            } else {
                searchResult = reports[selectedId];

                if (searchResult) {
                    const {
                        id,
                        author_id="",
                        private_tag={},
                        public_tag={},
                        publication_date="",
                        scope="",
                        title="",
                        upload_date="",
                        uploadedBy_id="",
                        preview_url="",
                        original_url="",
                        isUpdating,
                    } = searchResult

                    let displayAuthor = author_id;

                    if (userLookup) {
                        const user = userLookup[author_id];

                        if (user) {
                            displayAuthor = user.first_name + " " + user.last_name;
                        }
                    }

                    let displayPublicationDate = new Date(publication_date).toLocaleString().split(",")[0];

                    let previewAvailable = false;

                    let displayPrivateTags: Record<string, string> = {};
                    if (private_tag) {
                        const current_user_id = userService.getCurrentUserId()
                        if (private_tag[current_user_id]) {
                            displayPrivateTags = private_tag[current_user_id];
                        }
                    }

                    itemVM  = {
                        id,
                        author: displayAuthor,
                        private_tag: displayPrivateTags,
                        original_private_tag: private_tag,
                        public_tag: public_tag,
                        publication_date: displayPublicationDate,
                        scope: scope,
                        title,
                        upload_date: upload_date ? new Date(upload_date).toLocaleString() : 'No Upload Date',
                        uploadedBy_id: uploadedBy_id,
                        preview_url: previewAvailable ? preview_url : '',
                        original_url: previewAvailable ? original_url : '',
                        isUpdating: isUpdating,
                    }
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


    getExcerpts = createSelector(
        [() => pocketService.getPocketMappers(), (s) => this.getSelectedDocumentId(s)],
        (pocketMappers, documentId) => {

            let results: Record<string, ExcerptVM> = {};

            forEach(pocketMappers, (pocketMapper: PocketMapper) => {
                forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
                    if (resourceMapper.resource.source_id == documentId) {
                        forEach(resourceMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {

                            const noteVM: NoteVM = {
                                id: 'null',
                                content: "",
                                text: ""
                            }

                            if (excerptMapper.excerpt.noteIds.length > 0) {
                                const keys = Object.keys(excerptMapper.notes);
                                const note: NoteInfo = excerptMapper.notes[keys[0]];

                                if (note != null) {
                                    noteVM.id = note.id;
                                    noteVM.content = note.content;
                                    noteVM.text = note.text
                                }
                            }

                            const itemVM:ExcerptVM = {
                                id: excerptMapper.id,
                                text: excerptMapper.excerpt.text,
                                content: excerptMapper.excerpt.content,
                                pocketId: pocketMapper.pocket.id,
                                noteVM: noteVM,
                                location: excerptMapper.excerpt.location,
                            }

                            results[excerptMapper.id] = itemVM;
                        })
                        return true;
                    }
                })
            })

            return results;
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

    private _getSuggestedTags(text: string) {

        return new Promise<TagItemVM[]>((resolve, reject) => {
            tagService.searchTags(text)
                .then(result => {
                    const tagVMs: TagItemVM[] = [];

                    forEach(result, (tag: TagInfo) => {
                        tagVMs.push({
                            id: tag.id,
                            title: tag.title
                        })
                    })

                    resolve(tagVMs);
                })
                .catch(error => {
                    console.log(error);
                    resolve([]);
                })
        })
    }
}

export const {
    connectedPresenter: DocumentPanelPresenter,
    componentId: DocumentPanelId
} = createVisualConnector(DocumentPanel);
