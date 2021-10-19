export default {
  pages: {
    students: 'Мои студенты',
    lesson_students: 'Студенты урока',
    create_lesson: 'Создание урока',
    edit_lesson: 'Редактирование урока',
    lesson_preview: 'Предпросмотр урока',
    create_course: 'Создание курса',
    edit_course: 'Редактирование курса',
    home: 'Домашняя страница',
  },
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
      course_only: 'Только для Курсов',
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
      course_only: 'Только для Курса',
    },
    status_select: {
      all: 'Все статусы',
      draft: 'Черновик',
      archived: 'Архивированные',
      public: 'Публичные',
      private: 'Приватные',
      course_only: 'Только для курсов',
    },
    menu: {
      archive: 'Архивировать Урок',
      publish: 'Опубликовать Урок',
      restore: 'Восстановить Урок',
      course_only: 'Сделать только для Курса',
      draft: 'Переместить в черновики',
    },
    status_modal: {
      title: 'Вы хотите также изменить статус курса?',
      content:
        'Статус урока будет изменен и будут изменены все статусы курсов ({{ coursesCount }}) которые к ним относятся',
      ok: 'Ок',
      cancel: 'Отмена',
    },
  },
  students_list: {
    title: 'Мои студенты',
    invite: 'Пригласить сейчас',
    no_students: 'Еще нет студентов!',
    all: 'Показать всех',
  },
  lesson_funnel: {
    finish_bite: 'Урок закончен',
    start_bite: 'Урок начат',
    mean: 'Среднее',
    median: 'Медиана',
    bar_title: 'Воронка студентов',
    content_title: 'Содержание байта',
    spark_title: 'Распределение по времени',
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
    keywords: 'Ключевые слова',
    error_course_name: 'Отсуствует название курса',
    lesson_search: {
      placeholder: 'Выберите урок',
    },
    to_lesson_button: 'Перейти к уроку',
    title: {
      placeholder: 'Название курса',
    },
    publish_modal_success: {
      title: 'Курс теперь доступен для всех студентов',
      ok: 'Ок',
    },
    publish_modal_fail: {
      title: 'Невозможно опубликовать курс',
      content:
        'Невозможно опубликовать курс так как один из уроков имеет статус "Черновик" или "Архивирован"',
      ok: 'Ок',
    },
    message: {
      success_created: 'Курс успешно создан',
      success_updated: 'Курс успешно обновлен',
      error_created: 'Ошибка при создании',
      error_updated: 'Ошибка при обновлении',
      error_course_name: 'Отсутствует название курса',
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
      upload: 'Нажмите чтобы выбрать файл',
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
  },
  lesson_students_results: {
    start: 'Начало',
    finish: 'Конец',
    seconds: '{{time}} секунд',
    short_seconds: '{{time}} сек.',
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
