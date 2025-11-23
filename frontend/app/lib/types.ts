/**
 * Typdefinition für einen Navigationseintrag.
 *
 * Eigenschaften:
 * - to: string
 *   Der Pfad, zu dem der Link navigiert (z. B. '/betrieb').
 * - label: string
 *   Der angezeigte Text des Links (z. B. 'Betrieb').
 * - visibleOnFrontpage?: boolean
 *   Optional. Wenn true, soll der Link auf der Startseite bzw. in einer frontpage-spezifischen Ansicht sichtbar/gehoben angezeigt werden.
 *  Standardverhalten: false (wenn nicht angegeben, nicht speziell auf der Frontpage hervorgehoben).
 * - isParent?: boolean
 *   Optional. Kennzeichnet diesen Eintrag als übergeordneten Menüpunkt/Gruppierung (z. B. "Betrieb", "Community").
 *   Standardverhalten: false.
 * - parentLink?: string
 *   Optional. Verweist auf das label des übergeordneten Eintrags (z. B. 'Betrieb'). Wird verwendet, um Unterpunkte einer Gruppe zuzuordnen.
 *   Erwartung: parentLink entspricht genau dem label des Eintrags mit isParent === true.
 */
export type LinkEntry = {
  to: string;
  label: string;
  visibleOnFrontpage?: boolean;
  isParent?: boolean;
  parentLink?: string;
};