import React from 'react';
import '../../../../index.css'
import CheckBox from "./checkBox";
import { CheckProp } from './checkBoxModel';

export default {
    title: 'bumed/widgets/CheckBox',
    component: CheckBox,
    argTypes: {

    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<CheckBox> & Readonly<CheckProp> & Readonly<{ children?: React.ReactNode; }>) => {
    return (
        <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
            <CheckBox {...args}/>
        </div>
    );
}

export const Default: any = Template.bind({});
Default.args = {
    selected: false,
};

export const Selected: any = Template.bind({});
Selected.args = {
    selected: true,
};
