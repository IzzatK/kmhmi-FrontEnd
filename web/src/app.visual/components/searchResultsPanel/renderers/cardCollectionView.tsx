import React, {Component} from 'react';
import Card from "../../../theme/widgets/card/card";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {DocumentInfoVM, SearchResultsProps, SearchResultsState} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";
import {EllipsisSVG} from "../../../theme/svgs/ellipsisSVG";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

class CardCollectionView extends Component<SearchResultsProps, SearchResultsState> {
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

    componentDidUpdate() {
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

        let itemDivs: {} | null | undefined = [];
        if (searchResults) {
            itemDivs = searchResults.map((item: DocumentInfoVM) => {
                const {id, author, title, timestamp, private_tag=[], public_tag=[], selected, status, isUpdating=true, publication_date } = item;

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

                return (
                    <div key={id} className={cn}>
                        <Card className={'position-absolute w-100 h-100'} selected={selected} onClick={() => onDocumentSelected(id)}
                              header={
                                  <div className={"h-100 flex-fill align-self-stretch d-flex flex-column v-gap-2 p-4"}>
                                      <div className={'d-flex align-items-center'}>
                                          <div className={'d-flex h-gap-3 align-items-center w-100 overflow-hidden'}>
                                              <div className={"overflow-hidden"}>
                                                  <TooltipPortal portalContent={
                                                      <div>{title}</div>
                                                  }>
                                                      <div className={"font-weight-semi-bold overflow-hidden title text-break"}>{title}</div>
                                                  </TooltipPortal>
                                              </div>

                                              {/*<div className={"d-flex header-2 text datetime"}>{status === "" ? timestamp.split(",")[0] : status}</div>*/}
                                              <div className={"text header-2 datetime"}>{publication_date !== "No Publication Date" ? publication_date?.split(',')[0] : timestamp?.split(',')[0]}</div>
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
                                                  JSON.stringify(public_tag) !== "{}" &&
                                                  <div className={'d-flex align-items-center h-gap-2'}>
                                                      {displayPublicTagDivs}
                                                  </div>
                                              }
                                              {
                                                  JSON.stringify(private_tag) !== "{}" &&
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
                            <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
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
