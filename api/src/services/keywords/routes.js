import getKeywords from './controllers/getKeywords';

export async function router(instance) {
  instance.get('/', getKeywords.options, getKeywords.handler);
}
