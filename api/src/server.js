import build from './app';

const server = build({
  logger: process.env.API_LOGLEVEL || false,
});

try {
  server.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
