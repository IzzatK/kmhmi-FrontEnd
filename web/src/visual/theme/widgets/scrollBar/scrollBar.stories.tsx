import React from 'react';
import '../../../../index.css';

import ScrollBar from "./scrollBar";
import {ScrollBarProps} from "./scrollBarModel";

export default {
    title: 'bumed/widgets/ScrollBar',
    component: ScrollBar,
    argTypes: {
    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<ScrollBar> & Readonly<ScrollBarProps> & Readonly<{ children?: React.ReactNode; }>) => {
    return (
        <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
            <ScrollBar {...args}>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
                <div className={'p-5 header-2 bg-warning'}>Hello ScrollBar</div>
            </ScrollBar>
        </div>
    );
}

export const Default: any = Template.bind({});
Default.args = {
};
