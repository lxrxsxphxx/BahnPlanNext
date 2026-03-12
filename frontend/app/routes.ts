import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * **Routen-Konfiguration (Zentrale Sitemap)**
 * * Definiert die gesamte Navigationsstruktur der Anwendung "BahnPlanNext". 
 * Diese Datei verknüpft URL-Pfade mit den entsprechenden Page-Komponenten im `routes/`-Ordner.
 *
 * ### Routen-Segmente
 * - **Home (`/`)**: Der Einstiegspunkt der App.
 * - **Trassen (`/trassen`)**: Anzeige und Verwaltung von Fahrplänen.
 * - **Beschaffung & Shop**: 
 * - `/beschaffung`: Hauptseite für den Einkauf.
 * - `/shop/kredite`:Kredite mit 3 Auswahloptionen für Spieler.
 * - **Gesellschaftsbereich**:
 * - `/gesellschaftsbereich`: Übersicht der eigenen Firma.
 * - `/fahrzeuge`: Detaillierte Liste der eigenen Loks und Wagen.
 *
 * ### Technische Details
 * - Nutzt die `route()` und `index()` Helfer von `@react-router/dev/routes`.
 * - **Namenskonvention**: Folgt einem flachen Dateisystem-Muster (z. B. `routes/beschaffung.loks.tsx`), um Verschachtelungen im Code sauber abzubilden.
 * - **Type-Safety**: Verwendet `satisfies RouteConfig`, um sicherzustellen, dass alle Pfade vom Router korrekt erkannt werden.
 *
 * @module Infrastructure/Routing
 */
export default [
  index('routes/home.tsx'),
  route('trassen', 'routes/Trassen.tsx'),
  route('trassen/:id', 'routes/route_details.tsx'),
  route('beschaffung', 'routes/Beschaffung.tsx'),
  route('beschaffung/loks', 'routes/beschaffung.loks.tsx'),
  route('wagons', 'routes/Wagons.tsx'),
  route('gesellschaftsbereich', 'routes/Gesellschaftsbereich.tsx'),
  route(
    'gesellschaftsbereich/fahrzeuge',
    'routes/gesellschaftsbereich.fahrzeuge.tsx',
  ),
  route('shop/kredite', 'routes/Kredite.tsx'),
] satisfies RouteConfig;
