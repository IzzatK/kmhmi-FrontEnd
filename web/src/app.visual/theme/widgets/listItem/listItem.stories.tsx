import React from 'react';
import '../../../../index.css'

import ListItem from "./listItem";
import { ListItemProps } from './listSystemModel';

export default {
    title: 'bumed/widgets/ListItem',
    component: ListItem,
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
};

const Template = (args: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<ListItem> & Readonly<ListItemProps> & Readonly<{ children?: React.ReactNode; }>) => {
  return (
      <div className={"d-flex flex-column flex-grow-1"} style={{ padding: '3em' }}>
        <ListItem {...args}>
            <div className={'p-5 header-2'}>Hello Card</div>
        </ListItem>
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
};


