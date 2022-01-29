import React from 'react';
import '../../../../index.css'

import FileInput from './fileInput';
import { FileInputProps } from './fileInputModel';

export default {
    title: 'bumed/widgets/FileInput',
    component: FileInput,
    argTypes: {},
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<FileInput> & Readonly<FileInputProps> & Readonly<{ children?: React.ReactNode; }>) => {

  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <FileInput {...args} />
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


