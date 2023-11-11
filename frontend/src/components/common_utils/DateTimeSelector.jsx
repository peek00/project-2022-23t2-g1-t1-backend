import React from "react";

export default function DateTimeSelector({id, label, datetime, setDatetime, minDateTime}) {

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
      <input type='datetime-local' id={id} value={datetime} onChange={(e) => setDatetime(e.target.value)} min={minDateTime} className="border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm w-full" />
    </div>
  )
}