import PasswordStrengthIndicator from '@sb-ui/components/atoms/PasswordStrengthIndicator';

export default {
  title: 'SB/atoms/PasswordStrengthIndicator',
  component: PasswordStrengthIndicator,
};

const Template = (args) => <PasswordStrengthIndicator {...args} />;

export const Value = Template.bind({});
Value.args = {
  value: '',
};
