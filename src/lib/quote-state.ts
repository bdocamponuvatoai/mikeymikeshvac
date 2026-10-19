import type { QuoteErrors } from './quote-schema';

/** What the quote Server Action returns. `at` makes each result distinct, so focus moves once per result. */
export type QuoteState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: QuoteErrors; at: number }
  | { status: 'limited'; at: number }
  | { status: 'sent'; at: number }
  | { status: 'fallback'; mailto: string; text: string; at: number };

export const initialQuoteState: QuoteState = { status: 'idle' };
