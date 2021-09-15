export default {
  title: 'My profile settings',
  role: {
    maintainer: 'Teacher',
    user: 'Student',
    super_admin: 'Super Admin',
  },
  save: {
    success: 'Profile successfully updated',
    fail: 'Profile not updated',
    duplicate: 'This Email is already used',
  },
  first_name: {
    label: 'First name',
    placeholder: 'Enter first name',
    error: 'Name must must have at least 1 symbol',
    correct_error: 'Name must have not spaces',
  },
  last_name: {
    label: 'Last name',
    placeholder: 'Enter last name',
    error: 'Last name must have at least 1 symbol',
    correct_error: 'Last name must have not spaces',
  },
  email: {
    label: 'Email',
    placeholder: 'Enter email',
    error: 'Email must have at least 1 symbol',
    validation: 'The input is not valid E-mail',
  },
  password_placeholder: '••••••••',
  current_password: {
    label: 'Current password',
  },
  new_password: {
    label: 'New password',
  },
  confirm_password: {
    label: 'Confirm password',
  },
  update_information_button: 'Update information',
  update_password_button: 'Update password',
  reset_button: 'Reset Form',
};
