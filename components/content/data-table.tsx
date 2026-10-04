type DataTableProps = {
  caption: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
};

/** Comparison table; scrolls horizontally on narrow screens with a sticky first column. */
export function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      className="overflow-x-auto rounded-md border border-line"
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-small">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 border-b border-line bg-surface p-3">
              <span className="sr-only">Aspect</span>
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-line bg-surface p-3 font-medium text-fg"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th
                scope="row"
                className="sticky left-0 bg-surface p-3 align-top font-mono text-caption font-medium text-fg-muted uppercase"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.label}-${index}`}
                  className="bg-canvas-alt p-3 align-top text-fg-secondary"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
