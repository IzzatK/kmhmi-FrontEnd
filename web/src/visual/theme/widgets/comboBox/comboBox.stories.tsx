import React from 'react';
import '../../../../index.css'
import ComboBox from "./comboBox";

export default {
  title: 'bumed/widgets/Combobox',
  component: ComboBox,
  argTypes: {
  },
};

const Template = (args: JSX.IntrinsicAttributes) => {
  return (
      <div className={"d-flex align-items-start justify-content-start"} style={{ padding: '3em' }}>
          <ComboBox {...args} items={[
              {
                  title: "Issues (low to high)",
                  selected: false,
              },
              {
                  title: "Issues (high to low)",
                  selected: false,
              },
              {
                  title: "By Contact",
                  selected: false,
              }
              ]}>
          </ComboBox>
      </div>
  );
}

export const Default: any = Template.bind({});
Default.args = {
    title: 'Select',
};


