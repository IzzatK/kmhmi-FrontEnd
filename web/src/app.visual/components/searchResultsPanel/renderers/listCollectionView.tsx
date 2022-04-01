import React, {Component} from 'react';
import ListItem from "../../../theme/widgets/listItem/listItem";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {InfoSVG} from "../../../theme/svgs/infoSVG";
import {
    DocumentInfoVM, ListCollectionRendererProps,
    ListCollectionRendererState,
} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";
import Card from "../../../theme/widgets/card/card";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {EllipsisSVG} from "../../../theme/svgs/ellipsisSVG";

class ListCollectionView extends Component<ListCollectionRendererProps, ListCollectionRendererState> {
    private resizeObserver: ResizeObserver;
    private readonly characterWidth: number;
    private tagCharactersAllowed: number;
    private tagCharactersDisplayed: number;
    private nextTagWidth: number;

    private sampleId: string;

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            renderTrigger: 0,
        }

        this.characterWidth = 8.15;//pixels
        this.tagCharactersAllowed = 0;
        this.tagCharactersDisplayed = 0;
        this.nextTagWidth = 0;

        this.sampleId = "";

        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const { renderTrigger } = this.state;

                    const width = entry.contentRect.width - 29;

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
        let element = document.getElementById(this.sampleId);
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentDidUpdate(prevProps: Readonly<ListCollectionRendererProps>, prevState: Readonly<ListCollectionRendererState>, snapshot?: any) {
    let element = document.getElementById(this.sampleId);
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    render() {
        const { className, searchResults, onDocumentSelected, pageWidth, userLookup, ...rest } = this.props;

        let cn = "list v-gap-2";
        if (className) {
            cn += ` ${className}`;
        }

        let itemDivs: any[] = [];
        if (searchResults) {
            itemDivs = searchResults.map((item: DocumentInfoVM) => {
                const {id, author, title, upload_date, selected, scope, publication_date, public_tag, private_tag, type,
                    department, purpose, project, page_count, isUpdating, file_name, uploadedBy_id, primary_sme_email,
                    primary_sme_name, primary_sme_phone, secondary_sme_email, secondary_sme_name, secondary_sme_phone} = item;

                this.sampleId = id;

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

                let hoverTagDivs: any[] = [];
                let displayPublicTagDivs: any[] = [];
                let displayPrivateTagDivs: any[] = [];

                let length = 0;
                let totalLength = 0;

                let nextTagRecorded = false;

                this.tagCharactersDisplayed = 0;
                this.nextTagWidth = 0;

                if (public_tag) {
                    forEachKVP(public_tag, (tag: string) => {
                        if (tag.length > 0) {
                            this.tagCharactersDisplayed += (tag.length + (46 / this.characterWidth));

                            if (this.tagCharactersDisplayed < this.tagCharactersAllowed) {
                                displayPublicTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag + "_short"}
                                />);
                                length++;
                            } else if (!nextTagRecorded) {
                                this.nextTagWidth = tag.length;
                                nextTagRecorded = true;
                            }

                            totalLength++;

                            hoverTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag}/>)
                        }
                    })
                }

                if (private_tag) {
                    forEachKVP(private_tag, (tag: string) => {
                        if (tag.length > 0) {
                            this.tagCharactersDisplayed += (tag.length + (46 / this.characterWidth));

                            if (this.tagCharactersDisplayed < this.tagCharactersAllowed) {
                                displayPrivateTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag + "_short"}
                                />);
                                length++;
                            } else if (!nextTagRecorded) {
                                this.nextTagWidth = tag.length;
                                nextTagRecorded = true;
                            }

                            totalLength++;

                            hoverTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag}/>)
                        }
                    })
                }

                return (
                    <div key={id} draggable={true}>
                        <ListItem key={id} selected={selected} className={cn} onClick={() => onDocumentSelected(id)}>
                            <CheckBox className={'mt-1'} selected={selected} disabled={true}/>
                            <div className={"flex-fill align-self-stretch d-flex flex-column v-gap-3"}>
                                <div id={id} className={"d-flex w-100 flex-nowrap h-gap-2 justify-content-between"}>
                                    <TooltipPortal portalContent={
                                        <div>{title}</div>
                                    }>
                                        <div className={"font-weight-semi-bold title text-left text-break overflow-hidden"}>{title}</div>
                                    </TooltipPortal>
                                    {
                                        pageWidth === 'FULL' &&
                                        <TooltipPortal portalContent={
                                            <div className={'d-flex h-gap-2 justify-content-end align-items-center overflow-hidden'}>
                                                <div className={'d-inline-flex flex-wrap align-items-center'}>
                                                    {hoverTagDivs}
                                                </div>
                                            </div>

                                        }>
                                            <div className={'d-flex justify-content-end align-items-center h-gap-2'}>
                                                {
                                                    public_tag && Object.keys(public_tag).length > 0 &&
                                                    <div className={'d-flex align-items-center h-gap-2'}>
                                                        {displayPublicTagDivs}
                                                    </div>
                                                }
                                                {
                                                    private_tag && Object.keys(private_tag).length > 0 &&
                                                    <div className={'d-flex align-items-center h-gap-2'}>
                                                        {displayPrivateTagDivs}
                                                    </div>
                                                }
                                                {
                                                    (length < totalLength) &&
                                                    <EllipsisSVG className={"ml-2 small-image-container"}/>
                                                }
                                            </div>
                                        </TooltipPortal>
                                    }
                                </div>

                                {
                                    file_name &&
                                    <div className={"header-2 text"}>{file_name}</div>
                                }

                                {
                                    pageWidth !== 'FULL' &&
                                    <TooltipPortal portalContent={
                                        <div className={'d-flex justify-content-start align-items-center overflow-hidden'}>
                                            <div className={'d-inline-flex flex-wrap align-items-center'}>
                                                {hoverTagDivs}
                                            </div>
                                        </div>

                                    }>
                                        <div id={id} className={'d-flex justify-content-start align-items-center h-gap-2'}>
                                            {
                                                public_tag && Object.keys(public_tag).length > 0 &&
                                                <div className={'d-flex align-items-center h-gap-2'}>
                                                    {displayPublicTagDivs}
                                                </div>
                                            }
                                            {
                                                private_tag && Object.keys(private_tag).length > 0 &&
                                                <div className={'d-flex align-items-center h-gap-2'}>
                                                    {displayPrivateTagDivs}
                                                </div>
                                            }
                                            {
                                                (length < totalLength) &&
                                                <EllipsisSVG className={"ml-2 small-image-container"}/>
                                            }
                                        </div>
                                    </TooltipPortal>
                                }

                                <div className={`d-flex flex-nowrap h-gap-2 header-2 text-center text-nowrap justify-content-start text ${pageWidth !== 'FULL' ? 'collapsed' : ''}`}>
                                    {
                                        publication_date &&
                                        <div className={'d-flex h-gap-2 pt-2'}>
                                            <div>Publication: {publication_date}</div>
                                            <div>|</div>
                                        </div>
                                    }
                                    {
                                        upload_date &&
                                        <div className={'d-flex h-gap-2 pt-2'}>
                                            <div>Upload: {upload_date}</div>
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
                            <div className={"loader position-absolute"}>
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
