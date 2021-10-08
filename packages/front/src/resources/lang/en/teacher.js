export default {
  pages: {
    students: 'My students',
    lesson_students: 'Lesson students',
    create_lesson: 'Lesson creation',
    edit_lesson: 'Lesson edit',
    lesson_preview: 'Lesson preview',
    create_course: 'Course creation',
    edit_course: 'Course edit',
    home: 'Home page',
  },
  info: {
    greeting: 'Welcome back, {{fullName}}',
    lessons: 'Lessons',
    students: 'Students',
  },
  course_dashboard: {
    error: 'Can not fetch courses',
    title: 'My courses',
    add_button: 'Add course',
    search: {
      placeholder: 'Name',
    },
    menu: {
      archive: 'Archive Course',
      publish: 'Publish Course',
      restore: 'Restore Course',
      draft: 'Move to Draft',
    },
  },
  lesson_dashboard: {
    error: 'Can not fetch lessons',
    title: 'My lessons',
    add_button: 'Add lesson',

    card: {
      edit: 'Edit',
      no_students: 'No students',
      students: 'students',
    },
    search: {
      placeholder: 'Name',
    },
    status: {
      draft: 'Draft',
      archived: 'Archived',
      public: 'Public',
      private: 'Private',
      course_only: 'Course Only',
      none: 'None',
    },
    status_select: {
      all: 'All statuses',
      draft: 'Draft',
      archived: 'Archived',
      public: 'Public',
      private: 'Private',
      course_only: 'Courses Only',
    },
    menu: {
      archive: 'Archive Lesson',
      publish: 'Publish Lesson',
      restore: 'Restore Lesson',
      course_only: 'Make Course only',
      draft: 'Move to Draft',
    },
    status_modal: {
      title: 'Do you want to also change course status?',
      content:
        'Lesson status will change and all related courses ({{ coursesCount }}) will also change statuses',
      ok: 'Ok',
      cancel: 'Cancel',
    },
  },
  students_list: {
    title: 'My students',
    invite: 'Invite Now',
    no_students: 'No students yet!',
    all: 'View all',
  },
  lesson_funnel: {
    finish_bite: 'Email sumbited!',
    start_bite: 'Lesson start',
    mean: 'Average',
    median: 'Median',
  },
  editor_js: {
    tool_names: {
      text: 'Text',
      next: 'Next',
    },
    message: {
      success_created: 'Successfully created',
      success_updated: 'Successfully updated',
      error_created: 'Create error',
      error_updated: 'Update error',
      error_lesson_name: 'Missing lesson name',
      error_empty_blocks: 'Missing lesson blocks',
    },
    header: {
      placeholder: 'Enter a header',
    },
    toolbar: {
      toolbox_add: 'Add',
    },
    tools: {
      warning_title: 'Title',
      warning_message: 'Message',
    },
  },
  course_edit: {
    keywords: 'Keywords',
    error_course_name: 'Missing course name',
    lesson_search: {
      placeholder: 'Choose lesson',
    },
    to_lesson_button: 'Go to lesson',
    title: {
      placeholder: 'Course title',
    },
    publish_modal_success: {
      title: 'The course is now available to all students',
      ok: 'Ok',
    },
    publish_modal_fail: {
      title: 'Can not publish course',
      content:
        'Can not publish course if at least one of its Lesson have status “Draft“ or “Archived”',
      ok: 'Ok',
    },
    message: {
      success_created: 'Successfully created',
      success_updated: 'Successfully updated',
      error_created: 'Create error',
      error_updated: 'Update error',
      error_course_name: 'Missing course name',
    },
  },
  lesson_edit: {
    buttons: {
      publish: 'Publish',
      save: 'Save',
      back: 'Back',
      forward: 'Forward',
      preview: 'Preview',
      move_to_draft: 'Move to draft',
      upload: 'Click to select file',
    },
    cover_image: {
      title: 'Cover image link',
      input_placeholder: 'Your image link',
      not_found: 'Not found',
    },
    title: {
      placeholder: 'Lesson title',
    },
    links: {
      invite: 'Invite Collaborators',
      students: 'Students',
      analytics: 'Analytics',
      archive: 'Archive',
    },
    description: {
      title: 'Description',
      placeholder: 'Your description',
    },
    publish_modal: {
      title: 'The lesson is now available to all students',
      ok: 'Ok',
    },
  },
  lesson_students: {
    title: 'Lesson students ({{studentsCount}})',
    table: {
      full_name: 'Full Name',
      email: 'Email',
      last_activity: 'Last activity',
      first_activity: 'First activity',
      not_started: 'Not started',
      action: 'Action',
      progress: 'Progress',
      edit: 'Edit',
      no_data: 'No data',
      action_remove: 'Remove',
    },
    search: {
      placeholder: 'Email or name',
    },
    buttons: {
      invite_student: 'Invite student',
    },
  },
  students: {
    title: 'Lessons students ({{studentsCount}})',
    table: {
      full_name: 'Full Name',
      email: 'Email',
      last_activity: 'Last activity',
      not_started: 'Not started',
      no_data: 'No data',
      lessons: 'Lessons',
      no_lessons: 'No lessons',
    },
    search: {
      placeholder: 'Email or name',
    },
    buttons: {
      invite_student: 'Invite student',
    },
  },
};
