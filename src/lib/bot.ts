/** Name of the hidden honeypot input. Deliberately meaningless so browser autofill leaves it alone. */
export const HONEYPOT_FIELD = 'mm_ref_x';
/** Hidden field carrying the time spent on the form, written at submit time. */
export const ELAPSED_FIELD = 'mm_t';
/** People need longer than this to fill in five fields. */
export const MIN_SUBMIT_MS = 3000;

export type BotVerdict = { bot: false } | { bot: true; reason: 'honeypot' | 'too-fast' | 'no-timing' };

export function checkBot({ honeypot, elapsed }: { honeypot: unknown; elapsed: unknown }): BotVerdict {
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return { bot: true, reason: 'honeypot' };
  const ms = typeof elapsed === 'string' && elapsed.trim() !== '' ? Number(elapsed) : NaN;
  if (!Number.isFinite(ms)) return { bot: true, reason: 'no-timing' };
  if (ms < MIN_SUBMIT_MS) return { bot: true, reason: 'too-fast' };
  return { bot: false };
}
