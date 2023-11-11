import React, {useState} from 'react';
export default function CustomSearch({label, placeholder,defaultInput, setSearch, resetDefaultInput}){
    const [input, setInput] = useState(null);
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex flex-row">
                <input
                    type="text"
                    placeholder={placeholder}
                    defaultValue={defaultInput}
                    onChange={(e) => setInput(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm w-full"
                />
                <button
                    className="bg-blue-500 text-white px-3 py-2 rounded-md ml-0"
                    onClick={() => setSearch(input)}
                >
                    Search
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md ml-0"
                    onClick={() => {
                        resetDefaultInput();
                        setSearch(null);
                        
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    )
}