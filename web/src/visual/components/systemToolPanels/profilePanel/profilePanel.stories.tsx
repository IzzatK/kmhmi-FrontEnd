import React from 'react';
import '../../../../index.css'


import ProfilePanelView from "./profilePanelView";

export default {
  title: 'bumed/components/ProfilePanel',
  component: ProfilePanelView,
  argTypes: {
     backgroundColor: { control: 'color' },
  },
};

const Template = (args: any) => {
  return (
      <div className={"d-flex align-items-stretch justify-content-start h-100"} style={{ padding: '3em' }}>
        <ProfilePanelView {...args} />
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


