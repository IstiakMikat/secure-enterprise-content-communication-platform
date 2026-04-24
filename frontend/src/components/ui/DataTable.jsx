import StatusBadge from "./StatusBadge";

function DataTable({ columns, rows }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.title || row.name}-${index}`} className="border-t border-white/5">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-200">
                    {column.key === "status" ? (
                      <StatusBadge>{row[column.key]}</StatusBadge>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

