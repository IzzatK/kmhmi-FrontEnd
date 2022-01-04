import React from 'react';
import '../../../../index.css'

import ProgressBar from "./progressBar";
import { ProgressBarProps } from './progressBarModel';

export default {
    title: 'bumed/widgets/ProgressBar',
    component: ProgressBar,
    argTypes: {},
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<ProgressBar> & Readonly<ProgressBarProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <ProgressBar {...args} />
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
    percent: 50
};


