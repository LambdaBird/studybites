export default {
  info: {
    greeting: 'Добрый день, {{fullName}}',
    lessons: 'Уроки',
    students: 'Студенты',
  },
  lesson_dashboard: {
    title: 'Мои уроки',
    add_button: 'Добавить урок',
    create_course_button: 'Создать курс',
    card: {
      edit: 'Редактировать',
      no_students: 'Нет студентов',
      students: 'студентов',
    },
    search: {
      placeholder: 'Название',
    },
    status: {
      draft: 'Черновик',
      archived: 'Архивирован',
      public: 'Публичный',
      private: 'Приватный',
      none: 'Отсуствует',
    },
    status_select: {
      all: 'Все статусы',
      draft: 'Черновик',
      archived: 'Архивированные',
      public: 'Публичные',
      private: 'Приватные',
    },
    menu: {
      archive: 'Архивировать урок',
      publish: 'Опубликовать урок',
      restore: 'Восстановить урок',
      draft: 'Переместить в черновики',
    },
  },
  students_list: {
    title: 'Мои студенты',
    invite: 'Пригласить сейчас',
    no_students: 'Еще нет студентов!',
    all: 'Показать всех',
  },
  editor_js: {
    tool_names: {
      text: 'Текст',
      next: 'Следующий',
    },
    message: {
      success_created: 'Урок успешно создан',
      success_updated: 'Урок успешно обновлен',
      error_created: 'Ошибка при создании',
      error_updated: 'Ошибка при обновлении',
      error_lesson_name: 'Отсутствует название урока',
      error_empty_blocks: 'Отсутствуют блоки урока',
    },
    header: {
      placeholder: 'Введите заголовок',
    },
    toolbar: {
      toolbox_add: 'Добавить',
    },
    tools: {
      warning_title: 'Заголовок',
      warning_message: 'Сообщение',
    },
  },
  course_edit: {
    lesson_search: {
      placeholder: 'Выберите урок',
    },
    to_lesson_button: 'Перейти к уроку',
    title: {
      placeholder: 'Название курса',
    },
  },
  lesson_edit: {
    buttons: {
      publish: 'Опубликовать',
      save: 'Сохранить',
      back: 'Назад',
      forward: 'Вперед',
      preview: 'Предпросмотр',
      move_to_draft: 'Вернуть в черновики',
    },
    title: {
      placeholder: 'Название урока',
    },
    links: {
      invite: 'Пригласить соавторов',
      students: 'Студенты',
      analytics: 'Аналитика',
      archive: 'Архив',
    },
    description: 'Описание',
    publish_modal: {
      title: 'Теперь урок доступен всем студентам',
      ok: 'Ок',
    },
  },
  lesson_students: {
    title: 'Студенты урока ({{studentsCount}})',
    table: {
      full_name: 'Полное имя',
      email: 'Email',
      last_activity: 'Последняя активность',
      not_started: 'Еще не начато',
      action: 'Действие',
      edit: 'Изменить',
      no_data: 'Нет данных',
      action_remove: 'Удалить',
    },
    search: {
      placeholder: 'Email или имя',
    },
    buttons: {
      invite_student: 'Пригласить студента',
    },
  },
  students: {
    title: 'Студенты уроков ({{studentsCount}})',
    table: {
      full_name: 'Полное имя',
      email: 'Email',
      last_activity: 'Последняя активность',
      not_started: 'Еще не начато',
      no_data: 'Нет данных',
      lessons: 'Уроки',
      no_lessons: 'Нет уроков',
    },
    search: {
      placeholder: 'Email или имя',
    },
    buttons: {
      invite_student: 'Пригласить студента',
    },
  },
};
