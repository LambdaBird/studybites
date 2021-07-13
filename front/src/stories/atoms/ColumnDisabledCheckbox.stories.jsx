import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';

export default {
  title: 'SB/atoms/ColumnDisabledCheckbox',
  component: ColumnDisabledCheckbox,
};

const Template = (args) => <ColumnDisabledCheckbox {...args} />;

export const OneUnchecked = Template.bind({});
OneUnchecked.args = {
  value: [],
  options: [
    {
      value: 0,
      label: 'Option A',
    },
  ],
};

export const OneChecked = Template.bind({});
OneChecked.args = {
  value: [0],
  options: [
    {
      value: 0,
      label: 'Option A',
    },
  ],
};

export const TwoChecked = Template.bind({});
TwoChecked.args = {
  value: [0, 1],
  options: [
    {
      value: 0,
      label: 'Option A',
    },
    {
      value: 1,
      label: 'Option B',
    },
  ],
};

export const TwoUnchecked = Template.bind({});
TwoUnchecked.args = {
  value: [],
  options: [
    {
      value: 0,
      label: 'Option A',
    },
    {
      value: 1,
      label: 'Option B',
    },
  ],
};
