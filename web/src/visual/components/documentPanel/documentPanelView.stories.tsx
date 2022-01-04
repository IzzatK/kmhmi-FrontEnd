import React from 'react';
import '../../../index.css'
import { DocumentPanelProps } from './documentPanelModel';
import DocumentPanelView from "./documentPanelView";

export default {
  title: 'bumed/components/DocumentPanel',
  component: DocumentPanelView,
  argTypes: {
  },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<DocumentPanelView> & Readonly<DocumentPanelProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex align-items-stretch justify-content-start h-100"} style={{ padding: '3em' }}>
        <DocumentPanelView {...args} />
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
    document: {
        author: 'Anthony',
        document_name: 'Here goes my name'
    }
};


