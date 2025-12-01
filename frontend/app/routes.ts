import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('betrieb', 'routes/betrieb/index.tsx', [
    route('fahrplaene', 'routes/betrieb/fahrplaene.tsx'),
  ]),
  ...prefix('info-zentrale', [
    route('ausschreibungen', 'routes/ausschreibungen.tsx'),
  ]),
  route('theme', 'routes/theme.ts'),
] satisfies RouteConfig;
