import React from "react";
import { useLoaderData } from "react-router-dom";

export default function RecordList() {
  const records = useLoaderData();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {records.map((rec) => (
            <li key={rec.id} className="border-b py-2">
              {rec.name} — {rec.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
