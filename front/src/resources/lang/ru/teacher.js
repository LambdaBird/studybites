export default {
  info: {
    greeting: 'Добрый день, {{fullName}}',
    lessons: 'Уроки',
    students: 'Студенты',
  },
  course_dashboard: {
    error: 'Невозможно получить список курсов',
    title: 'Мои курсы',
    add_button: 'Добавить курс',
    search: {
      placeholder: 'Название',
    },
    menu: {
      archive: 'Архивировать Курс',
      publish: 'Опубликовать Курс',
      restore: 'Восстановить Курс',
      draft: 'Переместить в черновики',
    },
  },
  lesson_dashboard: {
    error: 'Невозможно получить список уроков',
    title: 'Мои уроки',
    add_button: 'Добавить урок',
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
      archive: 'Архивировать Урок',
      publish: 'Опубликовать Урок',
      restore: 'Восстановить Урок',
      draft: 'Переместить в черновики',
    },
  },
  students_list: {
    title: 'Мои студенты',
    invite: 'Пригласить сейчас',
    no_students: 'Еще нет студентов!',
    all: 'Показать всех',
  },
  lesson_funnel: {
    finish_bite: 'Емейл оставлен!',
    start_bite: 'Начало урока',
    mean: 'Среднее',
    median: 'Медиана',
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
  lesson_edit: {
    buttons: {
      publish: 'Опубликовать',
      save: 'Сохранить',
      back: 'Назад',
      forward: 'Вперед',
      preview: 'Предпросмотр',
      move_to_draft: 'Вернуть в черновики',
    },
    cover_image: {
      title: 'Ссылка на картинку',
      input_placeholder: 'Введите вашу ссылку',
      not_found: 'Не найдено',
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
    description: {
      title: 'Описание',
      placeholder: 'Ваше описание',
    },
    publish_modal: {
      title: 'Теперь урок доступен всем студентам',
      ok: 'Ок',
    },
    demo_publish_modal: {
      title: 'Урок успешно опубликован',
      content: 'Поделитесь этой ссылкой со своими студентами',
      copy: 'Копировать',
      ok: 'Ок',
      copy_success: 'Ссылка скопирована в буфер обмена',
    },
  },
  lesson_students: {
    title: 'Студенты урока ({{studentsCount}})',
    table: {
      full_name: 'Полное имя',
      email: 'Email',
      last_activity: 'Последняя активность',
      first_activity: 'Первая активность',
      not_started: 'Еще не начато',
      action: 'Действие',
      progress: 'Прогресс',
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
