import React, {Component} from 'react';
import Card from "../../../theme/widgets/card/card";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {DocumentInfoVM, SearchResultsProps, SearchResultsState} from "../searchResultsModel";
import Tag from "../../../theme/widgets/tag/tag";

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

                return (
                    <div key={id} className={cn}>
                        <Card className={'position-absolute w-100 h-100'} selected={selected} onClick={() => onDocumentSelected(id)}
                              header={
                                  <div className={"h-100 flex-fill align-self-stretch d-flex flex-column v-gap-2 p-4"}>
                                      <div className={'d-flex w-100 justify-content-between align-items-center'}>
                                          <div className={'d-flex h-gap-3 align-items-start'}>
                                              <TooltipPortal portalContent={
                                                  <div>{title}</div>
                                              }>
                                                  <div className={"font-weight-semi-bold overflow-hidden title text-break"}>{title}</div>
                                              </TooltipPortal>
                                              {/*<div className={"d-flex header-2 text datetime"}>{status === "" ? timestamp.split(",")[0] : status}</div>*/}
                                              <div className={"d-flex text pt-2 header-2 datetime"}>{publication_date !== "No Publication Date" ? publication_date: timestamp?.split(',')[0]}</div>
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
                                      <div className={'d-flex justify-content-start align-items-center overflow-hidden'}>
                                          <div className={'d-flex align-items-center h-gap-2'}>
                                              {
                                                  private_tag && private_tag.map((tag: string) => {
                                                      return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false}/>
                                                  })
                                              }
                                          </div>
                                          <div className={'d-flex align-items-center h-gap-2'}>
                                              {
                                                  public_tag && public_tag.map((tag: string) => {
                                                      return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false} isGlobal={true}/>
                                                  })
                                              }
                                          </div>
                                      </div>
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
