import React from 'react';
import '../../../../index.css'

import TextEdit from './textEdit';

export default {
  title: 'bumed/widgets/TextEdit',
  component: TextEdit,
  argTypes: {
  },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<TextEdit> & Readonly<any> & Readonly<{ children?: React.ReactNode; }>) => {

  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <TextEdit {...args} />
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
    value: 'test'
};

export const Selected: any = Template.bind({});
Selected.args = {
    value: 'test',
    selected: true
};


