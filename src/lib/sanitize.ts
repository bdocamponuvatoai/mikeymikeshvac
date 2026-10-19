/**
 * Input cleaning shared by the client and the Server Action.
 * Single-line fields lose every control and line-separator character, so nothing
 * typed into a form can reach an email header. Multi-line fields keep newlines only.
 */

// C0 and C1 control characters, DEL, and the Unicode line/paragraph separators.
const CONTROL = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;
// The same set, minus \n.
const CONTROL_EXCEPT_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u2028\u2029]/g;

export function cleanLine(value: string): string {
  return value.replace(CONTROL, ' ').replace(/\s{2,}/g, ' ').trim();
}

export function cleanMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_EXCEPT_NEWLINE, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
