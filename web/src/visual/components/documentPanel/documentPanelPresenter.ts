import DocumentPanelView from "./documentPanelView";
import {createSelector} from "@reduxjs/toolkit";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import DocumentPdfPreview from "./documentPdfPreview";
import {DocumentInfo, ParamType, ReferenceType} from "../../../model";
import {
    authenticationService,
    authorizationService,
    documentService,
    referenceService,
    selectionService,
    userService,
} from "../../../application/serviceComposition";
import {DocumentInfoVM, PermissionsVM} from "./documentPanelModel";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../api";
import {PermissionInfo} from "../../../model/permissionInfo";

class DocumentPanel extends Presenter {
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
                permissions: this.getPermissions(state)
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onUpdateDocument: (document: DocumentInfoVM) => documentService.updateDocument(document),
                onRemoveDocument: (id: string) => documentService.removeDocument(id)
            };
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
        [this.getSelectedDocumentId, documentService.getAllDocuments], // if this changes, will re-evaluate the combiner and trigger a re-render
        (documentId, documents: DocumentInfo[]) => {

            let document = documents[documentId];

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
                private_tag=[],
                project="",
                public_tag=[],
                publication_date="",
                purpose="",
                secondary_sme_email="",
                secondary_sme_name="",
                secondary_sme_phone="",
                status="",
                title="",
                upload_date="",
                uploadedBy_id="",
                preview_url="",
                original_url="",
                isUpdating,
                isPending,
            } = document || {};

            let itemVM: DocumentInfoVM = {
                id: id,
                author: author,
                department: department,
                file_name: file_name,
                file_size: file_size,
                file_type: file_type,
                file_page_count: file_page_count,
                primary_sme_email: primary_sme_email,
                primary_sme_name: primary_sme_name,
                primary_sme_phone: primary_sme_phone,
                private_tag: private_tag,
                project: project,
                public_tag: public_tag,
                publication_date: publication_date ? new Date(publication_date).toLocaleString().split(",")[0] : 'No Publication Date',
                purpose: purpose,
                secondary_sme_email: secondary_sme_email,
                secondary_sme_name: secondary_sme_name,
                secondary_sme_phone: secondary_sme_phone,
                status: status,
                title: title ? title : file_name,
                upload_date: upload_date ? new Date(upload_date).toLocaleString() : 'No Upload Date',
                uploadedBy_id: uploadedBy_id,
                preview_url: preview_url,
                original_url: original_url,
                isUpdating: isUpdating,
                isPending: isPending,
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
