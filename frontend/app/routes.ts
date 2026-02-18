import { type RouteConfig, index,route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('wagons', 'routes/Wagons.tsx'),
] satisfies RouteConfig;
