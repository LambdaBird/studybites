import build from './app';

const BODY_LIMIT = 4_000_000;

const server = build({
  bodyLimit: BODY_LIMIT,
  logger: +process.env.DEVELOPMENT_MODE ? 'info' : false,
});

try {
  server.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
