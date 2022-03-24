import React from 'react';
import './tagsPanel.css';
import '../../../theme/stylesheets/panel.css';
import {TagsPanelViewProps} from "../tagsPanelModel";
import {getClassNames} from "../../../../framework.visual";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Card from "../../../theme/widgets/card/card";
import Button from "../../../theme/widgets/button/button";
import {DeleteSVG} from "../../../theme/svgs/deleteSVG";
import {AcceptSVG} from "../../../theme/svgs/acceptSVG";
import Tag from "../../../theme/widgets/tag/tag";
import Portal from "../../../theme/widgets/portal/portal";

function TagsPanelView(props: TagsPanelViewProps) {
    const {className, nominatedTags, tags, selectedTag} = props;

    let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

    if (className) {
        cn += ` ${className}`;
    }

    let nominatedTagsDiv: JSX.Element[] = [];

    if (nominatedTags) {
        nominatedTagsDiv = Object.entries(nominatedTags).map(([key, nominatedTag]) => {
            const {id, tag, document} = nominatedTag;
            return (
                <CSSTransition key={id} timeout={300} classNames={getClassNames('fadeIn', 'fadeIn', 'slideRightOut')}>
                    <div className={'position-relative pending-item'}>
                        <Card className={`d-flex flex-column align-items-stretch v-gap-3 p-0`}
                              header={
                                  <div className={'d-flex'}>
                                      <div className={'flex-fill d-flex justify-content-between align-items-center'}>
                                          <div
                                              className={'pending-item-body flex-fill d-flex justify-content-between align-items-center'}>
                                              <div className={'d-flex flex-column v-gap-3 p-4'}>
                                                  <Tag name={tag} text={tag}/>
                                                  <div className={"header-4 text-secondary"}>{document}</div>
                                              </div>

                                          </div>
                                          <div className={'d-flex h-gap-3 px-5'}>
                                              <Button className={'p-2 reject'}>
                                                  <DeleteSVG className={"small-image-container"}/>
                                              </Button>
                                              <Button className={'p-2 accept'}>
                                                  <AcceptSVG className={"small-image-container"}/>
                                              </Button>
                                          </div>
                                      </div>
                                  </div>
                              }
                        />
                    </div>
                </CSSTransition>
            );
        })
    }

    let tagDivs = Object.entries(tags).map(([key, tagVMs]) => {

        let letter = key;

        let tagDivs = Object.entries(tagVMs).map(([key, tag]) => {
            const {id, title, selected} = tag;

            return (
                <div>
                    <Portal
                        isOpen={selectedTag === id}
                        zIndex={9999}
                        enterClass={'growVertical'}
                        exitClass={'shrinkVertical'}
                        timeout={200}
                        onShouldClose={() => props.onShouldClose(id)}
                        portalContent={
                            <div className={`position-absolute w-100`}>
                                <ul className={"w-100 list-items header-3 v-gap-2 p-3"}>
                                    <div>Search by Tag...</div>
                                    <div>Add Tag to Document</div>
                                    <div>Edit Tag</div>
                                    <div>Delete Tag</div>
                                </ul>
                            </div>
                        }>
                        <div
                            className={`tag font-weight-light display-3 d-flex rounded-pill cursor-pointer align-items-center ${selectedTag === id ? "selected justify-content-center" : "pl-3"}`}
                            onClick={() => props.onTagSelected(id)}>
                            {title}
                        </div>
                    </Portal>
                </div>

            );
        });

        return (
            <div className={"d-flex flex-column"}>

                <div className={"py-3 pr-3 pl-5 font-weight-light letter-header mb-4"}>{letter}</div>
                <div className={"tag-grid align mb-5"}>
                    {tagDivs}
                </div>
            </div>

        );
    });

    return (
        <div className={cn}>
            <div className={'system-tool-panel tags-panel flex-fill h-100 py-4 pl-4 d-flex flex-column'}>
                <div className={'header-1 title py-3'}>TAGS MANAGER</div>
                <div className={"header d-flex align-items-center justify-content-between mt-3 mb-5 mr-4"}>
                    <div className={'py-3'}>NOMINATED TAGS</div>
                </div>
                {
                    nominatedTagsDiv && nominatedTagsDiv.length > 0 ?
                        <ScrollBar renderTrackHorizontal={false}>
                            <div className={"search-results pr-3 v-gap-3"}>
                                <TransitionGroup component={null}>
                                    {nominatedTagsDiv}
                                </TransitionGroup>
                            </div>
                        </ScrollBar>
                        :
                        <div
                            className={'flex-fill align-self-stretch d-flex align-items-center justify-content-center'}>
                            <div className={'text-primary header-1'}>No Nominated Tags</div>
                        </div>
                }
                <div className={"header d-flex align-items-center justify-content-between mt-3 mb-5 mr-4"}>
                    <div className={'py-3'}>TAGS LIBRARIES</div>
                </div>
                <ScrollBar renderTrackHorizontal={false}>
                    {tagDivs}
                </ScrollBar>
            </div>
        </div>
    );
}

export default TagsPanelView;
