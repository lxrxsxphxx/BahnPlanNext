import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('trassen', 'routes/Trassen.tsx'),
  route('trassendetails', 'routes/route_details.tsx'),
  route('beschaffung', 'routes/Beschaffung.tsx'),
  route('beschaffung/loks', 'routes/beschaffung.loks.tsx'),
  route('gesellschaftsbereich', 'routes/Gesellschaftsbereich.tsx'),
  route('gesellschaftsbereich/fahrzeuge', 'routes/gesellschaftsbereich.fahrzeuge.tsx'),
  route('shop/kredite', 'routes/Kredite.tsx'),
] satisfies RouteConfig;
