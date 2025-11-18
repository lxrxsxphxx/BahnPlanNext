import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('ausschreibungen', 'routes/ausschreibungen.tsx'),
  route('betrieb', 'routes/betrieb/index.tsx', [
    route('fahrplaene', 'routes/betrieb/fahrplaene.tsx'),
  ]),
] satisfies RouteConfig;
