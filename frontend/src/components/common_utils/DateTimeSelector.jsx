import React from "react";

export default function DateTimeSelector({id, label, datetime, setDatetime, minDateTime}) {

  return (

    <div className="flex flex-col mr-10">
      <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
      <input type='datetime-local' id={id} value={datetime} onChange={(e) => setDatetime(e.target.value)} min={minDateTime} className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md" />
    </div>
  )
}