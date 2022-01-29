import React from "react";
import './toolbar.css';
import Button from "../button/button";
import {ToolbarProps} from "./toolbarModel";

class Toolbar extends React.Component<ToolbarProps> {
    render() {
        const {className, tools, onToolSelected, children, orientation} = this.props;

        let cn = 'toolbar d-flex align-items-center justify-content-center';

        if (orientation === 'vertical') {
            cn += ' flex-column v-gap-3';
        } else {
            cn += ' h-gap-3';
        }

        let toolDivs = tools.map(tool => {
            const {id, title='', graphic:Graphic, selected=false, } = tool;
            return (
                <li key={id} className={'tool-item'}>
                    <Button tooltip={title} onClick={() => this.onToolClick(tool)} selected={selected}>
                        {Graphic && <Graphic className={'small-image-container'}/>}
                    </Button>
                </li>
            )
        });
        return (
            <ul className={cn}>
                {toolDivs}
            </ul>
        );


    }
    onToolClick = (tool: { id: any; selected?: boolean | undefined; title?: string | undefined; graphic?: new (props: { className: string; }, context: any) => React.Component<{ className: string; }, any, any>; onClick?: any; }) => {
        const {id , onClick: buttonHandler} = tool;
        if (buttonHandler) {
            buttonHandler(id);
        }
        else if (this.props.onToolSelected) {
            this.props.onToolSelected(id);
        }
    }
}

export default Toolbar;


