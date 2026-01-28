import { API_BASE_URL } from './api';

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Error der sicher ist und dem Nutzer direkt angezeigt werden kann.
 */
export class UserFacingError extends Error {
  cause: undefined;
  stack: undefined;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Json Datentyp für Antwort der Anfrage zu offenen Ausschreibungen
 */
interface OpenTenderOut {
  id: number;
  name: string;
  description: string | null;
  difficulty: Difficulty;

  route: string;

  contract_start: string | null;

  //bids_count: number;
}

/**
 * Datentyp für offene Ausschreibungen
 */
export interface OpenTender {
  id: number;
  name: string;
  description?: string;
  difficulty: Difficulty;

  route: string;

  contractStart?: Date;

  //bidsCount: number;
}

/**
 * Anfrage für offenen Ausschreibungen
 * @throws {UserFacingError}
 * @returns Liste mit offenen Ausschreibungen
 */
export async function getOpenTenders(): Promise<OpenTender[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tender/open`);

    if (!response.ok) {
      if (response.status === 401)
        throw new UserFacingError(
          'Nicht authentifiziert, Token ungültig, abgelaufen oder Account nicht aktiviert.',
        );
      else if (response.status === 500)
        throw new UserFacingError(
          'Interner Server Error beim Abfragen der offenen Ausschreibungen.',
        );
      else
        throw new UserFacingError(
          'Unbekannter Fehler beim Abfragen der offenen Ausschreibungen.',
        );
    }

    let tenders: OpenTenderOut[] = await response.json();

    return tenders.map<OpenTender>((tender) => {
      const contractStart = tender.contract_start
        ? new Date(tender.contract_start)
        : undefined;
      return {
        id: tender.id,
        name: tender.name,
        description: tender.description ?? undefined,
        difficulty: tender.difficulty,
        route: tender.route,
        contractStart: contractStart,
        //bids_count: tender.bids_count,
      };
    });
  } catch (error) {
    if (error instanceof UserFacingError) {
      throw error;
    } else if (error instanceof SyntaxError) {
      console.error(
        new Error(
          'The server response for open tenders failed to parse as json.',
          { cause: error },
        ),
      );

      throw new UserFacingError(
        'Unerwartete Server Antwort beim Abfragen der offenen Ausschreibungen.',
      );
    } else {
      console.error(
        new Error('An unknown error was caused.', { cause: error }),
      );

      throw new UserFacingError(
        'Unbekannter Fehler beim Abfragen der offenen Ausschreibungen.',
      );
    }
  }
}
