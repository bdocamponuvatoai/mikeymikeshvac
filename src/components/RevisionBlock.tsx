import { home } from '@/lib/content';
import { history } from '@/lib/site';

/** Mike's history set as a drawing's revision block: the table that records every change to a sheet. */
export function RevisionBlock({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const rule = tone === 'dark' ? 'border-rule-dark' : 'border-ink';
  const muted = tone === 'dark' ? 'text-on-dark-muted' : 'text-muted';
  const accent = tone === 'dark' ? 'text-copper-bright' : 'text-copper';
  return (
    <table className={`w-full border-collapse border ${rule} text-left`}>
      <thead>
        <tr className={`border-b ${rule}`}>
          <th scope="col" className={`label w-28 px-4 py-3 font-medium ${muted}`}>
            {home.story.tableHead.when}
          </th>
          <th scope="col" className={`label border-l ${rule} px-4 py-3 font-medium ${muted}`}>
            {home.story.tableHead.what}
          </th>
        </tr>
      </thead>
      <tbody>
        {history.map((h) => (
          <tr key={h.what} className={`border-b ${rule} last:border-b-0`}>
            <th scope="row" className={`label px-4 py-4 align-top font-medium ${accent}`}>
              {h.when}
            </th>
            <td className={`border-l ${rule} px-4 py-4`}>{h.what}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
