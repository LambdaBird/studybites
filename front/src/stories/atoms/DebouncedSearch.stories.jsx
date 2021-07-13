import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch';

export default {
  title: 'SB/atoms/DebouncedSearch',
  argTypes: { onChange: {} },
  component: DebouncedSearch,
};

const Template = (args) => <DebouncedSearch {...args} />;

export const Value = Template.bind({});
Value.args = {
  delay: 500,
};
