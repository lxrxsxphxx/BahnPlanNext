import { type RouteConfig, index, route,route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('trassen', 'routes/Trassen.tsx'),
] satisfies RouteConfig;
