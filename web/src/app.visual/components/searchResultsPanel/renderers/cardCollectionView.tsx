import React, {Component} from 'react';
import Card from "../../../theme/widgets/card/card";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {
    CardCollectionRendererProps,
    CardCollectionRendererState,
    DocumentInfoVM, ObjectType,
} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";
import {EllipsisSVG} from "../../../theme/svgs/ellipsisSVG";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {DocumentInfoSVG} from "../../../theme/svgs/documentInfoSVG";
import {PocketInfoSVG} from "../../../theme/svgs/pocketInfoSVG";
import {ReportInfoSVG} from "../../../theme/svgs/reportInfoSVG";

class CardCollectionView extends Component<CardCollectionRendererProps, CardCollectionRendererState> {
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

    componentDidUpdate(prevProps: Readonly<CardCollectionRendererProps>, prevState: Readonly<CardCollectionRendererState>, snapshot?: any) {
    let element = document.getElementById(this.sampleId);
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    render() {
        const { className, searchResults, onDocumentSelected, ...rest } = this.props;

        let cn = "cards pr-4";
        if (className) {
            cn += ` ${className}`;
        }

        let itemDivs: any[] = [];
        if (searchResults) {
            itemDivs = searchResults.map((item: DocumentInfoVM) => {
                const {id, author, title, upload_date, private_tag=[], public_tag=[], selected, status, isUpdating=true, publication_date, object_type } = item;

                this.sampleId = id;

                let cn = 'position-relative result-item';
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

                let graphic_node;

                switch (object_type) {
                    case ObjectType.ReportInfo:
                        graphic_node = <ReportInfoSVG className={"medium-image-container"}/>
                        break;
                    case ObjectType.PocketInfo:
                        graphic_node = <PocketInfoSVG className={"medium-image-container"}/>
                        break;
                    case ObjectType.DocumentInfo:
                    default:
                        graphic_node = <DocumentInfoSVG className={"medium-image-container"}/>
                        break;
                }

                return (
                    <div key={id} className={cn} draggable={true}>
                        <Card className={'position-absolute w-100 h-100'} selected={selected} onClick={() => onDocumentSelected(id, object_type)}
                              header={
                                  <div className={"h-100 flex-fill align-self-stretch d-flex flex-column v-gap-2 p-4"}>
                                      <div className={'d-flex align-items-center'}>
                                          <div className={'d-flex h-gap-3 align-items-center w-100 overflow-hidden'}>
                                              {graphic_node}
                                              <div className={"overflow-hidden"}>
                                                  <TooltipPortal portalContent={
                                                      <div>{title}</div>
                                                  }>
                                                      <div className={"font-weight-semi-bold overflow-hidden title text-break"}>{title}</div>
                                                  </TooltipPortal>
                                              </div>

                                              <div className={"text header-2 datetime"}>{publication_date !== "No Publication Date" ? publication_date : upload_date}</div>
                                          </div>
                                          <CheckBox selected={selected} disabled={true}/>
                                      </div>
                                      <TooltipPortal className={'flex-fill'} portalContent={
                                          <div>
                                              {
                                                  author &&
                                                  <div>{author}</div>
                                              }
                                          </div>
                                      }>
                                          <div className={'flex-fill d-flex'}>
                                              <div className={"overflow-hidden text-break text header-2"}>{author}</div>
                                          </div>
                                      </TooltipPortal>
                                      <TooltipPortal portalContent={
                                          <div className={'d-flex justify-content-start align-items-center overflow-hidden'}>
                                              <div className={'d-inline-flex flex-wrap align-items-center'}>
                                                  {hoverTagDivs}
                                              </div>
                                          </div>

                                      }>
                                          <div id={id} className={'d-flex justify-content-start align-items-center h-gap-2'}>
                                              {
                                                  Object.keys(public_tag).length > 0 &&
                                                  <div className={'d-flex align-items-center h-gap-2'}>
                                                      {displayPublicTagDivs}
                                                  </div>
                                              }
                                              {
                                                  Object.keys(private_tag).length > 0 &&
                                                  <div className={'d-flex align-items-center h-gap-2'}>
                                                      {displayPrivateTagDivs}
                                                  </div>
                                              }
                                              {
                                                  (length < totalLength) &&
                                                  <EllipsisSVG className={"ml-3 small-image-container"}/>
                                              }
                                          </div>
                                      </TooltipPortal>

                                  </div>
                              }/>
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
            <ScrollBar className={"p-0"} renderTrackHorizontal={false}>
                <ul className={cn} {...rest}>
                    {itemDivs}
                </ul>
            </ScrollBar>
        );
    }
}

export default CardCollectionView;
