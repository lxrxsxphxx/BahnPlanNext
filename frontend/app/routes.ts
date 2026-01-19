import { type RouteConfig, index,route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('gesellschaftsbereich', 'routes/Gesellschaftsbereich.tsx'),
    route('gesellschaftsbereich/fahrzeuge', 'routes/gesellschaftsbereich.fahrzeuge.tsx'),
] satisfies RouteConfig;
