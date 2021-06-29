import 'regenerator-runtime/runtime';
import build from './app';

const server = build({
  logger: 'info',
});

try {
  server.listen(process.env.PORT, '0.0.0.0');
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
