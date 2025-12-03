# GitHub-Standards & Workflow

## 1. Ziel des Dokuments

Dieses Dokument beschreibt den gemeinsamen Umgang des Teams mit GitHub, um eine klare, nachvollziehbare und konsistente Arbeitsweise sicherzustellen.
Es regelt:

* Branching-Strategie
* Pull-Request-Workflow
* Nutzung von Issues
* Commit- und Review-Standards
* Benennungskonventionen
* Qualitäts- und Freigabeprozesse

## 2. Grundprinzipien

1. **Alle Änderungen erfolgen über Branches und Pull Requests**

   * Kein direktes Arbeiten auf dem `main`- oder `develop`-Branch

2. **Jede Änderung basiert auf einem Issue**

   * Keine Commits ohne zugehöriges Issue

3. **Alle PRs werden reviewed**

   * Mindestens ein weiteres Teammitglied muss den Merge freigeben

## 3. Repository-Struktur

### Haupt-Branches

| Branch  | Zweck                      | Zugriff                                             |
| ------- | -------------------------- | --------------------------------------------------- |
| main    | Stabile, getestete Version | nach Review werden alle abgenommen Items verschoben |
| develop | Aktuelle Entwicklungsbasis | Alle über PRs                                       |

### Feature-/Fix-Branches

| Typ     | Namenskonvention                          | Beschreibung                        |
| ------- | ----------------------------------------- | ----------------------------------- |
| Feature | `feature/<issue-id>-<kurze-beschreibung>` | Neue Funktionalität oder User Story |
| Bugfix  | `bugfix/<issue-id>-<kurze-beschreibung>`  | Korrektur von Fehlern               |
| Docs    | `docs/<issue-id>-<kurze-beschreibung>`    | Änderungen an Dokumentation         |

Beispiele:

```
feature/2-login-system
bugfix/1-validation-error
docs/3-gitworkflow
```

## 4. Issuesystem

### Erstellung von Issues

Jede Aufgabe, Story oder Fehlermeldung wird über ein GitHub Issue erstellt.
Das Issue soll mindestens enthalten:

* Titel: prägnant und beschreibend
* Beschreibung: was soll erreicht werden
* Akzeptanzkriterien: wann gilt das Issue als erledigt
* Labels: zur Kategorisierung (z. B. feature, bug, documentation)
* Zuständigkeit: verantwortliches Teammitglied

### Issue-Templates

Alle Issues sollen dem Label zugehörigen Template folgen.

## 5. Branching & Workflow

### Standardablauf

1. **Issue auswählen oder erstellen**
   z. B. #1 „Login implementieren“

2. **Branch anlegen**

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/login
   ```

3. **Entwicklung durchführen**

   * Regelmäßig committen (kleine, sinnvolle Einheiten)
   * Commit Messages im richtigen Format

4. **Push & Pull Request erstellen**

   ```bash
   git push origin feature/login
   ```

   Danach über GitHub einen PR auf `develop` eröffnen.

5. **Code Review**

   * Mindestens 1 Approval eines anderen Teammitglieds
   * Branch danach löschen

## 6. Pull Requests

### Anforderungen an PRs

Jeder PR muss:

* auf ein vorhandenes Issue referenzieren (z. B. *Closes #1*)
* Beschreibung enthalten
* Tests / Review-Checkliste erfüllen
* ggf. Konflikte auflösen

### PR Review Checkliste

* [ ] Funktioniert der Code wie erwartet?
* [ ] Ist er lesbar, verständlich und dokumentiert?
* [ ] Betrifft der PR keine ungewollten Dateien (z. B. IDE-Settings)?

## 7. Commit-Standards

### Format

```markdown
<type>(<scope>): <beschreibung>
```

**Beispiele:**

```markdown
feat(login): implementiere Authentifizierung
fix(api): behebt Timeout bei GET-Anfrage
docs(ux-concept): fügt Persona hinzu
```

### Commit-Typen

| Typ  | Bedeutung                   |
| ---- | --------------------------- |
| feat | neue Funktionalität         |
| fix  | Bugfix                      |
| docs | Dokumentationsänderung      |
| test | Hinzufügen/Ändern von Tests |

## 8. Reviews & Merge-Prozess

* PR eröffnen, Reviewer zuweisen
* Reviewer prüft Änderungen, gibt Feedback oder Approval
* Nach mindestens einem Approval: Merge in `develop`
* Branch löschen (lokal und remote)
