import React from 'react';
import '../../../../index.css'

import SwitchButton from "./switchButton";
import { SwitchButtonProps } from './switchButtonModel';

export default {
    title: 'bumed/widgets/SwitchButton',
    component: SwitchButton,
    argTypes: {
    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<SwitchButton> & Readonly<SwitchButtonProps> & Readonly<{ children?: React.ReactNode; }>) => {
    return (
        <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
            <SwitchButton {...args}/>
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
