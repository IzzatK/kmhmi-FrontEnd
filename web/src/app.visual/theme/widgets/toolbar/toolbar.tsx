import React from "react";
import './toolbar.css';
import Button from "../button/button";
import {ToolbarProps} from "./toolbarModel";

class Toolbar extends React.Component<ToolbarProps> {
    render() {
        const {className, tools, onToolSelected: defaultHandler, children, orientation, ...rest} = this.props;

            let cn = 'toolbar d-flex align-items-center justify-content-center'
            if (className) {
                cn += ` ${className}`;
            }

            if (orientation === 'vertical') {
                cn += ' flex-column v-gap-3';
            } else {
                cn += ' h-gap-3';
            }

            const onToolClick = (tool: { id: any; title?: any; graphic?: any; selected?: any; onClick?: any }) => {
                const {id, onClick: buttonHandler} = tool;
                if (buttonHandler) {
                    buttonHandler(id);
                } else if (defaultHandler) {
                    defaultHandler(id);
                }
            }

            let toolDivs = tools.map((tool: { id: any; title?: any; graphic?: any; selected?: any; onClick?: any; }) => {
                const {id, title = '', graphic: Graphic, selected = false,} = tool;
                return (
                    <li key={id} className={'tool-item'}>
                        <Button tooltip={title} onClick={() => onToolClick(tool)} selected={selected}>
                            {Graphic && <Graphic className={'small-image-container'}/>}
                        </Button>
                    </li>

                )
            });

            return (
                <ul className={cn} {...rest}>
                    {toolDivs}
                </ul>
            );
    }
}

export default Toolbar;
