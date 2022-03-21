import React from 'react';
import '../../../../../index.css'
import {PocketNodeRenderer} from "./pocketNodeRenderer";
import {PocketNodeRendererProps} from "../pocketsPanelModel";
import TreeNode from "../../../../theme/widgets/treeView/treeNode";

export default {
    title: 'bumed/pockets/PocketNodeRenderer',
    component: PocketNodeRenderer,
    argTypes: {
    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<PocketNodeRenderer> & Readonly<PocketNodeRendererProps> & Readonly<{ children?: React.ReactNode; }>) => {
    return (
        <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
            <PocketNodeRenderer {...args} />
        </div>
);
}

export const Default: any = Template.bind({});
Default.args = {
    title: 'Hello World'
};

export const Selected: any = Template.bind({});
Selected.args = {
    text: 'Button',
    selected: true
};


