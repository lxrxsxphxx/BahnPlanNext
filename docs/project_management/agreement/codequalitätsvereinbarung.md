# Codequalitätsvereinbarung

**Zweck:**
Gemeinsame Erwartungen, Regeln und Praktiken zur Sicherstellung von lesbarem, wartbarem und zuverlässigem Code

## 1. Grundprinzipien

* **Modularisierung:** kleine, unabhängige Bausteine
* **Kopplung & Zusammenhalt:** Module sollten klar definierte Verantwortlichkeiten haben
* **Information Hiding:** nach außen saubere Schnittstellen
* **Separation of Concerns:** jede Komponente hat eine klar definierte Aufgabe
* **Hierarchisierung:** Komplexität durch Ebenen und Schichten reduzieren

### 1.2 Best-Practice-Prinzipien

* **DRY:** keine unnötige Wiederholungen
* **KISS:** unnötige Komplexität vermeiden
* **YAGNI:** nur entwickeln was wirklich benötigt wird
* **SOLID:** saubere Verantwortungsaufteilung

## 2. Code Style & Layout

### 2.1 Allgemeine Formatierungsregeln

* **Sprache:** Englisch für Code, Kommentare, Commits und Branches

* **Einrückung:**

  * Python: 4 Spaces
  * JavaScript: 2 Spaces

* **Maximale Zeilenlänge:** 79

* **Keine ungenutzten Variablen**

* **Leerzeilen:**

  * 2 Leerzeilen zwischen Funktionen/Klassen
  * 1 Leerzeile zwischen Methoden in Klassen
  * 1 Leerzeile zwischen logischen Abschnitten innerhalb einer Funktion

* **Imports:**

  1. Standardbibliothek
  2. Drittanbieter
  3. Lokale/Projekt-Imports

  jeweils getrennt durch eine Leerzeile

### 2.2 JavaScript-spezifisch

* `===` statt `==`
* Kein `var`, nur `let` oder `const`

## 3. Namenskonventionen

| Element             | JavaScript             | Python                 |
| ------------------- | ---------------------- | ---------------------- |
| Dateien             | `kebab-case`           | `snake_case`           |
| Klassen             | `PascalCase`           | `PascalCase`           |
| Funktionen/Methoden | `camelCase`            | `snake_case`           |
| Variablen           | `camelCase`            | `snake_case`           |
| Konstanten          | `SCREAMING_SNAKE_CASE` | `SCREAMING_SNAKE_CASE` |

* Namen sollen aussagekräftig sein
* Boolean-Variablen beginnen mit `is`, `has`, `can`, `should`

## 4. Dokumentation & Kommentare

### 4.2 Kommentarregeln

* Kommentare erklären präzise und verständlich
  * warum, wenn die Intention nicht sofort klar ist
  * was, wenn der Codeblock länger ist
  * was, in jedem abgegrenzten logischen abschnitt
* keine doppelten Kommentare
* Workcomments klar markieren: (vor pushen auf main löschen)

  * `// TODO:`
  * `// FIXME:`

### 4.1 DocStringregeln 

* am Anfang einer Datei:
  * Zweck der Datei
  * enthaltene Hauptkomponenten (Klassen, wichtige Funktionen)
  * wofür sie im Gesamtsystem gebraucht wird

* jede Klasse:
  * Zweck / Verantwortlichkeit der Klasse
  * wichtigste Attribute
  * zentrale Methoden oder das generelle Verhalten

* jede Funktion/Methode erhält einen Docstring
  * Zweck
  * falls Notwendig, Einschränkungen/ Annahmen beschreiben

* Ausnahmen:
  * eindeutig (1–2 Zeilen, selbsterklärend)
  * intern und von Bedeutung her klar durch Namen beschrieben

* Docstrings müssen folgende Struktur enthalten:
  * Kurzbeschreibung
  * Args/Parameters: Typ + Beschreibung
  * Returns: Typ + Bedeutung

### 4.2 Python Docstrings

```python

def some_function(argument1):
    """
    Summary or Description of the Function

    Args:
    argument1 (int): Description of arg1

    Returns:
    int:Returning value

   """

    return argument1
```

Beispiel:

```python

def load_user(id: int) -> User:
    """
    Load a user by ID

    Args:
        id (int): Unique id of the user

    Returns:
        User: The loaded user object

    """
```

### 4.3 JavaScript JSDoc

```js
/**
 * @description describing
 * @param {int} name - Description of arg1
 * @returns {(Object|null)} Description of Returncases
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}
```

Beispiel:

```js
/**
 * Loads a user by ID.
 * @param {number} id - Unique id of the user
 * @returns {Promise<User>}
 */
```
