export async function lessonSchemaHandler() {
  const {
    models: { Lesson },
  } = this;

  return Lesson.jsonSchema;
}
