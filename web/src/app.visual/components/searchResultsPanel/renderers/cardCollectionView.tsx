import React, {Component} from 'react';
import Card from "../../../theme/widgets/card/card";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {DocumentInfoVM, SearchResultsProps, SearchResultsState} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";
import {EllipsisSVG} from "../../../theme/svgs/ellipsisSVG";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";

class CardCollectionView extends Component<SearchResultsProps, SearchResultsState> {

    constructor(props: any, context: any) {
        super(props, context);
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

                let cn = 'position-relative result-item';
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

                let truncatedPublicTagDivs: any[] = [];
                let length = 0;
                if (public_tag) {
                    forEachKVP(public_tag, (tag: string) => {
                        if (tag.length > 0) {
                            if (length < 3) {
                                truncatedPublicTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag + "_short"}/>)
                            }
                            length++;
                        }
                    })
                }

                let privateTagDivs: any[] = [];
                if (private_tag) {
                    forEachKVP(private_tag, (tag: string) => {

                        if (tag.length > 0) {
                            privateTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag}/>)
                        }
                    })
                }

                let truncatedPrivateTagDivs: any[] = [];
                if (private_tag) {
                    forEachKVP(private_tag, (tag: string) => {
                        if (tag.length > 0) {
                            if (length < 3) {
                                truncatedPrivateTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag + "_short"}/>)
                            }
                            length++;
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
                                              <div className={'d-inline-flex align-items-center flex-wrap'}>
                                                  {privateTagDivs}
                                              </div>
                                              <div className={'d-inline-flex flex-wrap align-items-center'}>
                                                  {publicTagDivs}
                                              </div>
                                          </div>

                                      }>
                                          <div className={'d-flex justify-content-start align-items-center overflow-hidden h-gap-2'}>
                                              <div className={'d-flex align-items-center h-gap-2'}>
                                                  {truncatedPublicTagDivs}
                                              </div>
                                              <div className={'d-flex align-items-center h-gap-2'}>
                                                  {truncatedPrivateTagDivs}
                                              </div>
                                              {
                                                  ((public_tag && length > 3) || (private_tag && length > 3)) &&
                                                  <EllipsisSVG className={"ml-5 small-image-container"}/>
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
