import './scrollBar.css';
import {Scrollbars} from "react-custom-scrollbars";
import {ScrollBarProps} from "./scrollBarModel";

import React from "react";

class ScrollBar extends React.Component<ScrollBarProps> {
    constructor(props: any) {
        super(props);

    }

    render() {
        const {children, renderTrackHorizontal=true, renderTrackVertical=true, ...rest} = this.props;

        let cnh = 'track-horizontal';
        if (!renderTrackHorizontal) {
            cnh = 'd-none';
        }

        let cnv = 'track-vertical'
        if (!renderTrackVertical) {
            cnv = 'd-none'
        }

        return (
            <Scrollbars renderTrackHorizontal={props => <div {...props} className={cnh}/>}
                        renderTrackVertical={props => <div {...props} className={cnv}/>}
                        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className="view"/>} {...rest}
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={200}>
                {children}
            </Scrollbars>
        );
    }
}

export default ScrollBar;
