import React from 'react';
import '../../../../index.css'
import SearchBox from "./searchBox";
import { SearchBoxProps } from './searchBoxModel';

export default {
    title: 'bumed/widgets/SearchBox',
    component: SearchBox,
    argTypes: {
    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<SearchBox> & Readonly<SearchBoxProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
        <SearchBox {...args} />
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {

};


