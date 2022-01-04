import React from 'react';
import '../../../../index.css'
import Button from './button';
import { ButtonProps } from './buttonModel';

export default {
  title: 'bumed/widgets/Button',
  component: Button,
  argTypes: {
  },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<Button> & Readonly<ButtonProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <Button {...args} />
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
  text: 'Button'
};

export const Selected: any = Template.bind({});
Selected.args = {
    text: 'Button',
    selected: true
};


