import React from 'react';
import '../../../../index.css'

import Card from "./card";
import { CardProps } from './cardModel';

export default {
    title: 'bumed/widgets/Card',
    component: Card,
    argTypes: {},
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<Card> & Readonly<CardProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <Card {...args}>
            <div className={'p-5 header-2 text-primary'}>Hello Card</div>
        </Card>
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
    selected: false,
    expanded: false,
};

export const Selected: any = Template.bind({});
Selected.args = {
    selected: true,
    expanded: false,
};

export const Expanded: any = Template.bind({});
Expanded.args = {
    expanded: true,
};
