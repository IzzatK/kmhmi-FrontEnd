import React, {Component} from 'react';
import './tagsPanel.css';
import '../../../theme/stylesheets/panel.css';
import {TagsPanelProps, TagsPanelState} from "./tagsPanelModel";
import {getClassNames} from "../../../../framework.visual/extras/utils/animationUtils";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Card from "../../../theme/widgets/card/card";
import Button from "../../../theme/widgets/button/button";
import {DeleteSVG} from "../../../theme/svgs/deleteSVG";
import {AcceptSVG} from "../../../theme/svgs/acceptSVG";
import Tag from "../../../theme/widgets/tag/tag";

class TagsPanelView extends Component<TagsPanelProps, TagsPanelState> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        const { className, nominatedTags, tags } = this.props;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        let nominatedTagsDiv: JSX.Element[] = [];

        if (nominatedTags) {
            nominatedTagsDiv = Object.entries(nominatedTags).map(([key, nominatedTag]) => {
                const { id, tag, document } = nominatedTag;
                return (
                    <CSSTransition key={id} timeout={300} classNames={getClassNames('fadeIn', 'fadeIn', 'slideRightOut') }>
                        <div className={'position-relative pending-item'}>
                            <Card className={`d-flex flex-column align-items-stretch v-gap-3 p-0`}
                                  header={
                                      <div className={'d-flex'}>
                                          <div className={'flex-fill d-flex justify-content-between align-items-center'}>
                                              <div className={'pending-item-body flex-fill d-flex justify-content-between align-items-center'}>
                                                  <div className={'d-flex flex-column v-gap-3 p-4'}>
                                                      <Tag name={tag} text={tag}/>
                                                      <div className={"header-4 text-secondary"}>{document}</div>
                                                  </div>

                                              </div>
                                              <div className={'d-flex h-gap-3 px-5'}>
                                                  <Button className={'p-2 reject'}>
                                                      <DeleteSVG className={"small-image-container"}/>
                                                  </Button>
                                                  <Button className={'p-2 accept'} >
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

        let tagDivs = Object.entries(tags).map(([key, tag]) => {
        })

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
                            <div className={'flex-fill align-self-stretch d-flex align-items-center justify-content-center'}>
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
}

export default TagsPanelView;
