import React, {Component} from 'react';
import ListItem from "../../../theme/widgets/listItem/listItem";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {InfoSVG} from "../../../theme/svgs/infoSVG";
import {DocumentInfoVM, SearchResultsProps, SearchResultsState} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";
import Card from "../../../theme/widgets/card/card";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";

class ListCollectionView extends Component<SearchResultsProps, SearchResultsState> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        const { className, searchResults, onDocumentSelected, pageWidth, userLookup, ...rest } = this.props;

        let cn = "list v-gap-2";
        if (className) {
            cn += ` ${className}`;
        }

        let itemDivs: {} | null | undefined = [];
        if (searchResults) {
            itemDivs = searchResults.map((item: DocumentInfoVM) => {
                const {id, author, title, timestamp, selected, scope, publication_date, public_tag, private_tag, type,
                    department, purpose, project, page_count, isUpdating, file_name, uploadedBy_id, primary_sme_email,
                    primary_sme_name, primary_sme_phone, secondary_sme_email, secondary_sme_name, secondary_sme_phone} = item;

                let user = null;
                if (userLookup) {
                    user = userLookup[uploadedBy_id || ""]
                }
                let uploaded_by="Unknown";
                if (user) {
                    if (user.first_name) {
                        uploaded_by = user.first_name;
                    }
                    if (user.last_name) {
                        uploaded_by += ` ${user.last_name}`;
                    }
                }

                let cn = 'result-item d-flex flex-row h-gap-3 justify-content-start align-items-start mr-4 overflow-hidden';
                if (selected) {
                    cn += ' selected shadow-lg'
                }

                let publicTagDivs: any[] = [];
                if (public_tag) {
                    forEachKVP(public_tag, (tag: string) => {
                        if (tag.length > 0) {
                            publicTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag}/>)
                        }
                    })
                }

                return (
                    <div key={id}>
                        <ListItem key={id} selected={selected} className={cn} onClick={() => onDocumentSelected(id)}>
                            <CheckBox className={'mt-1'} selected={selected} disabled={true}/>
                            <div className={"flex-fill align-self-stretch d-flex flex-column v-gap-3"}>
                                <div className={"d-flex w-100 flex-nowrap h-gap-2 justify-content-between"}>
                                    <TooltipPortal portalContent={
                                        <div>{title}</div>
                                    }>
                                        <div className={"font-weight-semi-bold title text-left text-break overflow-hidden"}>{title}</div>
                                    </TooltipPortal>
                                    {
                                        pageWidth === 'FULL' &&
                                        <div className={"d-flex flex-nowrap h-gap-2 justify-content-end"}>
                                            {publicTagDivs}
                                            {
                                                private_tag && private_tag.map((tag: string) => {
                                                    return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false} key={tag}/>
                                                })
                                            }
                                        </div>
                                    }
                                </div>

                                {
                                    file_name &&
                                    <div className={"header-2 text"}>{file_name}</div>
                                }

                                {
                                    pageWidth !== 'FULL' &&
                                    <div className={"d-flex flex-nowrap h-gap-2"}>
                                        {publicTagDivs}
                                        {
                                            private_tag && private_tag.map((tag: string) => {
                                                return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false} key={tag}/>
                                            })
                                        }
                                    </div>
                                }

                                <div className={`d-flex flex-nowrap h-gap-2 header-2 text-center text-nowrap justify-content-start text ${pageWidth !== 'FULL' ? 'collapsed' : ''}`}>
                                    {
                                        publication_date &&
                                        <div className={'d-flex h-gap-2 pt-2'}>
                                            <div>Publication: {publication_date.split(",")[0]}</div>
                                            <div>|</div>
                                        </div>
                                    }
                                    {
                                        timestamp &&
                                        <div className={'d-flex h-gap-2 pt-2'}>
                                            <div>Upload: {timestamp.split(",")[0]}</div>
                                            <div>|</div>
                                        </div>
                                    }
                                    {
                                        type &&
                                        <div className={'d-flex h-gap-2 pt-2'}>
                                            <div>{type}</div>
                                            <div>|</div>
                                        </div>
                                    }
                                    {
                                        page_count &&
                                        <div className={"d-flex pt-2 h-gap-1"}>
                                            <div className={"font-weight-semi-bold"}>Page Count:</div>
                                            <div>{page_count}</div>
                                        </div>
                                    }
                                </div>
                                <TooltipPortal portalContent={
                                    <div>
                                        {
                                            author &&
                                            <div>{author}</div>
                                        }
                                    </div>
                                }>
                                    {
                                        author &&
                                        <div className={`header-2 overflow-hidden text ${pageWidth !== 'FULL' ? 'collapsed' : ''}`}>Author: {author}</div>
                                    }
                                </TooltipPortal>

                                <Card className={`d-flex flex-column overflow-hidden ${pageWidth !== "ONE_THIRD" ? "collapsed" : ""}`}
                                    header={
                                        <div className={"d-flex info-button justify-content-start"}>
                                            <div className={'d-flex h-gap-3 align-items-center'}>
                                                <InfoSVG className={'small-image-container'}/>
                                                <div className={'header-2'}>More Info</div>
                                            </div>
                                        </div>
                                    }
                                    body={
                                        <div className={'d-flex pt-5 text-info'}>
                                            <div className={'property-grid'}>
                                                <div className={'align-self-center justify-self-end header-3'}>UPLOADED BY</div>
                                                <div className={'align-self-center justify-self-end header-3'}>PRIMARY SME</div>
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center justify-self-end header-3'}>PHONE</div>
                                                }
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center justify-self-end header-3'}>EMAIL</div>
                                                }
                                                <div className={'align-self-center justify-self-end header-3'}>SECONDARY SME</div>
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center justify-self-end header-3'}>PHONE</div>
                                                }
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center justify-self-end header-3'}>EMAIL</div>
                                                }
                                                <div className={'align-self-center justify-self-end header-3'}>DEPARTMENT</div>
                                                <div className={'align-self-center justify-self-end header-3'}>PURPOSE</div>
                                                <div className={'align-self-center justify-self-end header-3'}>PROJECT</div>
                                                <div className={'align-self-center justify-self-end header-3'}>STATUS</div>
                                                <div className={'align-self-center header-2'}>{uploaded_by}</div>
                                                <div className={'align-self-center header-2'}>{primary_sme_name}</div>
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center header-2'}>{primary_sme_phone}</div>
                                                }
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center header-2'}>{primary_sme_email}</div>
                                                }
                                                <div className={'align-self-center header-2'}>{secondary_sme_name}</div>
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center header-2'}>{secondary_sme_phone}</div>
                                                }
                                                {
                                                    pageWidth === "ONE_THIRD" &&
                                                    <div className={'align-self-center header-2'}>{secondary_sme_email}</div>
                                                }
                                                <div className={'align-self-center header-2'}>{department}</div>
                                                <div className={'align-self-center header-2'}>{purpose}</div>
                                                <div className={'align-self-center header-2'}>{project}</div>
                                                <div className={'align-self-center header-2'}>{scope}</div>
                                            </div>
                                            {
                                                pageWidth !== "ONE_THIRD" &&
                                                <div className={'property-grid-2 custom-margin'}>
                                                    <div className={'align-self-center justify-self-end header-3'}>PHONE</div>
                                                    <div className={'align-self-center justify-self-end header-3'}>PHONE</div>
                                                    <div className={'align-self-center header-2'}>{primary_sme_phone}</div>
                                                    <div className={'align-self-center header-2'}>{secondary_sme_phone}</div>
                                                </div>
                                            }
                                            {
                                                pageWidth !== "ONE_THIRD" &&
                                                <div className={'property-grid-2 custom-margin'}>
                                                    <div className={'align-self-center justify-self-end header-3'}>EMAIL</div>
                                                    <div className={'align-self-center justify-self-end header-3'}>EMAIL</div>
                                                    <div className={'align-self-center header-2'}>{primary_sme_email}</div>
                                                    <div className={'align-self-center header-2'}>{secondary_sme_email}</div>
                                                </div>
                                            }
                                        </div>
                                    }
                                />

                            </div>
                        </ListItem>
                        {
                            isUpdating &&
                            <div className={"position-absolute mr-4"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                                <LoadingIndicator/>
                            </div>
                        }
                    </div>
                )
            });
        }

        return (
            <ScrollBar renderTrackHorizontal={false} className={"p-0"}>
                <div className={cn} {...rest}>
                    {itemDivs}
                </div>
            </ScrollBar>

        );
    }
}

export default ListCollectionView;
