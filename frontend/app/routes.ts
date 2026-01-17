import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('beschaffung', 'routes/Beschaffung.tsx'),
    route('beschaffung/wagen', 'routes/beschaffung.wagen.tsx'),
] satisfies RouteConfig;
