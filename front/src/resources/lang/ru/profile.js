export default {
  title: 'Мои настройки профиля',
  role: {
    teacher: 'Учитель',
    user: 'Студент',
    super_admin: 'Суперпользователь',
  },
  save: {
    success: 'Профиль успешно обновлен',
    fail: 'Профиль не обновлен',
    duplicate: 'Такой Email уже используется',
  },
  first_name: {
    label: 'Имя',
    placeholder: 'Введите свое имя',
    error: 'Имя должно иметь хотябы 1 символ',
    correct_error: 'Имя не должно содержать пропусков',
  },
  last_name: {
    label: 'Фамилия',
    placeholder: 'Введите свою фамилию',
    error: 'Фамилия должна иметь хотябы 1 символ',
    correct_error: 'Фамилия не должна содержать пропусков',
  },
  email: {
    label: 'Email',
    placeholder: 'Введите свой email',
    error: 'Email должен иметь хотябы 1 символ',
    validation: 'Неправильный email',
  },
  description: {
    label: 'Описание',
    placeholder: 'Введите описание',
  },
  password_placeholder: '••••••••',
  current_password: {
    label: 'Текущий пароль',
  },
  new_password: {
    label: 'Новый пароль',
  },
  confirm_password: {
    label: 'Подтверждение пароля',
  },
  update_information_button: 'Обновить информацию',
  reset_password_button: 'Сбросить пароль',
  reset_button: 'Сбросить Форму',
  error_save_frequently:
    'Вы пытаетесь слишком часто сменить пароль, попробуйте через {{timeout}} секунд',
};
